import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import "../../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || "/upload";

  const handleRedirect = () => {
    if (redirectTo.endsWith(".html") || redirectTo.startsWith("http")) {
      window.location.href = redirectTo;
    } else {
      navigate(redirectTo);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const friendlyAuthError = (err: any) => {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email or password is incorrect.";
      case "auth/invalid-email":
        return "That email address doesn't look right.";
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return err.message || "Couldn't sign you in. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus({ message: "Please fill in both email and password.", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setStatus({ message: "Signed in! Redirecting you now…", isError: false });
      setTimeout(() => {
        handleRedirect();
      }, 500);
    } catch (err: any) {
      setStatus({ message: friendlyAuthError(err), isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setStatus(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setStatus({ message: "Signed in with Google! Redirecting you now…", isError: false });
      setTimeout(() => {
        handleRedirect();
      }, 500);
    } catch (err: any) {
      setStatus({ message: friendlyAuthError(err), isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <header className="topbar">
        <Link className="logo" to="/">
          <span className="logo-mark" aria-hidden="true">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 0L17.5 4V9.5C17.5 14.7 14 18.6 9 20C4 18.6 0.5 14.7 0.5 9.5V4L9 0Z" fill="currentColor" />
            </svg>
          </span>
          Nyay<span className="logo-accent">Setu</span>
        </Link>
        <Link className="topbar-link" to="/signup" state={{ redirectTo }}>
          Need an account? <strong>Get started</strong>
        </Link>
      </header>

      <main className="split">
        {/* Brand / decorative panel */}
        <section className="brand-panel" id="brandPanel" data-mode="user">
          <div className="brand-art" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=1400&auto=format&fit=crop"
              alt=""
              loading="lazy"
            />
          </div>

          <div className="brand-copy">
            <p className="eyebrow">NyaySetu</p>
            <h1>
              Understand<br />
              <em>your</em> law.<br />
              Sign in.
            </h1>
          </div>
        </section>

        {/* Form panel */}
        <section className="form-panel">
          <div className="form-shell">
            {/* USER LOGIN */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <p className="form-eyebrow">Sign in</p>
              <h2 className="form-title">
                Welcome<br />
                back<span className="title-dot">.</span>
              </h2>
              <p className="form-sub">Sign in to pick up where you left off with your documents.</p>

              <div className="field">
                <label htmlFor="userEmail">Email</label>
                <input
                  type="email"
                  id="userEmail"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="userPassword">Password</label>
                <div className="input-with-action">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="userPassword"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="field-row">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    id="userRemember"
                    name="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className={`btn-primary ${loading ? "is-loading" : ""}`}
                id="userSubmit"
                disabled={loading}
              >
                <span className="btn-label">{loading ? "Signing in…" : "Sign in"}</span>
                {loading && <span className="btn-spinner" aria-hidden="true" />}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button type="button" className="btn-secondary" onClick={handleGoogleSignIn} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" fill="#34A853" />
                  <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" fill="#FBBC05" />
                  <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <p className="form-foot">
                New to NyaySetu? <Link to="/signup" state={{ redirectTo }}>Create an account</Link>
              </p>

              <p className="secure-badge">
                <span className="secure-dot" /> Bank-grade encryption · your data stays yours
              </p>
            </form>

            {status && (
              <div className={`form-status ${status.isError ? "is-error" : ""}`} role="status" aria-live="polite">
                {status.message}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
