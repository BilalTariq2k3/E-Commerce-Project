"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const notice = searchParams.get("notice");
  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallbackUrl =
    callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/admin/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      if (res.error.toLowerCase().includes("email")) {
        setEmailError(res.error);
        toast.error(res.error);
      } else if (res.error.toLowerCase().includes("password")) {
        setPasswordError(res.error);
        toast.error(res.error);
      }
    } else {
      router.replace(safeCallbackUrl);
      router.refresh();
      toast.success("login successfully");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold">E-SHOP</h2>
              <p>Admin Login Portal</p>
            </div>

            {notice === "session_reset" && (
              <p className="alert alert-info small" role="alert">
                Your previous session was invalid or expired. Please sign in again.
              </p>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}
              </div>

              <div className="mb-3 input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="form-control"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/\s/g, "");
                    setPassword(value);
                    setPasswordError("");
                  }}
                />
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login{" "}
              </button>
              {/* <p className="text-center mt-3">
                Dont have an account? <Link href="../signup">signup</Link>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
 