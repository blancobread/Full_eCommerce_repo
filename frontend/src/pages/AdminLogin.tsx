import { useState } from "react";
import api from "../api/api";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post("/admin/login", form)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        alert("Logged in!");
      })
      .catch(() => alert("Login failed"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Admin Login</h1>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}

export default AdminLogin;