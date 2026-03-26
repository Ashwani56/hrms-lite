import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

const initialForm = {
  employee_id: "",
  full_name: "",
  email: "",
  department: "",
};

function EmployeeAddPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFieldErrors({});

    try {
      const response = await api.post("/employees/", form);
      toast.success(response?.data?.message || "Employee created successfully.");
      setForm(initialForm);
      navigate("/employees/list");
    } catch (err) {
      const errors = err?.response?.data?.errors || {};
      const message = err?.response?.data?.message || "Failed to create employee.";

      setFieldErrors({
        employee_id: errors?.employee_id?.[0] || "",
        full_name: errors?.full_name?.[0] || "",
        email: errors?.email?.[0] || "",
        department: errors?.department?.[0] || "",
      });

      toast.error(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="page-card-head">
        <h2>Add Employee</h2>
      </div>

      <form className="grid-form" onSubmit={handleSubmit}>
        <div className="field-wrap">
          <input
            type="text"
            name="employee_id"
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={handleChange}
          />
          {fieldErrors.employee_id && (
            <div className="field-error">{fieldErrors.employee_id}</div>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
          />
          {fieldErrors.full_name && (
            <div className="field-error">{fieldErrors.full_name}</div>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && (
            <div className="field-error">{fieldErrors.email}</div>
          )}
        </div>

        <div className="field-wrap">
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />
          {fieldErrors.department && (
            <div className="field-error">{fieldErrors.department}</div>
          )}
        </div>

        <button type="submit" disabled={submitLoading}>
          {submitLoading ? "Saving..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
}

export default EmployeeAddPage;