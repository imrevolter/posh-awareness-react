import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import complaintsRouter from './routes/complaints.js'
import authRouter from './routes/auth.js'
import chatRouter from './routes/chat.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/complaints', complaintsRouter)
app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)

app.get('/api/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
