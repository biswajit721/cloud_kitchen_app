import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, ArrowLeft, ArrowRight,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw
} from "lucide-react";

// ── Your backend runs on port 8000 ────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─────────────────────────────────────────────────────────────────────────────
//  3-step flow (+ success screen = 4 states)
//
//  Step 1 → Enter email       → POST /api/auth/forgot-password
//  Step 2 → Enter 6-digit OTP → POST /api/auth/verify-otp
//  Step 3 → Enter new password→ POST /api/auth/reset-password
//  Step 4 → Success screen
// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step,       setStep]       = useState(1);
  const [email,      setEmail]      = useState("");
  const [otp,        setOtp]        = useState(["","","","","",""]);
  const [newPw,      setNewPw]      = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [err,        setErr]        = useState("");
  const [busy,       setBusy]       = useState(false);
  const [countdown,  setCountdown]  = useState(0);
  const [resetToken, setResetToken] = useState("");

  // ── Validation ────────────────────────────────────────────────────────────
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const pwOk    = newPw.length >= 6;
  const otpFull = otp.every(d => d !== "");

  // ── 60-second resend countdown ────────────────────────────────────────────
  function startCountdown() {
    setCountdown(60);
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  // ── Step 1: Request OTP ───────────────────────────────────────────────────
  async function requestOtp() {
    setErr(""); setBusy(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ method: "email", identifier: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setStep(2);
      startCountdown();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function verifyOtp() {
    setErr(""); setBusy(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          method:     "email",
          identifier: email.trim(),
          otp:        otp.join(""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");
      setResetToken(data.resetToken);
      setStep(3);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  async function resetPassword() {
    setErr(""); setBusy(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ resetToken, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setStep(4);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  // ── OTP box handlers ──────────────────────────────────────────────────────
  function handleOtpChange(i, e) {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) {
      const next = [...otp]; next[i] = "";
      setOtp(next);
      if (i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
      return;
    }
    const next = [...otp]; next[i] = val.slice(-1);
    setOtp(next);
    if (i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next   = ["","","","","",""];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    document.getElementById(`otp-${Math.min(digits.length, 5)}`)?.focus();
  }

  // ── Spinner ───────────────────────────────────────────────────────────────
  const Spinner = () => (
    <svg style={{ animation: "fp-spin .8s linear infinite" }} width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/>
    </svg>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fp-fadeU { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fp-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fp-pop   { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }

        .fp-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #FFF9F2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 16px 40px;
        }
        .fp-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: 20px;
          padding: 38px 36px;
          border: 1.5px solid #F0ECE6;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07);
          animation: fp-fadeU .4s ease both;
        }

        /* Progress dots — 3 steps only now */
        .fp-dots { display:flex; align-items:center; gap:6px; margin-bottom:26px; }
        .fp-dot  { height:6px; border-radius:99px; background:#F0ECE6; transition:all .28s ease; width:6px; }
        .fp-dot.done   { background:#FF7A00; width:18px; }
        .fp-dot.active { background:#FF7A00; width:18px; box-shadow:0 0 0 3px rgba(255,122,0,.18); }

        .fp-inp {
          width:100%; padding:12px 14px 12px 44px;
          background:#F8F6F3; border:1.5px solid #F0ECE6;
          border-radius:11px; font-family:'Sora',sans-serif;
          font-size:13.5px; color:#2C2C2C; outline:none;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .fp-inp:focus   { border-color:#FF7A00; background:#fff; box-shadow:0 0 0 3px rgba(255,122,0,.09); }
        .fp-inp.valid   { border-color:#2ECC71; }
        .fp-inp::placeholder { color:#9CA3AF; font-family:'Nunito',sans-serif; font-size:13px; }

        .fp-btn {
          width:100%; padding:13px; background:#FF7A00; color:#fff;
          border:none; border-radius:11px; font-family:'Sora',sans-serif;
          font-size:14.5px; font-weight:800; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:7px;
          box-shadow:0 5px 18px rgba(255,122,0,.28);
          transition:background .17s, transform .13s, box-shadow .17s, opacity .17s;
        }
        .fp-btn:hover:not(:disabled) { background:#E06A00; transform:translateY(-1px); box-shadow:0 8px 22px rgba(255,122,0,.36); }
        .fp-btn:disabled { opacity:.5; cursor:not-allowed; }

        .fp-otp-box {
          width:50px; height:58px; text-align:center;
          font-size:22px; font-weight:800; color:#2C2C2C;
          border:1.5px solid #F0ECE6; border-radius:12px;
          background:#F8F6F3; font-family:'Sora',sans-serif;
          outline:none; caret-color:#FF7A00;
          transition:border-color .18s, box-shadow .18s, background .18s;
        }
        .fp-otp-box:focus  { border-color:#FF7A00; background:#fff; box-shadow:0 0 0 3px rgba(255,122,0,.1); }
        .fp-otp-box.filled { border-color:#2ECC71; background:#F0FBF5; }

        .fp-err {
          display:flex; align-items:center; gap:8px;
          background:#FEF2F2; border:1.5px solid #FECACA;
          border-radius:10px; padding:10px 13px; margin-bottom:16px;
          animation:fp-fadeU .3s ease;
        }

        @media (max-width:480px) {
          .fp-card    { padding:28px 18px; }
          .fp-otp-box { width:40px; height:50px; font-size:18px; }
        }
      `}</style>

      <div className="fp-page">
        <div className="fp-card">

          {/* Back button */}
          {step < 4 && (
            <button
              onClick={() => step === 1 ? navigate("/login") : setStep(s => s - 1)}
              style={{
                display:"flex", alignItems:"center", gap:5,
                background:"none", border:"none", cursor:"pointer",
                color:"#9CA3AF", fontFamily:"'Sora',sans-serif",
                fontSize:12, fontWeight:700, marginBottom:18, padding:0,
              }}>
              <ArrowLeft size={13}/>
              {step === 1 ? "Back to Login" : "Back"}
            </button>
          )}

          {/* Progress dots — 3 dots for 3 steps */}
          {step < 4 && (
            <div className="fp-dots">
              {[1,2,3].map(s => (
                <div key={s}
                  className={`fp-dot${s < step ? " done" : s === step ? " active" : ""}`}
                />
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 1 — Enter Email
          ══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <>
              <div style={{marginBottom:24}}>
                <div style={{
                  width:46, height:46,
                  background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",
                  borderRadius:13, display:"flex", alignItems:"center",
                  justifyContent:"center", marginBottom:14,
                  boxShadow:"0 6px 18px rgba(255,122,0,.26)"
                }}>
                  <Mail size={22} color="#fff"/>
                </div>
                <h1 style={{fontSize:21,fontWeight:900,color:"#2C2C2C",marginBottom:5,letterSpacing:"-0.02em"}}>
                  Forgot Password?
                </h1>
                <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",lineHeight:1.65}}>
                  Enter your registered email address and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              {err && (
                <div className="fp-err">
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
                </div>
              )}

              <div style={{marginBottom:18}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",
                  marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>
                  Email Address
                </label>
                <div style={{position:"relative"}}>
                  <Mail size={14} color="#C4BAB1"
                    style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input
                    autoFocus
                    type="email"
                    className={`fp-inp${emailOk ? " valid" : ""}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && emailOk && requestOtp()}
                  />
                </div>
                {email && !emailOk && (
                  <p style={{fontSize:11,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                    Enter a valid email address
                  </p>
                )}
              </div>

              <button className="fp-btn" disabled={busy || !emailOk} onClick={requestOtp}>
                {busy ? <Spinner/> : <>Send OTP <ArrowRight size={14}/></>}
              </button>

              <p style={{textAlign:"center",marginTop:16,fontSize:12.5,
                color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>
                Remembered it?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{color:"#FF7A00",fontWeight:800,cursor:"pointer"}}>
                  Back to Login →
                </span>
              </p>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2 — Enter OTP
          ══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <>
              <div style={{marginBottom:22}}>
                <div style={{
                  width:46, height:46, fontSize:22,
                  background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",
                  borderRadius:13, display:"flex", alignItems:"center",
                  justifyContent:"center", marginBottom:14,
                  boxShadow:"0 6px 18px rgba(255,122,0,.26)"
                }}>📨</div>
                <h1 style={{fontSize:20,fontWeight:900,color:"#2C2C2C",marginBottom:5,letterSpacing:"-0.02em"}}>
                  Check your email
                </h1>
                <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",lineHeight:1.65}}>
                  We've sent a 6-digit OTP to<br/>
                  <strong style={{color:"#FF7A00"}}>{email}</strong>
                </p>
              </div>

              {err && (
                <div className="fp-err">
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
                </div>
              )}

              {/* OTP Boxes */}
              <div
                style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18}}
                onPaste={handleOtpPaste}
              >
                {otp.map((d, i) => (
                  <input
                    key={i} id={`otp-${i}`}
                    className={`fp-otp-box${d ? " filled" : ""}`}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e)}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !otp[i] && i > 0)
                        document.getElementById(`otp-${i-1}`)?.focus();
                    }}
                  />
                ))}
              </div>

              {/* Resend */}
              <div style={{textAlign:"center", marginBottom:20}}>
                {countdown > 0 ? (
                  <span style={{fontSize:12.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                    Resend OTP in <strong style={{color:"#FF7A00"}}>{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    onClick={() => { setErr(""); setOtp(["","","","","",""]); requestOtp(); }}
                    style={{background:"none",border:"none",cursor:"pointer",
                      display:"inline-flex",alignItems:"center",gap:5,
                      color:"#FF7A00",fontFamily:"'Sora',sans-serif",fontSize:12.5,fontWeight:700}}>
                    <RefreshCw size={12}/> Resend OTP
                  </button>
                )}
              </div>

              {/* Hint */}
              <div style={{
                background:"#F8F6F3", borderRadius:10, padding:"10px 13px",
                marginBottom:18, display:"flex", alignItems:"flex-start", gap:8
              }}>
                <span style={{fontSize:13}}>💡</span>
                <p style={{margin:0,fontSize:11.5,color:"#9CA3AF",
                  fontFamily:"'Nunito',sans-serif",lineHeight:1.6}}>
                  Check your <strong style={{color:"#5C5C6E"}}>spam / junk</strong> folder
                  if you don't see the email in your inbox.
                </p>
              </div>

              <button className="fp-btn" disabled={busy || !otpFull} onClick={verifyOtp}>
                {busy ? <Spinner/> : <>Verify OTP <ArrowRight size={14}/></>}
              </button>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3 — New Password
          ══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <>
              <div style={{marginBottom:22}}>
                <div style={{
                  width:46, height:46,
                  background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",
                  borderRadius:13, display:"flex", alignItems:"center",
                  justifyContent:"center", marginBottom:14,
                  boxShadow:"0 6px 18px rgba(255,122,0,.26)"
                }}>
                  <Lock size={21} color="#fff"/>
                </div>
                <h1 style={{fontSize:20,fontWeight:900,color:"#2C2C2C",marginBottom:5,letterSpacing:"-0.02em"}}>
                  New Password
                </h1>
                <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",lineHeight:1.65}}>
                  Create a strong new password for your account.
                </p>
              </div>

              {err && (
                <div className="fp-err">
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
                </div>
              )}

              <div style={{marginBottom:18}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",
                  marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>
                  New Password
                </label>
                <div style={{position:"relative"}}>
                  <Lock size={14} color="#C4BAB1"
                    style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input
                    autoFocus
                    type={showPw ? "text" : "password"}
                    className={`fp-inp${newPw && pwOk ? " valid" : ""}`}
                    placeholder="Minimum 6 characters"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    style={{paddingRight:42}}
                    onKeyDown={e => e.key === "Enter" && pwOk && resetPassword()}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                      background:"none",border:"none",cursor:"pointer",color:"#C4BAB1",display:"flex",padding:0}}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {newPw && !pwOk && (
                  <p style={{fontSize:11,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <button className="fp-btn" disabled={busy || !pwOk} onClick={resetPassword}>
                {busy ? <Spinner/> : <>Reset Password <ArrowRight size={14}/></>}
              </button>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4 — Success
          ══════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div style={{textAlign:"center", animation:"fp-fadeU .4s ease"}}>
              <div style={{
                width:72, height:72,
                background:"linear-gradient(135deg,#2ECC71,#1A8A4A)",
                borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 20px",
                boxShadow:"0 8px 28px rgba(46,204,113,.28)",
                animation:"fp-pop .5s ease"
              }}>
                <CheckCircle size={36} color="#fff"/>
              </div>

              <h1 style={{fontSize:21,fontWeight:900,color:"#2C2C2C",marginBottom:8,letterSpacing:"-0.02em"}}>
                Password Reset! 🎉
              </h1>
              <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",lineHeight:1.7,marginBottom:28}}>
                Your password has been changed successfully.<br/>
                You can now sign in with your new password.
              </p>

              <button className="fp-btn" onClick={() => navigate("/login")}>
                Go to Login <ArrowRight size={14}/>
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}