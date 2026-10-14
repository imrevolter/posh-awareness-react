import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-dark app-navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">SafeCampus IIT Jammu</Link>
        <div className="d-flex gap-3 align-items-center">
          <Link className="text-white text-decoration-none" to="/posh">POSH Act</Link>
          <Link className="text-white text-decoration-none" to="/icc">ICC</Link>
          <Link className="btn btn-light btn-sm" to="/admin">Admin Panel</Link>
        </div>
      </div>
    </nav>
  )
}
