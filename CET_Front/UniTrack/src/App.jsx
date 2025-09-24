
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/admin/Dashboard";
import Reports from "./pages/admin/Reports";
import CreateEvent from "./components/CreateEvent";
import Budget from "./pages/admin/Budget";
import Calender from "./pages/admin/Calender";
import Volunteer from "./pages/admin/Volunteer";
import Notification from "./pages/admin/Notification";
import CreateVolunteer from "./components/CreateVolunteer";
import CreateVTeam from "./components/CreateVTeam";
import Gallery from "./pages/student/Gallery";
import Events from "./pages/student/Events";
import Notifications from "./pages/student/Notifications";
import SHero from "./pages/student/SHero";
import Calendar from "./pages/student/Calendar";
import CGallery from "./pages/coordinator/CGallery";
import CEvents from "./pages/coordinator/CEvents";
import CCalendar from "./pages/coordinator/CCalendar";
import CReports from "./pages/coordinator/CReports";
import CHero from "./pages/coordinator/CHero";
import CNotification  from "./pages/coordinator/CNotification";
import AlbumDetail from "./pages/coordinator/AlbumDetails";
import AlbumDetails from "./pages/student/SAlbumDetails";
import Expense from "./pages/admin/Expense";
import ManageUsers from "./pages/admin/ManageUsers";
// import ErrorBoundary from "./components/ErrorBoundary";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
        
        <Route path="/student" element={<StudentDashboard/>}>
         <Route index element={<SHero/>} />
        <Route path="gallery" element={<Gallery/>}/>
        <Route path="events" element={<Events/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="calendar" element={<Calendar/>}/>
        <Route path="gallery/:id" element={<AlbumDetails/>}/>
        </Route>

         <Route path="/admin" element={<AdminDashboard/>}>
          <Route index element={<Dashboard/>} /> 
          <Route path="reports" element={<Reports/>} />

          <Route path="budget" element={<Budget/>}/>
          <Route  path="calendar" element={<Calender/>}/>
          <Route path="expense" element={<Expense/>}/>
          <Route  path="volunteer" element={<Volunteer/>}/>
          <Route path="notifications" element={<Notification/>}/>
           <Route path="/admin/create-event" element={<CreateEvent/>} />
           <Route path="/admin/create-volunteer" element={<CreateVolunteer/>}/>
           <Route path="/admin/create-team" element={<CreateVTeam/>}/>
           <Route path="/admin/manageusers" element={<ManageUsers/>}/>

        </Route>
        
         <Route path="/coordinator" element={<CoordinatorDashboard/>}> 
         <Route index element={<CHero/>}/> 
         <Route path="gallery" element={<CGallery/>}/> 
         <Route path="events" element={<CEvents/>}/> 
         <Route path="calendar" element={<CCalendar/>}/> 
         <Route path="report" element={<CReports/>}/> 
         <Route path="notifications" element={<CNotification/>}/>
         <Route path="gallery/:id" element={<AlbumDetail/>}/>
          </Route>

      </Routes>
    </Router>
  );
};

export default App;

