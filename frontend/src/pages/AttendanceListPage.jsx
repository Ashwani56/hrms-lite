import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const initialFilters = {
  employee: "",
  employee_id: "",
  employee_name: "",
  status: "",
  date: "",
  date_from: "",
  date_to: "",
};

function AttendanceListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const fetchAttendance = async (customFilters = filters) => {
    setLoading(true);

    try {
      const params = {};
      if (customFilters.employee) params.employee = customFilters.employee;
      if (customFilters.employee_id) params.employee_id = customFilters.employee_id;
      if (customFilters.employee_name) params.employee_name = customFilters.employee_name;
      if (customFilters.status) params.status = customFilters.status;
      if (customFilters.date) params.date = customFilters.date;
      if (customFilters.date_from) params.date_from = customFilters.date_from;
      if (customFilters.date_to) params.date_to = customFilters.date_to;

      const response = await api.get("/attendance/", { params });
      setAttendanceList(response?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(initialFilters);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchAttendance(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchAttendance(initialFilters);
  };

  const handleDeleteAttendance = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this attendance record?");
    if (!confirmed) return;

    try {
      const response = await api.delete(`/attendance/${id}/`);
      toast.success(response?.data?.message || "Attendance deleted successfully.");
      fetchAttendance(filters);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete attendance record.");
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-head">
        <h2>Attendance List</h2>
        <button className="top-action-btn" onClick={() => navigate("/attendance/add")}>
          + Mark Attendance
        </button>
      </div>

      <form className="grid-form filter-form" onSubmit={handleApplyFilters}>
        <input
          type="number"
          name="employee"
          placeholder="Filter by Employee DB ID"
          value={filters.employee}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="employee_id"
          placeholder="Filter by Employee ID"
          value={filters.employee_id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="employee_name"
          placeholder="Filter by Employee Name"
          value={filters.employee_name}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} />
        <input type="date" name="date_to" value={filters.date_to} onChange={handleFilterChange} />

        <div className="btn-row">
          <button type="submit">Apply Filters</button>
          <button type="button" className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading attendance records...</p>
      ) : attendanceList.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employee_code}</td>
                  <td>{item.employee_name}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.status}</td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteAttendance(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceListPage;