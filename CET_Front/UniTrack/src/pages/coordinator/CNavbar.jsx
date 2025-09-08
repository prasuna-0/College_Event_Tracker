import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function CNavbar() {
  const navLinkStyle = {
    color: "black",
    textDecoration: "none",
    padding: "8px 16px",
    fontWeight: 500,
    fontSize: "16px",
    borderRadius: "4px",
  };

  const activeStyle = {
    textDecoration:"doted",
    color:"#6464c6"
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.logoSection}>
          <img src="/logo.jpg" alt="Logo" style={styles.logo} />
          <h1 style={styles.title}>UniTracker</h1>
        </div>

        <nav style={styles.nav}>
          <NavLink to="/coordinator" end style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Home</NavLink>
          <NavLink to="/coordinator/gallery" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Gallery</NavLink>
          <NavLink to="/coordinator/events" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Events</NavLink>
          <NavLink to="/coordinator/calendar" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Calendar</NavLink>
          <NavLink to="/coordinator/report" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Report</NavLink>
          <NavLink to="/coordinator/notifications" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>
            <FontAwesomeIcon icon={faBell} />
          </NavLink>
          <NavLink to="/login" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeStyle } : navLinkStyle}>Logout</NavLink>
        </nav>
      </div>
    </header>
  );
}

const styles = {
header: {
  backgroundColor: "#f8f8f8ff",
  padding: "16px",
  color: "black",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  zIndex: 1000,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
},

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    height: "60px",
  },
  title: {
    fontSize: "22px",
    margin: 0,
  },
  nav: {
    display: "flex",
    gap: "12px",
  },
};
