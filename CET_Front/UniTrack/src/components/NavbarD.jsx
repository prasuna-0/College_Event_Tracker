
const NavbarD = () => {
  return (
    <>
        <header className="header h1">
        <div className="container header-inner">
          <div className="logo">
             <img src="logo.jpg"/>
            <h1>UniTracker</h1>
          </div>
          <div className="nav-buttons">
            <a href="/login" className="btn-outline">Logout</a>
          </div>
        </div>
      </header>
    </>
  )
}

export default NavbarD
