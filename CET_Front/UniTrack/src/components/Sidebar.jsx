


import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaFileAlt, 
  FaUsers, 
  FaMoneyBillWave, 
  FaBell, 
  FaCalendarAlt,
  FaReceipt, 
  FaUser
} from "react-icons/fa";

const sidebarStyle = {
  width: "220px",
  backgroundColor: "#ffffff",
  padding: "20px",
  boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  height: "100vh",
  position: "fixed",
  top: "70px",
  left: 0,
  overflowY: "auto",
  borderRight: "1px solid #E5E7EB",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const linkBaseStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 15px",
  textDecoration: "none",
  color: "#374151",
  borderRadius: "8px",
  marginBottom: "8px",
  transition: "0.3s",
  fontWeight: "500",
  fontSize: "15px",
};

const activeLinkStyle = {
  backgroundColor: "#2563EB",
  color: "white",
};

const hoverStyle = {
  backgroundColor: "#E0E7FF",
};

// Icon colors
const iconColors = {
  Dashboard: "#2563EB",     
  Reports: "#6B7280",       
  Volunteer: "#16A34A",     
  Budget: "#7C3AED",      
  Notifications: "#F59E0B", 
  Calendar: "#0284C7",      
  Expense: "#DC2626",  
  "Manage Users": "#dc268dff",  
};


function Sidebar() {
  const isFixedAdmin = localStorage.getItem("isFixedAdmin") === "true";

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Reports", path: "/admin/reports", icon: <FaFileAlt /> },
    { name: "Volunteer", path: "/admin/volunteer", icon: <FaUsers /> },
    { name: "Budget", path: "/admin/budget", icon: <FaMoneyBillWave /> },
    { name: "Notifications", path: "/admin/notifications", icon: <FaBell /> },
    { name: "Calendar", path: "/admin/calendar", icon: <FaCalendarAlt /> },
    { name: "Expense", path: "/admin/expense", icon: <FaReceipt /> },
    ...(!isFixedAdmin ? [{ name: "Manage Users", path: "/admin/manageusers", icon: <FaUser /> }] : []),
  ];

  return (
    <aside style={sidebarStyle}>
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          style={({ isActive }) =>
            isActive
              ? { ...linkBaseStyle, ...activeLinkStyle }
              : linkBaseStyle
          }
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span style={{ color: iconColors[item.name], fontSize: "18px" }}>{item.icon}</span>
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}


export default Sidebar;


