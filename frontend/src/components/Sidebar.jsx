import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">HRMS Lite</div>

      <div className="sidebar-section">
        <div className="sidebar-title">Employees</div>

        <NavLink
          to="/employees/list"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Employee List
        </NavLink>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">Attendance</div>

        <NavLink
          to="/attendance/list"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Attendance List
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;