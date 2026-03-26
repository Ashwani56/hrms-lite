import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const initialForm = {
  employee: "",
  date: "",
  status: "Present",
};

function AttendanceAddPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees/");
      setEmployees(response?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
      detail: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFieldErrors({});

    try {
      const payload = {
        ...form,
        employee: Number(form.employee),
      };

      const response = await api.post("/attendance/", payload);
      toast.success(response?.data?.message || "Attendance marked successfully.");
      setForm(initialForm);
      navigate("/attendance/list");
    } catch (err) {
      const errors = err?.response?.data?.errors || {};
      const message = err?.response?.data?.message || "Failed to mark attendance.";

      setFieldErrors({
        employee: errors?.employee?.[0] || "",
        date: errors?.date?.[0] || "",
        status: errors?.status?.[0] || "",
        detail: errors?.detail?.[0] || "",
      });

      toast.error(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-head">
        <h2>Mark Attendance</h2>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <div className="field-wrap">
          <select name="employee" value={form.employee} onChange={handleChange}>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.employee_id} - {emp.full_name}
              </option>
            ))}
          </select>
          {fieldErrors.employee && (
            <div className="field-error">{fieldErrors.employee}</div>
          )}
        </div>

        <div className="field-wrap">
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {fieldErrors.date && <div className="field-error">{fieldErrors.date}</div>}
          {fieldErrors.detail && <div className="field-error">{fieldErrors.detail}</div>}
        </div>

        <div className="field-wrap">
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          {fieldErrors.status && (
            <div className="field-error">{fieldErrors.status}</div>
          )}
        </div>

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? "Saving..." : "Mark Attendance"}
        </button>
      </form>
    </div>
  );
}

export default AttendanceAddPage;