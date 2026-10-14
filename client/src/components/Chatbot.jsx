import { useState } from 'react'
import { getBotReply } from '../chatbotRules.js'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getBotReply(text) }])
      setTyping(false)
    }, 500)
  }

  return (
    <>
      <div id="chatbot-button" onClick={() => setOpen(o => !o)}>💬</div>
      {open && (
        <div id="chatbot" style={{ display: 'flex' }}>
          <div id="chat-header">SafeCampus Assistant</div>
          <div id="chat-body">
            {messages.length === 0 && (
              <div className="bot">Hi! Ask me about the POSH Act, filing a complaint, the ICC, or confidentiality.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role}>{m.text}</div>
            ))}
            {typing && <div className="bot">Typing...</div>}
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
