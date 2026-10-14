import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { submitComplaint } from '../api.js'

export default function ComplaintForm() {
  const [anonymous, setAnonymous] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [incident, setIncident] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!incident.trim()) return
    setSubmitting(true)
    try {
      const finalName = anonymous ? 'Anonymous' : name
      const finalEmail = anonymous ? 'anonymous@report.com' : email
      const { complaintID } = await submitComplaint({
        name: finalName,
        email: finalEmail,
        incident,
        isAnonymous: anonymous
      })

      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      if (publicKey && serviceId && templateId) {
        try {
          await emailjs.send(serviceId, templateId, { name: finalName, email: finalEmail, incident }, publicKey)
        } catch (emailErr) {
          console.error('Email notification failed', emailErr)
        }
      }

      alert(`Complaint submitted successfully!\nID: ${complaintID}`)
      setName('')
      setEmail('')
      setIncident('')
      setAnonymous(false)
    } catch (err) {
      alert(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="form-control mb-3"
        placeholder="Your Name"
        value={anonymous ? 'Anonymous' : name}
        onChange={e => setName(e.target.value)}
        disabled={anonymous}
      />
      <input
        className="form-control mb-3"
        placeholder="Email"
        value={anonymous ? 'anonymous@report.com' : email}
        onChange={e => setEmail(e.target.value)}
        disabled={anonymous}
      />
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="anonymous"
          checked={anonymous}
          onChange={e => setAnonymous(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="anonymous">Submit anonymously</label>
      </div>
      <textarea
        className="form-control mb-3"
        rows="5"
        placeholder="Describe incident"
        required
        value={incident}
        onChange={e => setIncident(e.target.value)}
      />
      <button className="btn btn-primary w-100" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  )
}
