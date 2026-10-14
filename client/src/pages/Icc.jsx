const members = [
  { img: "/images/Ankita ma'am.png", name: 'Dr Ankita Yadav', role: 'Presiding Officer' },
  { img: '/images/Anirudh.png', name: 'Anirudh Mishra', role: 'Faculty Member' },
  { img: '/images/Deepesh.png', name: 'Deepesh Sonkar', role: 'External Member' },
  { img: '/images/garv.png', name: 'Garv Sirohi', role: 'Staff Representative' },
  { img: '/images/prashant.png', name: 'Prashant Gautam', role: 'Student Representative' }
]

export default function Icc() {
  return (
    <>
      <div className="info-hero">
        <div>
          <h1>Internal Complaints Committee</h1>
          <p>POSH Cell - IIT Jammu</p>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-5">Meet Your ICC</h2>
        <div className="row g-4">
          {members.map(m => (
            <div className="col-md-4" key={m.name}>
              <div className="card text-center p-4">
                <img className="member-img" src={m.img} alt={m.name} />
                <h5 className="mt-3">{m.name}</h5>
                <p>{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
