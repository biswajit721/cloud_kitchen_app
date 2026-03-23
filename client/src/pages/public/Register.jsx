import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, ArrowRight, Gift, Truck, Star } from "lucide-react";

function pwScore(p) {
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const LABELS = ["","Weak","Fair","Good","Strong"];
const COLORS = ["","#EF4444","#FFC300","#FF7A00","#2ECC71"];

export default function Register() {
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [pw,     setPw]     = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err,    setErr]    = useState("");
  const [busy,   setBusy]   = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const score = pwScore(pw);

  const onSubmit = async e => {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await register(name, email, pw);
    setBusy(false);
    if (r.success) navigate("/");
    else setErr(r.message || "Registration failed. Please try again.");
  };

  const rules = [
    { label:"8+ chars",  ok: pw.length >= 8 },
    { label:"Uppercase", ok: /[A-Z]/.test(pw) },
    { label:"Number",    ok: /[0-9]/.test(pw) },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeL { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeR { from{opacity:0;transform:translateX(18px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes fadeU { from{opacity:0;transform:translateY(10px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.5)} }

        .rg-page {
          font-family: 'Sora', sans-serif;
          display: flex;
          height: 100vh;
          overflow: hidden;
          padding-top: 64px;        /* clear fixed navbar */
          background: #FFF9F2;
        }

        /* ── LEFT panel ── */
        .rg-left {
          flex: 0 0 46%;
          background: linear-gradient(155deg, #2ECC71 0%, #27AE60 45%, #1A8A4A 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 44px;
          animation: fadeL .5s ease both;
        }
        .rg-dots { position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,0.11) 1px,transparent 0);background-size:24px 24px;pointer-events:none; }
        .rg-orb1 { position:absolute;top:-80px;right:-80px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,0.09);pointer-events:none; }
        .rg-orb2 { position:absolute;bottom:-60px;left:-50px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.07);pointer-events:none; }

        /* ── RIGHT panel ── */
        .rg-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 32px;
          overflow-y: auto;
          animation: fadeR .5s .07s ease both;
        }
        .rg-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 20px;
          padding: 34px 32px;
          border: 1.5px solid #F0ECE6;
          box-shadow: 0 4px 32px rgba(0,0,0,0.07);
        }

        /* ── Input ── */
        .rg-inp {
          width: 100%; padding: 11.5px 14px 11.5px 42px;
          background: #F8F6F3; border: 1.5px solid #F0ECE6;
          border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 13.5px; color: #2C2C2C; outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .rg-inp:focus { border-color: #FF7A00; background: #fff; box-shadow: 0 0 0 3px rgba(255,122,0,.09); }
        .rg-inp::placeholder { color: #9CA3AF; font-family: 'Nunito', sans-serif; font-size: 13px; }

        /* ── Button ── */
        .rg-btn {
          width: 100%; padding: 13px; background: #FF7A00; color: #fff;
          border: none; border-radius: 11px; font-family: 'Sora', sans-serif;
          font-size: 14.5px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 5px 18px rgba(255,122,0,.28);
          transition: background .17s, transform .13s, box-shadow .17s;
        }
        .rg-btn:hover:not(:disabled) { background: #E06A00; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(255,122,0,.36); }
        .rg-btn:disabled { opacity: .65; cursor: not-allowed; }

        /* ── Social ── */
        .rg-soc {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px; border: 1.5px solid #F0ECE6; border-radius: 10px;
          background: #fff; font-family: 'Sora', sans-serif; font-size: 12.5px;
          font-weight: 700; color: #5C5C6E; cursor: pointer;
          transition: all .15s ease;
        }
        .rg-soc:hover { border-color: #FF7A00; color: #FF7A00; background: #FFF3E8; }

        /* ── Perk card ── */
        .rg-perk {
          display: flex; align-items: center; gap: 11px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 13px; padding: 11px 13px; backdrop-filter: blur(8px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 800px) {
          .rg-left  { display: none !important; }
          .rg-right { padding: 20px 16px !important; }
          .rg-card  { padding: 28px 20px !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="rg-page">

        {/* ════════ LEFT BRAND PANEL ════════ */}
        <div className="rg-left">
          <div className="rg-dots"/>
          <div className="rg-orb1"/> <div className="rg-orb2"/>

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
              <span style={{width:7,height:7,background:"#FFC300",borderRadius:"50%",display:"block",animation:"pulse 1.5s ease infinite"}}/>
              <span style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:"0.04em"}}>Free to join · No credit card</span>
            </div>

            <h2 style={{fontSize:"clamp(1.6rem,2.5vw,2.3rem)",fontWeight:900,color:"#fff",lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:10}}>
              Your first meal<br/>
              <span style={{background:"linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.68) 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                is on us 🎉
              </span>
            </h2>
            <p style={{color:"rgba(255,255,255,0.78)",fontSize:13.5,lineHeight:1.8,fontFamily:"'Nunito',sans-serif",fontWeight:500,maxWidth:290,marginBottom:22}}>
              Create your account in seconds and unlock exclusive deals, live tracking, and faster reorders.
            </p>

            {/* Perks */}
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:22}}>
              {[
                {Icon:Gift, title:"50% off first order", sub:"Use FIRST50 at checkout"},
                {Icon:Truck,title:"Free delivery",       sub:"No minimum this week"},
                {Icon:Star, title:"Exclusive deals",     sub:"Daily offers for members"},
              ].map(({Icon,title,sub},i)=>(
                <div key={i} className="rg-perk">
                  <div style={{width:32,height:32,background:"rgba(255,255,255,0.20)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon size={15} color="#fff"/>
                  </div>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:800,color:"#fff"}}>{title}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.58)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust pills */}
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["🔒 Secure","⚡ Fast","🌿 Fresh","📦 Tracked"].map((b,i)=>(
                <span key={i} style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.78)",background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.20)",borderRadius:99,padding:"4px 11px"}}>{b}</span>
              ))}
            </div>
          </div>

          {/* Bottom note */}
          <div style={{position:"relative",zIndex:1}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.42)",fontFamily:"'Nunito',sans-serif"}}>
              Trusted by 2M+ food lovers across 500+ cities.
            </p>
          </div>
        </div>

        {/* ════════ RIGHT FORM PANEL ════════ */}
        <div className="rg-right">
          <div className="rg-card">

            {/* Header */}
            <div style={{marginBottom:22}}>
              <div style={{width:46,height:46,background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12,boxShadow:"0 6px 18px rgba(255,122,0,.26)"}}>🍔</div>
              <h1 style={{fontSize:21,fontWeight:900,color:"#2C2C2C",marginBottom:3,letterSpacing:"-0.02em"}}>Create account ✨</h1>
              <p style={{fontSize:12.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>Fill in your details to get started</p>
            </div>

            {/* Error */}
            {err && (
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"9px 12px",marginBottom:14,animation:"fadeU .3s ease"}}>
                <AlertCircle size={14} color="#EF4444" style={{flexShrink:0}}/>
                <span style={{fontSize:12,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{err}</span>
              </div>
            )}

            <form onSubmit={onSubmit} style={{display:"flex",flexDirection:"column",gap:13}}>

              {/* Name */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:5,letterSpacing:"0.05em",textTransform:"uppercase"}}>Full Name</label>
                <div style={{position:"relative"}}>
                  <User size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type="text" required className="rg-inp" placeholder="Aryan Mehta" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:5,letterSpacing:"0.05em",textTransform:"uppercase"}}>Email Address</label>
                <div style={{position:"relative"}}>
                  <Mail size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type="email" required className="rg-inp" placeholder="aryan@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:5,letterSpacing:"0.05em",textTransform:"uppercase"}}>Password</label>
                <div style={{position:"relative"}}>
                  <Lock size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type={showPw?"text":"password"} required className="rg-inp" placeholder="Create a strong password"
                    value={pw} onChange={e=>setPw(e.target.value)} style={{paddingRight:42}}/>
                  <button type="button" onClick={()=>setShowPw(!showPw)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#C4BAB1",display:"flex",padding:0}}>
                    {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                  </button>
                </div>

                {/* Strength */}
                {pw && (
                  <div style={{marginTop:7}}>
                    <div style={{display:"flex",gap:3,marginBottom:5}}>
                      {[1,2,3,4].map(i=>(
                        <div key={i} style={{flex:1,height:3,borderRadius:99,background:i<=score?COLORS[score]:"#F0ECE6",transition:"background .22s"}}/>
                      ))}
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {rules.map((r,i)=>(
                          <span key={i} style={{display:"flex",alignItems:"center",gap:3,fontSize:10.5,fontFamily:"'Nunito',sans-serif",fontWeight:700,color:r.ok?"#2ECC71":"#9CA3AF"}}>
                            {r.ok
                              ? <CheckCircle size={10} color="#2ECC71"/>
                              : <span style={{width:10,height:10,borderRadius:"50%",border:"1.5px solid #9CA3AF",display:"inline-block"}}/>
                            }
                            {r.label}
                          </span>
                        ))}
                      </div>
                      {score>0 && <span style={{fontSize:10.5,fontWeight:800,color:COLORS[score]}}>{LABELS[score]}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label style={{display:"flex",alignItems:"flex-start",gap:7,cursor:"pointer",userSelect:"none"}}>
                <input type="checkbox" required style={{width:14,height:14,accentColor:"#FF7A00",cursor:"pointer",marginTop:1,flexShrink:0}}/>
                <span style={{fontSize:11.5,color:"#5C5C6E",fontFamily:"'Nunito',sans-serif",fontWeight:600,lineHeight:1.5}}>
                  I agree to the{" "}
                  <a href="#" style={{color:"#FF7A00",textDecoration:"none",fontWeight:800}}>Terms</a>
                  {" "}&amp;{" "}
                  <a href="#" style={{color:"#FF7A00",textDecoration:"none",fontWeight:800}}>Privacy Policy</a>
                </span>
              </label>

              <button type="submit" disabled={busy} className="rg-btn">
                {busy
                  ? <svg style={{animation:"spin .8s linear infinite"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/></svg>
                  : <>Create Account <ArrowRight size={14}/></>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}>
              <div style={{flex:1,height:1,background:"#F0ECE6"}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#9CA3AF",whiteSpace:"nowrap"}}>OR SIGN UP WITH</span>
              <div style={{flex:1,height:1,background:"#F0ECE6"}}/>
            </div>

            {/* Social */}
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              <button className="rg-soc"><span style={{fontSize:15}}>🌐</span> Google</button>
              <button className="rg-soc"><span style={{fontSize:15}}>📘</span> Facebook</button>
            </div>

            <p style={{textAlign:"center",fontSize:12.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>
              Already have an account?{" "}
              <Link to="/login" style={{color:"#FF7A00",fontWeight:800,textDecoration:"none"}}>Sign in →</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}