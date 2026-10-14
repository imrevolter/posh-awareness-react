import { isValidToken } from '../authStore.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token || !isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}
