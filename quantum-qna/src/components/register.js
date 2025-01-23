import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    terms: "",
  });

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      terms: "",
    };

    // Username validation
    if (formData.username.trim() === "") {
      newErrors.username = "Username is required.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8 || !/\d/.test(formData.password)) {
      newErrors.password =
        "Invalid password. Enter a password that is at least 8 characters long and contains a number.";
      isValid = false;
    }

    // Password match validation
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "The two passwords do not match.";
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the Terms and Conditions.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.message === "Registration successful") {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.error === "Username already exists") {
        setErrors({
          ...errors,
          username: "Username already exists.",
        });
      } else if (error.response?.data?.error === "Email already exists") {
        setErrors({
          ...errors,
          email: "Email address already in use.",
        });
      } else {
        setErrors({
          ...errors,
          username: "Registration failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register user</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            className={`form-control ${
              errors.repeatPassword ? "is-invalid" : ""
            }`}
            placeholder="Repeat Password"
            value={formData.repeatPassword}
            onChange={(e) =>
              setFormData({ ...formData, repeatPassword: e.target.value })
            }
          />
          {errors.repeatPassword && (
            <div className="error-message">{errors.repeatPassword}</div>
          )}
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={formData.agreeToTerms}
            onChange={(e) =>
              setFormData({ ...formData, agreeToTerms: e.target.checked })
            }
          />
          <label className="form-check-label">
            I agree to the Terms and Conditions and Privacy Policy
          </label>
          {errors.terms && <div className="error-message">{errors.terms}</div>}
        </div>

        <button type="submit" className="btn btn-primary register-btn">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
