import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import bgImg from "../assets/imgs/auth-page-background.jpg";

type Mode = "signin" | "signup";

interface Props {
  initialMode?: Mode;
}

export default function AuthPage({ initialMode = "signin" }: Props) {
  const navigate = useNavigate();

  const BASE_URL = useMemo(
    () =>
      window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000"
        : "https://reflectra-backend.onrender.com",
    []
  );

  const [mode, setMode] = useState<Mode>(initialMode);
  const [mounted, setMounted] = useState(false);
  const isActive = mode === "signup";

  // Trigger entry animation once after initial paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ---------- Sign In ----------
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMsg, setLoginMsg] = useState("");

  // ---------- Sign Up ----------
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState("");

  // ---------- Reset Password (NEW) ----------
  const [showReset, setShowReset] = useState(false);
  type ResetStep = "request" | "confirm";
  const [resetStep, setResetStep] = useState<ResetStep>("request");

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPw, setResetNewPw] = useState("");
  const [resetNewPw2, setResetNewPw2] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg("");
    setLoginLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/login/`, {
        username: loginInput,
        password: loginPassword,
      });
      const { access, refresh, user } = res.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", user);
      setLoginMsg(`✅ Login successful! Welcome, ${user}`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err: any) {
      setLoginMsg(
        err?.response?.data?.error
          ? `❌ ${err.response.data.error}`
          : "⚠️ Server error. Please try again."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMsg("");
    if (regPassword !== regConfirm) {
      setRegMsg("❌ Passwords do not match.");
      return;
    }
    setRegLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/register/`, {
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });
      setRegMsg("✅ Registration successful! You can now sign in.");
      setLoginInput(regEmail || regUsername);
      setTimeout(() => {
        setMode("signin");
        setRegUsername("");
        setRegEmail("");
        setRegPassword("");
        setRegConfirm("");
      }, 800);
    } catch (err: any) {
      setRegMsg(
        err?.response?.data?.error
          ? `❌ ${err.response.data.error}`
          : "⚠️ Server error. Please try again."
      );
    } finally {
      setRegLoading(false);
    }
  };

  // ---------- Reset handlers (NEW) ----------
  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    if (!resetEmail) {
      setResetMsg("❌ Please enter your email.");
      return;
    }
    setResetLoading(true);
    try {
      // TODO: Adjust endpoint to your backend
      await axios.post(`${BASE_URL}/api/password-reset/request/`, {
        email: resetEmail,
      });
      setResetMsg("✅ A verification code has been sent to your email.");
      setTimeout(() => {
        setResetStep("confirm");
        setResetMsg("");
      }, 700);
    } catch (err: any) {
      setResetMsg(
        err?.response?.data?.error
          ? `❌ ${err.response.data.error}`
          : "⚠️ Could not send reset email. Try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    if (!resetCode.trim()) {
      setResetMsg("❌ Please enter the verification code.");
      return;
    }
    if (resetNewPw !== resetNewPw2) {
      setResetMsg("❌ Passwords do not match.");
      return;
    }
    setResetLoading(true);
    try {
      // TODO: Adjust endpoint to your backend
      await axios.post(`${BASE_URL}/api/password-reset/confirm/`, {
        email: resetEmail,
        code: resetCode,
        new_password: resetNewPw,
      });
      setResetMsg("✅ Password updated! You can sign in now.");
      setTimeout(() => {
        // Close overlay and prefill the sign-in username/email
        setShowReset(false);
        setResetStep("request");
        setLoginInput(resetEmail);
        setResetEmail("");
        setResetCode("");
        setResetNewPw("");
        setResetNewPw2("");
        setResetMsg("");
      }, 900);
    } catch (err: any) {
      setResetMsg(
        err?.response?.data?.error
          ? `❌ ${err.response.data.error}`
          : "⚠️ Could not update password. Check your code and try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setResetStep("request");
    setResetMsg("");
    setResetCode("");
    setResetNewPw("");
    setResetNewPw2("");
  };

  return (
    <div className={`auth-root ${mounted ? "is-mounted" : ""}`}>
      {/* Background image */}
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${bgImg})` }}
        aria-hidden="true"
      />

      {/* Back button */}
      <button
        className="auth-back"
        type="button"
        onClick={handleBack}
        aria-label="Go back"
      >
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        <span>Back</span>
      </button>

      <div className={`container${isActive ? " active" : ""}`} id="container">
        {/* ---------- Sign Up ---------- */}
        <div className="form-container sign-up">
          <form onSubmit={handleRegister} aria-label="Create account form">
            <h1>Create Account</h1>

            <div className="social-icons">
              <a href="#" className="icon" title="Google" aria-label="Google">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className="icon" title="Facebook" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon" title="GitHub" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon" title="LinkedIn" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>

            <span>or use your email for registration</span>

            <input
              type="text"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />

            <button type="submit" disabled={regLoading}>
              {regLoading ? "Registering..." : "Sign Up"}
            </button>

            {regMsg && <p style={{ marginTop: 10 }}>{regMsg}</p>}
          </form>
        </div>

        {/* ---------- Sign In ---------- */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin} aria-label="Sign in form">
            <h1>Sign In</h1>

            <div className="social-icons">
              <a href="#" className="icon" title="Google" aria-label="Google">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className="icon" title="Facebook" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon" title="GitHub" aria-label="GitHub">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon" title="LinkedIn" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>

            <span>or use your email and password</span>

            <input
              type="text"
              placeholder="Username or Email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowReset(true);
              }}
            >
              Forget Your Password?
            </a>

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Sign In"}
            </button>

            {loginMsg && <p style={{ marginTop: 10 }}>{loginMsg}</p>}
          </form>
        </div>

        {/* ---------- Purple toggle rail ---------- */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <button
                className="hidden"
                id="login"
                type="button"
                onClick={() => setMode("signin")}
                aria-label="Switch to Sign In"
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all site features</p>
              <button
                className="hidden"
                id="register"
                type="button"
                onClick={() => setMode("signup")}
                aria-label="Switch to Sign Up"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Reset Password Overlay (NEW) ---------- */}
      {showReset && (
        <div className={`reset-overlay show`} role="dialog" aria-modal="true">
          <section className="reset-card" aria-labelledby="reset-title">
            <header className="reset-head">
              <h2 id="reset-title">
                {resetStep === "request" ? "Reset your password" : "Set a new password"}
              </h2>
              <button
                className="reset-close"
                aria-label="Close"
                onClick={closeReset}
                type="button"
                title="Close"
              >
                ✕
              </button>
            </header>

            <div className="reset-body">
              {resetStep === "request" && (
                <form onSubmit={handleResetRequest}>
                  <p>Enter the email associated with your account.</p>
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                  <div className="reset-actions">
                    <button type="submit" disabled={resetLoading}>
                      {resetLoading ? "Sending..." : "Send Code"}
                    </button>
                    <button type="button" onClick={closeReset}>
                      Cancel
                    </button>
                  </div>
                  {resetMsg && <div className="reset-status">{resetMsg}</div>}
                </form>
              )}

              {resetStep === "confirm" && (
                <form onSubmit={handleResetConfirm}>
                  <p>
                    We sent a verification code to <b>{resetEmail}</b>. Enter it below and choose a new password.
                  </p>
                  <input
                    type="text"
                    placeholder="Verification code"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={resetNewPw}
                    onChange={(e) => setResetNewPw(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={resetNewPw2}
                    onChange={(e) => setResetNewPw2(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <div className="reset-actions">
                    <button type="submit" disabled={resetLoading}>
                      {resetLoading ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep("request");
                        setResetMsg("");
                        setResetCode("");
                        setResetNewPw("");
                        setResetNewPw2("");
                      }}
                    >
                      Back
                    </button>
                  </div>
                  {resetMsg && <div className="reset-status">{resetMsg}</div>}
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
