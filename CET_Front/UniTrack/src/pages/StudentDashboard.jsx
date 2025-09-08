import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/SNavbar";
import "./StudentDashboard.css"

export default function StudentDashboardLayout() {
  return (
    <>
      <StudentNavbar/>
      <main style={{backgroundColor:"white",height:"100vh" }}>
        <Outlet />
      </main>
    </>
  );
}



