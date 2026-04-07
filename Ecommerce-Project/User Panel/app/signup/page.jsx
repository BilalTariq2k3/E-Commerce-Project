"use client";
import { useState } from "react";
import axios from "axios";
import "../../styles/signup.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function User() {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    if (!nameRegex.test(fname))
      errors.fname = "First name must contain letters only";
    if (!nameRegex.test(lname))
      errors.lname = "Last name must contain letters only";
    if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
    if (!passwordRegex.test(password))
      errors.password =
        "Password must be 8+ chars, include number & special char";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setErrorMessage(errors);
    if (Object.keys(errors).length > 0) return;
    fname.trim();

    try {
      const response = await axios.post("/api/signup", {
        fname,
        lname,
        email,
        password,
      });
      toast.success("signup successfully");
      router.push("../login");
      setErrorMessage({});
      setSuccessMessage(response.data.message);

      setFName("");
      setLName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response) {
        setErrorMessage({ api: err.response.data.error });
      } else {
        setErrorMessage({ api: "Something went wrong" });
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold">E-SHOP</h2>
              <p>Create your account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="form-control"
                    value={fname}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/^\s+/, "");
                      value = value.replace(/\s{2,}/g, " ");
                      setFName(value);
                      setErrorMessage((prev) => ({ ...prev, fname: "" }));
                    }}
                  />
                  {errorMessage.fname && (
                    <small className="text-danger">{errorMessage.fname}</small>
                  )}
                </div>
                <div className="col">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="form-control"
                    value={lname}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/^\s+/, "");
                      value = value.replace(/\s{2,}/g, " ");
                      setLName(value);
                      setErrorMessage((prev) => ({ ...prev, lname: "" }));
                    }}
                  />
                  {errorMessage.lname && (
                    <small className="text-danger">{errorMessage.lname}</small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage((prev) => ({ ...prev, email: "" }));
                  }}
                />
                {errorMessage.email && (
                  <small className="text-danger">{errorMessage.email}</small>
                )}
              </div>

              <div className="mb-3 input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="form-control"
                  value={password}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\s/g, "");
                    setPassword(value);
                    setErrorMessage((prev) => ({ ...prev, password: "" }));
                  }}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errorMessage.password && (
                <small className="text-danger">{errorMessage.password}</small>
              )}

              <div className="mb-3 input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="form-control"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\s/g, "");
                    setConfirmPassword(value);
                    setErrorMessage((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                  }}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </span>
              </div>
              {errorMessage.confirmPassword && (
                <small className="text-danger">
                  {errorMessage.confirmPassword}
                </small>
              )}

              {errorMessage.api && (
                <div className="text-danger mb-2">{errorMessage.api}</div>
              )}
              {successMessage && (
                <div className="text-success mb-2">{successMessage}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Sign Up
              </button>
              <p className="text-center mt-3">
                Already have an account? <Link href="../login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
