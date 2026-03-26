import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import EmployeeAddPage from "./pages/EmployeeAddPage";
import EmployeeListPage from "./pages/EmployeeListPage";
import AttendanceAddPage from "./pages/AttendanceAddPage";
import AttendanceListPage from "./pages/AttendanceListPage";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <div className="page-header">
          <h1>HRMS Lite</h1>
          <p>Employee Management & Attendance Tracking</p>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/employees/list" replace />} />
          <Route path="/employees/add" element={<EmployeeAddPage />} />
          <Route path="/employees/list" element={<EmployeeListPage />} />
          <Route path="/attendance/add" element={<AttendanceAddPage />} />
          <Route path="/attendance/list" element={<AttendanceListPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;