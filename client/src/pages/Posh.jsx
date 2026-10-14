const points = [
  { title: '1. Protection for Women', text: 'The POSH Act protects women from sexual harassment at workplaces including educational institutions.' },
  { title: '2. Definition of Harassment', text: 'Includes physical contact, sexual remarks, showing pornography, or any unwelcome sexual behaviour.' },
  { title: '3. Internal Complaints Committee', text: 'Every institution must create an ICC to investigate complaints.' },
  { title: '4. Complaint Timeline', text: 'A complaint must be filed within 3 months of the incident.' },
  { title: '5. Confidentiality', text: 'The identity of the complainant and proceedings must remain confidential.' },
  { title: '6. Punishment', text: 'If harassment is proven, disciplinary action can be taken against the offender.' }
]

export default function Posh() {
  return (
    <>
      <div className="info-hero">
        <div>
          <h1>POSH Act 2013</h1>
          <p>Prevention of Sexual Harassment at Workplace</p>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-5">Key Points of POSH Act</h2>
        <div className="row g-4">
          {points.map(p => (
            <div className="col-md-4" key={p.title}>
              <div className="card p-4">
                <h5>{p.title}</h5>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
