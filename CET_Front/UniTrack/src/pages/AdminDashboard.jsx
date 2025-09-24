import NavbarD from "../components/NavbarD";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const layoutStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
};

const contentWrapperStyle = {
  display: "flex",
  flex: 1,
};

const mainStyle = {
  flex: 1,
  padding: "20px",
  backgroundColor: "#f4f4f4",
};

function AdminDashboard() {
  return (
    <div style={layoutStyle}>
      <NavbarD/>
      <div style={contentWrapperStyle}>
        <Sidebar/>
        <main style={mainStyle}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
