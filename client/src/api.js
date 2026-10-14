const BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function submitComplaint(payload) {
  return request('/complaints', { method: 'POST', body: JSON.stringify(payload) })
}

export function login(password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) })
}

export function fetchComplaints(token, search = '') {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ''
  return request(`/complaints${qs}`, { headers: { Authorization: `Bearer ${token}` } })
}

export function resolveComplaint(token, id) {
  return request(`/complaints/${id}/resolve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
}
