import Hero from '../components/Hero.jsx'
import ComplaintForm from '../components/ComplaintForm.jsx'

export default function Home() {
  return (
    <>
      <Hero />

      <section className="container py-5">
        <h2 className="section-title">Understanding POSH</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h5>Protection</h5>
              <p>Ensures safety for women in workplaces and institutions.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h5>Justice</h5>
              <p>Provides fair complaint and investigation process.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <h5>Awareness</h5>
              <p>Encourages respectful and inclusive environment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="section-title">Types of Harassment</h2>
        <div className="row g-4">
          <div className="col-md-3"><div className="card p-4 text-center">Verbal</div></div>
          <div className="col-md-3"><div className="card p-4 text-center">Physical</div></div>
          <div className="col-md-3"><div className="card p-4 text-center">Online</div></div>
          <div className="col-md-3"><div className="card p-4 text-center">Hostile Environment</div></div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="section-title">Complaint Process</h2>
        <div className="timeline">
          <div className="timeline-item left">Incident Occurs</div>
          <div className="timeline-item right">File Complaint</div>
          <div className="timeline-item left">Investigation</div>
          <div className="timeline-item right">Resolution</div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="section-title">Report an Incident</h2>
        <ComplaintForm />
      </section>
    </>
  )
}
