import "./HomePage.css"


export default function HomePage() {
  return (
    <div className="homepage">
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
             <img src="logo.jpg"/>
            <h1>UniTracker</h1>
          </div>
          <div className="nav-buttons">
            <a href="/login" className="btn-outline">Login</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container text-center">
          <h2>Streamline Your College Events</h2>
          <p>
            Comprehensive event management system for colleges with role-based access, budget tracking,
            volunteer management, and real-time notifications.
          </p>
          <a href="/login" className="btn large">Get Started</a>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h3 className="section-title">Key Features</h3>
          <div className="features-grid">

            <div className="card">
              <i className="fas fa-users card-icon" ></i>
              <h4>Role-Based Access</h4>
              <p>Admin, Coordinator, and Student dashboards with appropriate permissions</p>
            </div>

            <div className="card">
              <i className="fas fa-calendar-alt card-icon" style={{color:"green"}}></i>
              <h4>Event Management</h4>
              <p>Create, edit, and manage events with calendar integration</p>
            </div>

            <div className="card">
              <i className="fas fa-chart-bar card-icon" style={{color:"purple"}}></i>
              <h4>Budget Tracking</h4>
              <p>Comprehensive budget analysis and reporting with visual charts</p>
            </div>

            <div className="card">
              <i className="fas fa-bell card-icon" style={{color:"orange"}}></i>
              <h4>Notifications</h4>
              <p>Real-time notifications for upcoming events and updates</p>
            </div>

            <div className="card">
              <i className="fas fa-upload card-icon" style={{color:"red"}}></i>
              <h4>Media Management</h4>
              <p>Upload and manage event photos and documents</p>
            </div>

            <div className="card">
              <i className="fas fa-search card-icon" style={{color:"darkGreen"}}></i>
              <h4>Advanced Search</h4>
              <p>Filter events by department, semester, status, and more</p>
            </div>

          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container text-center">
          <p>&copy; 2025 College Event Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


