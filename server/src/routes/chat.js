import { Router } from 'express'

const router = Router()

router.post('/', async (req, res) => {
  const { message } = req.body || {}
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.json({ reply: "The chatbot isn't configured yet. Add OPENAI_API_KEY to server/.env to enable it." })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      })
    })
    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || data.error?.message || 'No response'
    res.json({ reply })
  } catch {
    res.status(500).json({ error: 'Error connecting to AI' })
  }
})

export default router
