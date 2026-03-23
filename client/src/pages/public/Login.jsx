import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Star, Shield, Zap } from "lucide-react";

export default function Login() {
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [err,     setErr]     = useState("");
  const [busy,    setBusy]    = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onSubmit = async e => {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await login(email, pw);
    setBusy(false);
    if (r.success) {
      const u = JSON.parse(localStorage.getItem("user"));
      navigate(u?.role === "admin" ? "/admin" : "/");
    } else setErr(r.message || "Invalid email or password.");
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
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .lg-page {
          font-family: 'Sora', sans-serif;
          display: flex;
          height: 100vh;          /* exact viewport height */
          overflow: hidden;        /* no page scroll */
          padding-top: 64px;       /* clear the fixed navbar */
          background: #FFF9F2;
        }

        /* ── LEFT panel ── */
        .lg-left {
          flex: 0 0 46%;
          background: linear-gradient(155deg, #FF7A00 0%, #FF9A3C 55%, #FFB347 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 44px;
          animation: fadeL .5s ease both;
        }
        .lg-left-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0);
          background-size: 24px 24px; pointer-events: none;
        }
        .lg-orb1 { position:absolute; top:-80px; right:-80px; width:280px; height:280px; border-radius:50%; background:rgba(255,255,255,0.09); pointer-events:none; }
        .lg-orb2 { position:absolute; bottom:-60px; left:-50px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); pointer-events:none; }

        /* ── RIGHT panel ── */
        .lg-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 32px;
          overflow-y: auto;
          animation: fadeR .5s .07s ease both;
        }
        .lg-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 20px;
          padding: 38px 34px;
          border: 1.5px solid #F0ECE6;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07);
        }

        /* ── Input ── */
        .lg-inp {
          width: 100%; padding: 12px 14px 12px 42px;
          background: #F8F6F3; border: 1.5px solid #F0ECE6;
          border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 13.5px; color: #2C2C2C; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .lg-inp:focus { border-color: #FF7A00; background: #fff; box-shadow: 0 0 0 3px rgba(255,122,0,.09); }
        .lg-inp::placeholder { color: #9CA3AF; font-family: 'Nunito', sans-serif; font-size: 13px; }

        /* ── Button ── */
        .lg-btn {
          width: 100%; padding: 13px; background: #FF7A00; color: #fff;
          border: none; border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 14.5px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 5px 18px rgba(255,122,0,.28);
          transition: background .17s, transform .13s, box-shadow .17s;
        }
        .lg-btn:hover:not(:disabled) { background: #E06A00; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,122,0,.36); }
        .lg-btn:disabled { opacity: .65; cursor: not-allowed; }

        /* ── Social ── */
        .lg-soc {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px; border: 1.5px solid #F0ECE6; border-radius: 10px;
          background: #fff; font-family: 'Sora', sans-serif; font-size: 12.5px;
          font-weight: 700; color: #5C5C6E; cursor: pointer;
          transition: all .15s ease;
        }
        .lg-soc:hover { border-color: #FF7A00; color: #FF7A00; background: #FFF3E8; }

        /* ── Stat chip ── */
        .lg-stat {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px; padding: 10px 16px; backdrop-filter: blur(8px);
        }

        /* ── Review card ── */
        .lg-review {
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px; padding: 14px; backdrop-filter: blur(10px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 800px) {
          .lg-left  { display: none !important; }
          .lg-right { padding: 20px 16px !important; }
          .lg-card  { padding: 30px 22px !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="lg-page">

        {/* ════════ LEFT BRAND PANEL ════════ */}
        <div className="lg-left">
          <div className="lg-left-dots"/>
          <div className="lg-orb1"/> <div className="lg-orb2"/>

          {/* Logo */}
          <div style={{position:"relative",zIndex:1}}>
            <Link to="/" style={{display:"inline-flex",alignItems:"center",gap:9,textDecoration:"none"}}>
              <div style={{width:38,height:38,background:"rgba(255,255,255,0.22)",border:"1.5px solid rgba(255,255,255,0.32)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>🍔</div>
              <span style={{fontSize:18,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>MyApp</span>
            </Link>
          </div>

          {/* Main copy */}
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

            {/* Stats */}
            <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
              {[{v:"4.9★",l:"Rating"},{v:"28min",l:"Delivery"},{v:"500+",l:"Cities"}].map((s,i)=>(
                <div key={i} className="lg-stat">
                  <span style={{fontSize:14,fontWeight:900,color:"#fff",lineHeight:1}}>{s.v}</span>
                  <span style={{fontSize:10,color:"rgba(255,255,255,0.60)",fontWeight:600}}>{s.l}</span>
                </div>
              ))}
            </div>

            {/* Review */}
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

          {/* Bottom perks */}
          <div style={{position:"relative",zIndex:1,display:"flex",gap:14,flexWrap:"wrap"}}>
            {[{Icon:Zap,l:"Fast"},{Icon:Shield,l:"Secure"},{Icon:Star,l:"Top Rated"}].map(({Icon,l},i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5,color:"rgba(255,255,255,0.70)",fontSize:11.5,fontWeight:700}}>
                <Icon size={12} color="rgba(255,255,255,0.70)"/>{l}
              </div>
            ))}
          </div>
        </div>

        {/* ════════ RIGHT FORM PANEL ════════ */}
        <div className="lg-right">
          <div className="lg-card">

            {/* Header */}
            <div style={{marginBottom:26}}>
              <div style={{width:46,height:46,background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14,boxShadow:"0 6px 18px rgba(255,122,0,.26)"}}>🍔</div>
              <h1 style={{fontSize:22,fontWeight:900,color:"#2C2C2C",marginBottom:4,letterSpacing:"-0.02em"}}>Welcome back 👋</h1>
              <p style={{fontSize:13,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>Sign in to continue ordering</p>
            </div>

            {/* Error */}
            {err && (
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"10px 13px",marginBottom:16,animation:"fadeU .3s ease"}}>
                <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
              </div>
            )}

            <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:15}}>

              {/* Email */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>Email Address</label>
                <div style={{position:"relative"}}>
                  <Mail size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type="email" required className="lg-inp" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#5C5C6E",letterSpacing:"0.05em",textTransform:"uppercase"}}>Password</label>
                  <a href="#" style={{fontSize:11,fontWeight:700,color:"#FF7A00",textDecoration:"none"}}>Forgot?</a>
                </div>
                <div style={{position:"relative"}}>
                  <Lock size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type={showPw?"text":"password"} required className="lg-inp" placeholder="Enter your password"
                    value={pw} onChange={e=>setPw(e.target.value)} style={{paddingRight:42}}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#C4BAB1",display:"flex",padding:0}}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                <input type="checkbox" style={{width:14,height:14,accentColor:"#FF7A00",cursor:"pointer"}}/>
                <span style={{fontSize:12.5,color:"#5C5C6E",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>Remember me for 30 days</span>
              </label>

              <button type="submit" disabled={busy} className="lg-btn">
                {busy
                  ? <svg style={{animation:"spin .8s linear infinite"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/></svg>
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

            {/* Social */}
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <button className="lg-soc"><span style={{fontSize:15}}>🌐</span> Google</button>
              <button className="lg-soc"><span style={{fontSize:15}}>📘</span> Facebook</button>
            </div>

            <p style={{textAlign:"center",fontSize:12.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>
              Don't have an account?{" "}
              <Link to="/register" style={{color:"#FF7A00",fontWeight:800,textDecoration:"none"}}>Create one →</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}