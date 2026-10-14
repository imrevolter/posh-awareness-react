import { useState } from 'react'
import { sendChatMessage } from '../api.js'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setSending(true)
    try {
      const { reply } = await sendChatMessage(text)
      setMessages(m => [...m, { role: 'bot', text: reply }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: 'Error connecting to AI' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div id="chatbot-button" onClick={() => setOpen(o => !o)}>💬</div>
      {open && (
        <div id="chatbot" style={{ display: 'flex' }}>
          <div id="chat-header">SafeCampus AI Assistant</div>
          <div id="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={m.role}>{m.text}</div>
            ))}
            {sending && <div className="bot">Typing...</div>}
          </div>
          <div id="chat-input-area">
            <input
              id="chat-input"
              placeholder="Ask about POSH, ICC..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}
