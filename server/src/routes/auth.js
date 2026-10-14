import { Router } from 'express'
import { issueToken } from '../authStore.js'

const router = Router()

router.post('/login', (req, res) => {
  const { password } = req.body || {}
  const expected = process.env.ADMIN_PASSWORD
  if (expected && password === expected) {
    return res.json({ token: issueToken() })
  }
  res.status(401).json({ error: 'Invalid password' })
})

export default router
