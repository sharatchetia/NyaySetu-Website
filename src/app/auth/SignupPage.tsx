import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebaseConfig";
import "../../styles/auth.css";

type Step = "role" | "user" | "lawyer";

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("role");

  // User form state
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userShowPassword, setUserShowPassword] = useState(false);
  const [userAgreeTerms, setUserAgreeTerms] = useState(false);

  // Lawyer form state
  const [lawyerFullName, setLawyerFullName] = useState("");
  const [lawyerEmail, setLawyerEmail] = useState("");
  const [barEnrollment, setBarEnrollment] = useState("");
  const [stateBarCouncil, setStateBarCouncil] = useState("");
  const [barIdCardFile, setBarIdCardFile] = useState<File | null>(null);
  const [barIdCardPreview, setBarIdCardPreview] = useState<string>("");
  const [practiceArea, setPracticeArea] = useState("");
  const [yearsPractice, setYearsPractice] = useState("");
  const [lawyerAddress, setLawyerAddress] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [lawyerPassword, setLawyerPassword] = useState("");
  const [lawyerConfirmPassword, setLawyerConfirmPassword] = useState("");
  const [lawyerShowPassword, setLawyerShowPassword] = useState(false);
  const [lawyerAgreeTerms, setLawyerAgreeTerms] = useState(false);

  // Common loading and status state
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Brand panel copy config
  const brandCopy = {
    role: {
      eyebrow: "NyaySetu",
      headline: "Join\neither side\nof the law.",
      img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1400&auto=format&fit=crop"
    },
    user: {
      eyebrow: "NyaySetu",
      headline: "Plain-English\nlegal help,\nwhenever.",
      img: "https://images.unsplash.com/photo-1711003596872-aa68f08a4b8e?q=80&w=1400&auto=format&fit=crop"
    },
    lawyer: {
      eyebrow: "NyaySetu for Lawyers",
      headline: "Build your\npractice,\nverified.",
      img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1400&auto=format&fit=crop"
    }
  };

  const currentBrand = brandCopy[step];

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setBarIdCardFile(null);
      setBarIdCardPreview("");
      return;
    }
    setBarIdCardFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBarIdCardPreview(e.target?.result as string || "");
    };
    reader.readAsDataURL(file);
  };

  const handleUserSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFullName || !userEmail || !userPassword) {
      setStatus({ message: "Please fill in all required fields.", isError: true });
      return;
    }
    if (userPassword !== userConfirmPassword) {
      setStatus({ message: "Passwords do not match.", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      const uid = result.user.uid;

      await setDoc(doc(db, "users", uid), {
        role: "user",
        fullName: userFullName,
        email: userEmail,
        createdAt: serverTimestamp()
      });

      setStatus({ message: "Account created successfully! Redirecting…", isError: false });
      setTimeout(() => {
        navigate("/upload");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setStatus({ message: err.message || "Failed to create account.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLawyerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawyerFullName || !lawyerEmail || !lawyerPassword || !barEnrollment || !stateBarCouncil) {
      setStatus({ message: "Please fill in all required fields.", isError: true });
      return;
    }
    if (lawyerPassword !== lawyerConfirmPassword) {
      setStatus({ message: "Passwords do not match.", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await createUserWithEmailAndPassword(auth, lawyerEmail, lawyerPassword);
      const uid = result.user.uid;

      await setDoc(doc(db, "lawyers", uid), {
        role: "lawyer",
        fullName: lawyerFullName,
        email: lawyerEmail,
        barEnrollment,
        stateBarCouncil,
        practiceArea,
        yearsPractice,
        address: lawyerAddress,
        upiId,
        bankAccountNumber,
        ifscCode,
        verified: false,
        createdAt: serverTimestamp()
      });

      setStatus({ message: "Lawyer profile created successfully! Redirecting…", isError: false });
      setTimeout(() => {
        navigate("/upload");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setStatus({ message: err.message || "Failed to create lawyer account.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      await setDoc(doc(db, "users", uid), {
        role: "user",
        fullName: result.user.displayName || "User",
        email: result.user.email || "",
        createdAt: serverTimestamp()
      }, { merge: true });

      setStatus({ message: "Signed in with Google! Redirecting…", isError: false });
      setTimeout(() => {
        navigate("/upload");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setStatus({ message: err.message || "Failed to sign up with Google.", isError: true });
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
        <Link className="topbar-link" to="/login">
          Already have an account? <strong>Sign in</strong>
        </Link>
      </header>

      <main className="split">
        {/* Brand / decorative panel */}
        <section className="brand-panel" id="brandPanel" data-mode={step}>
          <div className="brand-art" aria-hidden="true">
            <img id="brandArtImg" src={currentBrand.img} alt="" loading="lazy" />
          </div>

          <div className="brand-copy">
            <p className="eyebrow" id="brandEyebrow">{currentBrand.eyebrow}</p>
            <h1 id="brandHeadline">
              {currentBrand.headline.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {idx === 1 ? <em>{line}</em> : line}
                  <br />
                </React.Fragment>
              ))}
            </h1>
          </div>
        </section>

        {/* Form panel */}
        <section className="form-panel">
          <div className="form-shell">
            {/* STEP 1: ROLE SELECT */}
            {step === "role" && (
              <div className="login-form" id="roleSelect">
                <p className="form-eyebrow">Create account</p>
                <h2 className="form-title">
                  Join as<span className="title-dot">.</span>
                </h2>
                <p className="form-sub">
                  Choose how you'll use NyaySetu — you can always add the other role later.
                </p>

                <div className="role-cards">
                  <button
                    type="button"
                    className="role-card"
                    onClick={() => {
                      setStatus(null);
                      setStep("user");
                    }}
                  >
                    <span className="role-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="6.5" r="3.3" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3.3 17c0-3.6 3-6 6.7-6s6.7 2.4 6.7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="role-text">
                      <span className="role-name">I'm a User</span>
                      <span className="role-desc">Get plain-English answers, store documents, track your case.</span>
                    </span>
                    <span className="role-arrow" aria-hidden="true">→</span>
                  </button>

                  <button
                    type="button"
                    className="role-card"
                    onClick={() => {
                      setStatus(null);
                      setStep("lawyer");
                    }}
                  >
                    <span className="role-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2v15M6.5 17h7M10 4.5c-1.8 1-4.2 1.6-6.5 1.6M10 4.5c1.8 1 4.2 1.6 6.5 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1.6 8.6h3.8l-1.9 4.5a2.2 2.2 0 0 1-1.9-4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.6 8.6h3.8l-1.9 4.5a2.2 2.2 0 0 1-1.9-4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="role-text">
                      <span className="role-name">I'm a Lawyer</span>
                      <span className="role-desc">List your practice, take consultations, build your profile.</span>
                    </span>
                    <span className="role-arrow" aria-hidden="true">→</span>
                  </button>
                </div>

                <p className="form-foot">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            )}

            {/* STEP 2a: USER SIGNUP */}
            {step === "user" && (
              <form className="login-form" id="userSignupForm" onSubmit={handleUserSignup} noValidate>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setStatus(null);
                    setStep("role");
                  }}
                >
                  ← Back
                </button>
                <p className="form-eyebrow">Create account · User</p>
                <h2 className="form-title">
                  Get<br />
                  started<span className="title-dot">.</span>
                </h2>
                <p className="form-sub">Set up your free account to save documents and get plain-English legal answers.</p>

                <div className="field">
                  <label htmlFor="userFullName">Full name</label>
                  <input
                    type="text"
                    id="userFullName"
                    name="fullName"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="userSignupEmail">Email</label>
                  <input
                    type="email"
                    id="userSignupEmail"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="userSignupPassword">Password</label>
                  <div className="input-with-action">
                    <input
                      type={userShowPassword ? "text" : "password"}
                      id="userSignupPassword"
                      name="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setUserShowPassword(!userShowPassword)}
                      aria-label="Show password"
                    >
                      {userShowPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="userConfirmPassword">Confirm password</label>
                  <div className="input-with-action">
                    <input
                      type={userShowPassword ? "text" : "password"}
                      id="userConfirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      minLength={8}
                      value={userConfirmPassword}
                      onChange={(e) => setUserConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setUserShowPassword(!userShowPassword)}
                      aria-label="Show password"
                    >
                      {userShowPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="field-row">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      id="userAgreeTerms"
                      name="agreeTerms"
                      checked={userAgreeTerms}
                      onChange={(e) => setUserAgreeTerms(e.target.checked)}
                      required
                    />
                    <span>
                      I agree to the <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>Terms</a> &amp; <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`btn-primary ${loading ? "is-loading" : ""}`}
                  id="userSignupSubmit"
                  disabled={!userAgreeTerms || loading}
                >
                  <span className="btn-label">{loading ? "Creating account…" : "Create account"}</span>
                  {loading && <span className="btn-spinner" aria-hidden="true" />}
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <button type="button" className="btn-secondary" onClick={handleGoogleSignup} disabled={loading}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" fill="#34A853" />
                    <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" fill="#FBBC05" />
                    <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <p className="secure-badge">
                  <span className="secure-dot" /> Bank-grade encryption · your data stays yours
                </p>
              </form>
            )}

            {/* STEP 2b: LAWYER SIGNUP */}
            {step === "lawyer" && (
              <form className="login-form" id="lawyerSignupForm" onSubmit={handleLawyerSignup} noValidate>
                <button
                  type="button"
                  className="back-link"
                  onClick={() => {
                    setStatus(null);
                    setStep("role");
                  }}
                >
                  ← Back
                </button>
                <p className="form-eyebrow">Create account · Lawyer</p>
                <h2 className="form-title">
                  Build your<br />
                  practice<span className="title-dot">.</span>
                </h2>
                <p className="form-sub">A few professional details so clients know you're verified.</p>

                <div className="field">
                  <label htmlFor="lawyerFullName">Full name</label>
                  <input
                    type="text"
                    id="lawyerFullName"
                    name="fullName"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={lawyerFullName}
                    onChange={(e) => setLawyerFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="lawyerEmail">Professional email</label>
                  <input
                    type="email"
                    id="lawyerEmail"
                    name="email"
                    placeholder="you@lawfirm.com"
                    autoComplete="email"
                    value={lawyerEmail}
                    onChange={(e) => setLawyerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="barEnrollment">Bar Council enrollment number</label>
                  <input
                    type="text"
                    id="barEnrollment"
                    name="barEnrollment"
                    placeholder="e.g. D/1234/2020"
                    value={barEnrollment}
                    onChange={(e) => setBarEnrollment(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="stateBarCouncil">State Bar Council</label>
                  <select
                    id="stateBarCouncil"
                    name="stateBarCouncil"
                    value={stateBarCouncil}
                    onChange={(e) => setStateBarCouncil(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select your Bar Council</option>
                    <option>Bar Council of Delhi</option>
                    <option>Bar Council of Maharashtra &amp; Goa</option>
                    <option>Bar Council of Uttar Pradesh</option>
                    <option>Bar Council of Karnataka</option>
                    <option>Bar Council of Tamil Nadu</option>
                    <option>Bar Council of West Bengal</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="barIdCard">Bar Council ID card</label>
                  <div
                    className="file-drop"
                    id="barIdCardDrop"
                    data-empty={!barIdCardFile ? "true" : "false"}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileChange(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="barIdCard"
                      name="barIdCard"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />
                    {!barIdCardFile ? (
                      <div className="file-drop-empty">
                        <span className="file-drop-icon" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3v10.5M10 3l-3.5 3.5M10 3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3.5 14v1.5A1.5 1.5 0 0 0 5 17h10a1.5 1.5 0 0 0 1.5-1.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="file-drop-text">
                          <strong>Upload a photo</strong> or drag &amp; drop<br />
                          PNG, JPG or WEBP · up to 5MB
                        </span>
                      </div>
                    ) : (
                      <div className="file-drop-filled" style={{ display: "flex" }}>
                        {barIdCardPreview && <img className="file-drop-preview" src={barIdCardPreview} alt="ID Preview" />}
                        <span className="file-drop-filename">{barIdCardFile.name}</span>
                        <button
                          type="button"
                          className="file-drop-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileChange(null);
                          }}
                          aria-label="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="practiceArea">Practice area</label>
                    <select
                      id="practiceArea"
                      name="practiceArea"
                      value={practiceArea}
                      onChange={(e) => setPracticeArea(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select area</option>
                      <option>Credit &amp; Loan</option>
                      <option>Employment</option>
                      <option>Lease</option>
                      <option>License &amp; IP</option>
                      <option>Merger &amp; Acquisition</option>
                      <option>Purchase &amp; Sale</option>
                      <option>Service &amp; Supply</option>
                      <option>Settlement &amp; Release</option>
                      <option>Shareholder Rights</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="yearsPractice">Years practicing</label>
                    <input
                      type="number"
                      id="yearsPractice"
                      name="yearsPractice"
                      placeholder="e.g. 5"
                      min="0"
                      max="60"
                      value={yearsPractice}
                      onChange={(e) => setYearsPractice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="lawyerAddress">Office / chamber address</label>
                  <textarea
                    id="lawyerAddress"
                    name="address"
                    rows={2}
                    placeholder="Chamber no., building, city, state, PIN"
                    value={lawyerAddress}
                    onChange={(e) => setLawyerAddress(e.target.value)}
                    required
                  />
                </div>

                <p className="section-label">Payout details</p>

                <div className="field">
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>

                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="bankAccountNumber">Bank account number</label>
                    <input
                      type="text"
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      inputMode="numeric"
                      placeholder="e.g. 123456789012"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="ifscCode">IFSC code</label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      placeholder="e.g. HDFC0001234"
                      maxLength={11}
                      style={{ textTransform: "uppercase" }}
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="lawyerPassword">Password</label>
                  <div className="input-with-action">
                    <input
                      type={lawyerShowPassword ? "text" : "password"}
                      id="lawyerPassword"
                      name="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      value={lawyerPassword}
                      onChange={(e) => setLawyerPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setLawyerShowPassword(!lawyerShowPassword)}
                      aria-label="Show password"
                    >
                      {lawyerShowPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="lawyerConfirmPassword">Confirm password</label>
                  <div className="input-with-action">
                    <input
                      type={lawyerShowPassword ? "text" : "password"}
                      id="lawyerConfirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      minLength={8}
                      value={lawyerConfirmPassword}
                      onChange={(e) => setLawyerConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-visibility"
                      onClick={() => setLawyerShowPassword(!lawyerShowPassword)}
                      aria-label="Show password"
                    >
                      {lawyerShowPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="field-row">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      id="lawyerAgreeTerms"
                      name="agreeTerms"
                      checked={lawyerAgreeTerms}
                      onChange={(e) => setLawyerAgreeTerms(e.target.checked)}
                      required
                    />
                    <span>
                      I confirm these credentials are accurate and agree to the <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>Terms</a> &amp; <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`btn-primary ${loading ? "is-loading" : ""}`}
                  id="lawyerSignupSubmit"
                  disabled={!lawyerAgreeTerms || loading}
                >
                  <span className="btn-label">{loading ? "Creating profile…" : "Create lawyer profile"}</span>
                  {loading && <span className="btn-spinner" aria-hidden="true" />}
                </button>

                <p className="secure-badge">
                  <span className="secure-dot" /> Credentials verified against Bar Council records
                </p>
              </form>
            )}

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
