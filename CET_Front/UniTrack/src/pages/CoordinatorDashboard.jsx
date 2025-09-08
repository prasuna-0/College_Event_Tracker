import CNavbar from "./coordinator/CNavbar"
import { Outlet } from "react-router-dom";

const CoordinatorDashboard = () => {
  return (
    <div>
      <CNavbar/>
      <main style={{backgroundColor:"white",height:"100vh" }}>
        <Outlet />
      </main>
    </div>
  )
}

export default CoordinatorDashboard
