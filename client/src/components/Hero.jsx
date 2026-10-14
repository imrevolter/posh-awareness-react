import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  { key: 'slide1', bg: '/images/slide1.jpeg', title: 'Safe Campus Initiative', sub: 'Promoting Awareness and Safety' },
  { key: 'slide2', bg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f', title: <Link to="/posh">Know Your Rights</Link>, sub: 'Understand POSH Act 2013' },
  { key: 'slide3', bg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', title: <Link to="/icc">Meet Your ICC</Link>, sub: 'Internal Complaints Committee' }
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div
          key={s.key}
          className="hero-slide"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${s.bg})`,
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? 'auto' : 'none'
          }}
        >
          <h1>{s.title}</h1>
          <p>{s.sub}</p>
        </div>
      ))}
      <div className="hero-pagination">
        {slides.map((s, i) => (
          <button
            key={s.key}
            type="button"
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
