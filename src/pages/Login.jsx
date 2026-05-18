import React, { useState } from "react";
import axios from "../Untils/axiosInstance";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // ⭐ ADDED

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const Submit = async (e) => {
    e.preventDefault();

    let email = form.email.trim();
    let pass = form.password.trim();

    if (email === "" || pass === "") {
      alert("Please fill in all fields!");
      return;
    }

    if (!(email.includes("@") && email.includes(".com"))) {
      alert("Please enter a valid email!");
      return;
    }
    try {
      setLoading(true); // ⭐ START LOADING

      const res = await axios.post(
        "https://makemytrip-back-end.onrender.com/api/login/",
        {
          email: form.email,
          password: form.password,
        }
      );

      console.log(res.data);

      alert("Login Successful ✅");
    const user = res.data.user || res.data;
      
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify(user));

      const user = res.data.user;

      if (user?.is_superuser) {
        navigate("/admin-dashboard");
      } else if (res.data.role === "company") {
        navigate("/airline-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false); // ⭐ STOP LOADING
    }
  };

  return (
    <div className="login-container">

      <form className="login-form" onSubmit={Submit}>

        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* ⭐ SIGNUP NAVIGATION BUTTON */}
        <p className="signup-text">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "#007bff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </span>
        </p>

      </form>
    </div>
  );
};

export default Login;