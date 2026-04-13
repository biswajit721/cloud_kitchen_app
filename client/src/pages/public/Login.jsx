import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Mail, Lock, Eye, EyeOff, AlertCircle,
  ArrowRight, Star, Shield, Zap, Phone
} from "lucide-react";

export default function Login() {
  const [loginMode, setLoginMode] = useState("email");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [pw,        setPw]        = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [err,       setErr]       = useState("");
  const [busy,      setBusy]      = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Validation ────────────────────────────────────────────────────────────
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Strip all spaces before validating — user may type "98765 43210"
  const phoneClean = phone.replace(/\s/g, "");
  const phoneOk    = /^[6-9]\d{9}$/.test(phoneClean);

  const pwOk = pw.length >= 6;

  const canSubmit = loginMode === "email"
    ? emailOk && pwOk
    : phoneOk && pwOk;

  // ── Switch tabs — MUST clear stale values ─────────────────────────────────
  // Bug fix: without this, old email value stays in state when user switches
  // to phone mode, and AuthContext would send wrong data to backend
  const switchMode = (mode) => {
    if (mode === loginMode) return;
    setLoginMode(mode);
    setEmail("");
    setPhone("");
    setPw("");
    setErr("");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async e => {
    e.preventDefault();
    if (!canSubmit) return;
    setErr(""); setBusy(true);

    // Pass cleaned identifier — AuthContext.login() handles the rest
    const identifier = loginMode === "email"
      ? email.trim()
      : phoneClean;          // already stripped of spaces above

    const r = await login(identifier, pw, loginMode);
    setBusy(false);

    if (r.success) {
      const u = JSON.parse(localStorage.getItem("user"));
      navigate(u?.role === "admin" ? "/admin" : "/");
    } else {
      setErr(r.message || "Invalid credentials.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeL  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeR  { from{opacity:0;transform:translateX(18px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes fadeU  { from{opacity:0;transform:translateY(10px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }

        .lg-page {
          font-family: 'Sora', sans-serif;
          display: flex; height: 100vh; overflow: hidden;
          padding-top: 64px; background: #FFF9F2;
        }

        /* Left panel */
        .lg-left {
          flex: 0 0 46%;
          background: linear-gradient(155deg, #FF7A00 0%, #FF9A3C 55%, #FFB347 100%);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 40px 44px; animation: fadeL .5s ease both;
        }
        .lg-left-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0);
          background-size: 24px 24px; pointer-events: none;
        }
        .lg-orb1 { position:absolute; top:-80px; right:-80px; width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,0.09); pointer-events:none; }
        .lg-orb2 { position:absolute; bottom:-60px; left:-50px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); pointer-events:none; }

        /* Right panel */
        .lg-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 24px 32px; overflow-y: auto; animation: fadeR .5s .07s ease both;
        }
        .lg-card {
          width: 100%; max-width: 420px; background: #fff;
          border-radius: 20px; padding: 38px 34px;
          border: 1.5px solid #F0ECE6; box-shadow: 0 4px 32px rgba(0,0,0,0.07);
        }

        /* Tabs */
        .lg-tabs {
          display: flex; background: #F8F6F3; border-radius: 10px;
          padding: 4px; margin-bottom: 20px; gap: 4px;
        }
        .lg-tab {
          flex: 1; padding: 9px; border: none; border-radius: 7px; cursor: pointer;
          font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 700;
          transition: all .18s; color: #9CA3AF; background: transparent;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .lg-tab.active { background: #fff; color: #FF7A00; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

        /* Inputs */
        .lg-inp {
          width: 100%; padding: 12px 14px 12px 42px;
          background: #F8F6F3; border: 1.5px solid #F0ECE6;
          border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 13.5px; color: #2C2C2C; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .lg-inp:focus  { border-color: #FF7A00; background: #fff; box-shadow: 0 0 0 3px rgba(255,122,0,.09); }
        .lg-inp.valid  { border-color: #2ECC71; }
        .lg-inp.invalid { border-color: #EF4444; }
        .lg-inp::placeholder { color: #9CA3AF; font-family: 'Nunito', sans-serif; font-size: 13px; }

        /* Phone field has extra left padding for the +91 prefix */
        .lg-inp-phone { padding-left: 70px !important; }

        /* Button */
        .lg-btn {
          width: 100%; padding: 13px; background: #FF7A00; color: #fff;
          border: none; border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 14.5px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 5px 18px rgba(255,122,0,.28);
          transition: background .17s, transform .13s, box-shadow .17s, opacity .17s;
        }
        .lg-btn:hover:not(:disabled) { background: #E06A00; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,122,0,.36); }
        .lg-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* Social */
        .lg-soc {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px; border: 1.5px solid #F0ECE6; border-radius: 10px;
          background: #fff; font-family: 'Sora', sans-serif; font-size: 12.5px;
          font-weight: 700; color: #5C5C6E; cursor: pointer; transition: all .15s ease;
        }
        .lg-soc:hover { border-color: #FF7A00; color: #FF7A00; background: #FFF3E8; }

        .lg-stat {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px; padding: 10px 16px; backdrop-filter: blur(8px);
        }
        .lg-review {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px; padding: 14px; backdrop-filter: blur(10px);
        }

        @media (max-width: 800px) {
          .lg-left  { display: none !important; }
          .lg-right { padding: 20px 16px !important; }
          .lg-card  { padding: 30px 22px !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="lg-page">

        {/* ════ LEFT PANEL ════ */}
        <div className="lg-left">
          <div className="lg-left-dots"/>
          <div className="lg-orb1"/> <div className="lg-orb2"/>

          <div style={{position:"relative",zIndex:1}}>
            <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:9,textDecoration:"none"}}>
              <div style={{width:38,height:38,background:"rgba(255,255,255,0.22)",border:"1.5px solid rgba(255,255,255,0.32)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>🍔</div>
              <span style={{fontSize:18,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>MyApp</span>
            </Link>
          </div>

          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.28)",borderRadius:99,padding:"5px 13px",marginBottom:16,backdropFilter:"blur(6px)"}}>
              <span style={{width:7,height:7,background:"#2ECC71",borderRadius:"50%",display:"block",animation:"pulse 1.5s ease infinite"}}/>
              <span style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:"0.04em"}}>2M+ happy customers</span>
            </div>
            <h2 style={{fontSize:"clamp(1.6rem,2.5vw,2.4rem)",fontWeight:900,color:"#fff",lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:10}}>
              Hot food,<br/>
              <span style={{background:"linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.68) 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                your door.
              </span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.78)",fontSize:13.5,lineHeight:1.8,fontFamily:"'Nunito',sans-serif",fontWeight:500,maxWidth:290,marginBottom:22}}>
              Order from hundreds of restaurants and get fresh meals delivered in under 30 minutes.
            </p>
            <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
              {[{v:"4.9★",l:"Rating"},{v:"28min",l:"Delivery"},{v:"500+",l:"Cities"}].map((s,i)=>(
                <div key={i} className="lg-stat">
                  <span style={{fontSize:14,fontWeight:900,color:"#fff",lineHeight:1}}>{s.v}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.60)",fontWeight:600}}>{s.l}</span>
                </div>
              ))}
            </div>
            <div className="lg-review">
              <div style={{display:"flex",gap:2,marginBottom:6}}>
                {[1,2,3,4,5].map(i=><Star key={i} size={11} fill="#FFC300" color="#FFC300"/>)}
              </div>
              <p style={{color:"rgba(255,255,255,0.88)",fontSize:12.5,fontFamily:"'Nunito',sans-serif",lineHeight:1.7,marginBottom:8}}>
                "Best food delivery app I've used. Always hot, always on time!"
              </p>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:26,height:26,background:"rgba(255,255,255,0.22)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>😊</div>
                <div>
                  <div style={{fontSize:11,fontWeight:800,color:"#fff"}}>Priya S.</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.50)",fontWeight:600}}>Verified · Bangalore</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{position:"relative",zIndex:1,display:"flex",gap:14,flexWrap:"wrap"}}>
            {[{Icon:Zap,l:"Fast"},{Icon:Shield,l:"Secure"},{Icon:Star,l:"Top Rated"}].map(({Icon,l},i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5,color:"rgba(255,255,255,0.70)",fontSize:11.5,fontWeight:700}}>
                <Icon size={12} color="rgba(255,255,255,0.70)"/>{l}
              </div>
            ))}
          </div>
        </div>

        {/* ════ RIGHT FORM PANEL ════ */}
        <div className="lg-right">
          <div className="lg-card">

            {/* Header */}
            <div style={{marginBottom:22}}>
              <div style={{width:46,height:46,background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14,boxShadow:"0 6px 18px rgba(255,122,0,.26)"}}>🍔</div>
              <h1 style={{fontSize:22,fontWeight:900,color:"#2C2C2C",marginBottom:4,letterSpacing:"-0.02em"}}>Welcome back 👋</h1>
              <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>Sign in to continue ordering</p>
            </div>

            {/* ── Tabs ── */}
            <div className="lg-tabs">
              <button
                className={`lg-tab${loginMode==="email"?" active":""}`}
                onClick={()=>switchMode("email")}>
                <Mail size={12}/> Email
              </button>
              <button
                className={`lg-tab${loginMode==="phone"?" active":""}`}
                onClick={()=>switchMode("phone")}>
                <Phone size={12}/> Phone
              </button>
            </div>

            {/* Error banner */}
            {err && (
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"10px 13px",marginBottom:16,animation:"fadeU .3s ease"}}>
                <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
              </div>
            )}

            <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:15}}>

              {/* ── Email field ── */}
              {loginMode === "email" && (
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>
                    Email Address
                  </label>
                  <div style={{position:"relative"}}>
                    <Mail size={14} color="#C4BAB1"
                      style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                    <input
                      type="email"
                      required
                      autoFocus
                      className={`lg-inp${email && emailOk ? " valid" : email && !emailOk ? " invalid" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  {email && !emailOk && (
                    <p style={{fontSize:11,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                      Enter a valid email address
                    </p>
                  )}
                </div>
              )}

              {/* ── Phone field ── */}
              {loginMode === "phone" && (
                <div>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>
                    Mobile Number
                  </label>
                  <div style={{position:"relative"}}>
                    {/* Phone icon */}
                    <Phone size={14} color="#C4BAB1"
                      style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                    {/* +91 country code prefix */}
                    <span style={{
                      position:"absolute", left:34, top:"50%", transform:"translateY(-50%)",
                      fontSize:13, fontWeight:700, color:"#5C5C6E",
                      pointerEvents:"none", fontFamily:"'Sora',sans-serif",
                      borderRight:"1.5px solid #E5E0D8", paddingRight:8,
                    }}>+91</span>
                    <input
                      type="tel"
                      required
                      autoFocus
                      className={`lg-inp lg-inp-phone${phone && phoneOk ? " valid" : phone && !phoneOk ? " invalid" : ""}`}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={e => {
                        // Only allow digits and one space between groups
                        const raw = e.target.value.replace(/[^\d\s]/g, "");
                        // Limit to 10 digits total
                        if (raw.replace(/\s/g, "").length <= 10) {
                          setPhone(raw);
                        }
                      }}
                      maxLength={11}
                    />
                  </div>
                  {/* Validation messages */}
                  {phone && !phoneOk && (
                    <p style={{fontSize:11,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                      Enter a valid 10-digit number starting with 6, 7, 8 or 9
                    </p>
                  )}
                  {phone && phoneOk && (
                    <p style={{fontSize:11,color:"#2ECC71",fontFamily:"'Nunito',sans-serif",marginTop:4,fontWeight:700}}>
                      ✓ Valid mobile number
                    </p>
                  )}
                  {!phone && (
                    <p style={{fontSize:11,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                      Use the number you registered with
                    </p>
                  )}
                </div>
              )}

              {/* ── Password field ── */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#5C5C6E",letterSpacing:"0.05em",textTransform:"uppercase"}}>
                    Password
                  </label>
                  <Link to="/forgot-password"
                    style={{fontSize:11,fontWeight:700,color:"#FF7A00",textDecoration:"none"}}>
                    Forgot?
                  </Link>
                </div>
                <div style={{position:"relative"}}>
                  <Lock size={14} color="#C4BAB1"
                    style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input
                    type={showPw?"text":"password"}
                    required
                    className={`lg-inp${pw && pwOk ? " valid" : pw && !pwOk ? " invalid" : ""}`}
                    placeholder="Enter your password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    style={{paddingRight:42}}
                  />
                  <button
                    type="button"
                    onClick={()=>setShowPw(!showPw)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#C4BAB1",display:"flex",padding:0}}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {pw && !pwOk && (
                  <p style={{fontSize:11,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:4}}>
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                <input type="checkbox" style={{width:14,height:14,accentColor:"#FF7A00",cursor:"pointer"}}/>
                <span style={{fontSize:12.5,color:"#5C5C6E",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                  Remember me for 30 days
                </span>
              </label>

              {/* Submit */}
              <button type="submit" disabled={busy || !canSubmit} className="lg-btn">
                {busy
                  ? <svg style={{animation:"spin .8s linear infinite"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/>
                    </svg>
                  : <>Sign In <ArrowRight size={14}/></>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}>
              <div style={{flex:1,height:1,background:"#F0ECE6"}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#9CA3AF",whiteSpace:"nowrap"}}>OR CONTINUE WITH</span>
              <div style={{flex:1,height:1,background:"#F0ECE6"}}/>
            </div>

            {/* Social buttons */}
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <button className="lg-soc"><span style={{fontSize:15}}>🌐</span> Google</button>
              <button className="lg-soc"><span style={{fontSize:15}}>📘</span> Facebook</button>
            </div>

            <p style={{textAlign:"center",fontSize:12.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>
              Don't have an account?{" "}
              <Link to="/register" style={{color:"#FF7A00",fontWeight:800,textDecoration:"none"}}>
                Create one →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}