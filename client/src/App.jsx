import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'
import Home from './pages/Home.jsx'
import Posh from './pages/Posh.jsx'
import Icc from './pages/Icc.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posh" element={<Posh />} />
        <Route path="/icc" element={<Icc />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <Chatbot />}
    </>
  )
}
