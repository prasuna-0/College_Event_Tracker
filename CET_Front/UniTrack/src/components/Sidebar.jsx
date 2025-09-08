import { NavLink } from "react-router-dom";

const sidebarStyle = {
  width: "220px",
  backgroundColor: "white",
  padding: "20px",
  boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  height: "100vh",
  position: "fixed",
  top: "100px",
  left: 0,
  overflowY: "auto",
};

const linkBaseStyle = {
  display: "block",
  padding: "10px 15px",
  textDecoration: "none",
  color: "#333",
  borderRadius: "4px",
  marginBottom: "8px",
  transition: "0.3s",
};

const activeLinkStyle = {
  backgroundColor: "#5880acff",
  color: "white",
};

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Volunteer", path: "/admin/volunteer" },
    { name: "Budget", path: "/admin/budget" },
    { name: "Notifications", path: "/admin/notifications" },
    { name: "Calendar", path: "/admin/calendar" },
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
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;



