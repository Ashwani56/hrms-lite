import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const initialFilters = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

function EmployeeListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async (customFilters = filters) => {
    setLoading(true);

    try {
      const params = {};
      if (customFilters.employee_id) params.employee_id = customFilters.employee_id;
      if (customFilters.full_name) params.full_name = customFilters.full_name;
      if (customFilters.email) params.email = customFilters.email;
      if (customFilters.department) params.department = customFilters.department;

      const response = await api.get("/employees/", { params });
      setEmployees(response?.data?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(initialFilters);
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
    fetchEmployees(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchEmployees(initialFilters);
  };

  const handleDeleteEmployee = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    try {
      const response = await api.delete(`/employees/${id}/`);
      toast.success(response?.data?.message || "Employee deleted successfully.");
      fetchEmployees(filters);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete employee.");
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-head">
        <h2>Employee List</h2>
        <button className="top-action-btn" onClick={() => navigate("/employees/add")}>
          + Add Employee
        </button>
      </div>

      <form className="grid-form filter-form" onSubmit={handleApplyFilters}>
        <input
          type="text"
          name="employee_id"
          placeholder="Filter by Employee ID"
          value={filters.employee_id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="full_name"
          placeholder="Filter by Full Name"
          value={filters.full_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Filter by Department"
          value={filters.department}
          onChange={handleFilterChange}
        />

        <div className="btn-row">
          <button type="submit">Apply Filters</button>
          <button type="button" className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.employee_id}</td>
                  <td>{item.full_name}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => handleDeleteEmployee(item.id)}
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

export default EmployeeListPage;