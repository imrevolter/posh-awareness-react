import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

function generateCode() {
  const year = new Date().getFullYear()
  const n = Math.floor(1000 + Math.random() * 9000)
  return `POSH-${year}-${n}`
}

router.post('/', (req, res) => {
  const { name, email, incident, isAnonymous } = req.body || {}
  if (!incident || !incident.trim()) {
    return res.status(400).json({ error: 'Incident description is required' })
  }
  const finalName = isAnonymous ? 'Anonymous' : (name || '').trim()
  const finalEmail = isAnonymous ? 'anonymous@report.com' : (email || '').trim()
  if (!finalName || !finalEmail) {
    return res.status(400).json({ error: 'Name and email are required unless submitting anonymously' })
  }

  let code = generateCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = db.prepare('SELECT id FROM complaints WHERE complaint_code = ?').get(code)
    if (!existing) break
    code = generateCode()
  }

  db.prepare(`
    INSERT INTO complaints (complaint_code, name, email, incident, is_anonymous)
    VALUES (?, ?, ?, ?, ?)
  `).run(code, finalName, finalEmail, incident.trim(), isAnonymous ? 1 : 0)

  res.status(201).json({ complaintID: code })
})

router.get('/', requireAuth, (req, res) => {
  const search = (req.query.search || '').trim()
  const rows = search
    ? db.prepare('SELECT * FROM complaints WHERE complaint_code LIKE ? ORDER BY id DESC').all(`%${search}%`)
    : db.prepare('SELECT * FROM complaints ORDER BY id DESC').all()
  res.json(rows)
})

router.patch('/:id/resolve', requireAuth, (req, res) => {
  const result = db.prepare("UPDATE complaints SET status = 'Resolved' WHERE id = ?").run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Complaint not found' })
  res.json({ ok: true })
})

export default router
