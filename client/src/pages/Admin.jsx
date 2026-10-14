import { useEffect, useState } from 'react'
import { login, fetchComplaints, resolveComplaint } from '../api.js'

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  async function load(currentToken, q) {
    setLoading(true)
    try {
      const data = await fetchComplaints(currentToken, q)
      setComplaints(data)
    } catch (err) {
      setError(err.message)
      setToken('')
      sessionStorage.removeItem('adminToken')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) load(token, search)
  }, [token])

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      const { token: newToken } = await login(password)
      sessionStorage.setItem('adminToken', newToken)
      setToken(newToken)
    } catch {
      setError('Wrong password')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminToken')
    setToken('')
    setComplaints([])
    setPassword('')
  }

  async function handleSearch(value) {
    setSearch(value)
    await load(token, value)
  }

  async function handleResolve(id) {
    await resolveComplaint(token, id)
    load(token, search)
  }

  if (!token) {
    return (
      <div className="admin-shell">
        <div id="loginBox">
          <h3>Admin Login</h3>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="form-control my-3"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="btn btn-light w-100">Login</button>
          </form>
          {error && <p className="mt-3 text-warning">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <nav className="navbar navbar-dark">
        <div className="container d-flex justify-content-between">
          <span className="navbar-brand">POSH Admin Panel</span>
          <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        <h3 className="mb-4">Complaints Dashboard</h3>
        <input
          className="form-control search-box"
          placeholder="Search by Complaint ID..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />

        {loading && <p>Loading...</p>}
        {!loading && complaints.length === 0 && <p>No complaints found.</p>}

        {complaints.map(c => (
          <div className="card p-3 mb-3" key={c.id}>
            <h5>{c.complaint_code}</h5>
            <p><b>Name:</b> {c.name}</p>
            <p><b>Email:</b> {c.email}</p>
            <p><b>Incident:</b> {c.incident}</p>
            <p>
              <span className={`status ${c.status === 'Pending' ? 'pending' : 'resolved'}`}>
                {c.status}
              </span>
            </p>
            {c.status === 'Pending' && (
              <button className="btn btn-success btn-sm" onClick={() => handleResolve(c.id)}>
                Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
