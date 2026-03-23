import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, ChevronRight, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";

/* ─── Styles ─── */
const ContactStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');

    :root {
      --orange: #FF7A00;
      --orange-dark: #E06A00;
      --orange-light: #FFF3E8;
      --orange-mid: #FF9A3C;
      --green: #2ECC71;
      --green-light: #E8FAF0;
      --green-dark: #27AE60;
      --yellow: #FFC300;
      --yellow-light: #FFF8E1;
      --cream: #FFF9F2;
      --white: #FFFFFF;
      --text: #2C2C2C;
      --text-mid: #5C5C6E;
      --text-light: #9CA3AF;
      --border: #F0ECE6;
      --navy: #1A1A2E;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-10px); }
    }
    @keyframes float2 {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      50%      { transform: translateY(-7px) rotate(1.5deg); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pulse-dot {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.5); opacity: 0.6; }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes success-pop {
      0%   { transform: scale(0.8); opacity: 0; }
      70%  { transform: scale(1.05); }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    /* hero */
    .ct-hero-left  { animation: fadeUp 0.7s ease both; }
    .ct-hero-right { animation: fadeIn 0.9s 0.3s ease both; }

    /* input focus */
    .ct-input {
      width: 100%; padding: 13px 16px;
      background: var(--cream); border: 1.5px solid var(--border);
      border-radius: 13px; font-family: 'Sora', sans-serif;
      font-size: 14px; color: var(--text); outline: none;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }
    .ct-input:focus {
      border-color: var(--orange);
      background: var(--white);
      box-shadow: 0 0 0 3px rgba(255,122,0,0.10);
    }
    .ct-input::placeholder { color: var(--text-light); font-family: 'Nunito', sans-serif; }

    .ct-textarea {
      width: 100%; padding: 13px 16px;
      background: var(--cream); border: 1.5px solid var(--border);
      border-radius: 13px; font-family: 'Nunito', sans-serif;
      font-size: 14px; color: var(--text); outline: none; resize: vertical;
      min-height: 120px;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    }
    .ct-textarea:focus {
      border-color: var(--orange);
      background: var(--white);
      box-shadow: 0 0 0 3px rgba(255,122,0,0.10);
    }
    .ct-textarea::placeholder { color: var(--text-light); }

    /* submit button */
    .ct-submit {
      width: 100%; padding: 14px;
      background: var(--orange); color: #fff; border: none;
      border-radius: 14px; font-family: 'Sora', sans-serif;
      font-size: 15px; font-weight: 800; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 6px 22px rgba(255,122,0,0.32);
      transition: background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
    }
    .ct-submit:hover:not(:disabled) {
      background: var(--orange-dark);
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(255,122,0,0.40);
    }
    .ct-submit:disabled { opacity: 0.7; cursor: not-allowed; }

    /* info cards */
    .ct-info-card {
      transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
    }
    .ct-info-card:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 16px 40px rgba(255,122,0,0.12) !important;
    }

    /* FAQ accordion */
    .faq-card {
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }
    .faq-card:hover { border-color: var(--orange) !important; }

    /* footer links */
    .ct-footer-link:hover { color: var(--orange) !important; }

    /* alert boxes */
    .ct-alert-success {
      background: var(--green-light); border: 1.5px solid rgba(46,204,113,0.35);
      border-radius: 13px; padding: 14px 18px;
      display: flex; align-items: center; gap: 10px;
      animation: slideInUp 0.35s ease both;
    }
    .ct-alert-error {
      background: #FFF0F0; border: 1.5px solid #FFCCCC;
      border-radius: 13px; padding: 14px 18px;
      display: flex; align-items: center; gap: 10px;
      animation: slideInUp 0.35s ease both;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .ct-form-grid    { grid-template-columns: 1fr !important; gap: 0 !important; }
      .ct-info-side    { border-radius: 24px 24px 0 0 !important; padding: 40px 5vw !important; }
      .ct-form-side    { border-radius: 0 0 24px 24px !important; padding: 40px 5vw !important; }
      .ct-hero-grid    { grid-template-columns: 1fr !important; }
      .ct-hero-visual  { display: none !important; }
      .ct-quick-grid   { grid-template-columns: 1fr 1fr !important; }
      .ct-footer-grid  { grid-template-columns: 1fr 1fr !important; }
    }
    @media (max-width: 600px) {
      .ct-quick-grid  { grid-template-columns: 1fr !important; }
      .ct-footer-grid { grid-template-columns: 1fr !important; }
      .ct-hero-left h1 { font-size: 2.4rem !important; }
      .ct-name-row    { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ── Scroll reveal ── */
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".ct-reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; obs.unobserve(e.target); } }),
      { threshold: 0.10 }
    );
    els.forEach(el => { el.style.opacity = "0"; el.style.transform = "translateY(24px)"; el.style.transition = "opacity 0.6s ease, transform 0.6s ease"; obs.observe(el); });
    return () => obs.disconnect();
  }, []);
}

const quickInfo = [
  { icon:"📧", title:"Email Us",       val:"support@myapp.com",  sub:"Reply within 2 hours",    color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8" },
  { icon:"📞", title:"Call Us",        val:"+91 98765 43210",    sub:"Mon–Sat · 9 AM – 9 PM",   color:"#2ECC71", bg:"#E8FAF0", border:"#A8E6C2" },
  { icon:"📍", title:"Visit Us",       val:"Bangalore, India",   sub:"Head Office",              color:"#FFC300", bg:"#FFF8E1", border:"#FFE57A" },
  { icon:"💬", title:"Live Chat",      val:"Available on app",   sub:"Avg. wait < 3 mins",       color:"#9B59B6", bg:"#F5EEFF", border:"#D8B4FE" },
];

const faqs = [
  { q:"How long does delivery take?",         a:"Average delivery is 28 minutes. We show real-time tracking for every order." },
  { q:"Can I track my order live?",           a:"Yes! Once placed, you get a live GPS map showing your delivery hero en route." },
  { q:"What if my order arrives cold?",       a:"We guarantee hot food or your money back — no questions asked." },
  { q:"How do I become a restaurant partner?",a:"Fill out the contact form above with subject 'Restaurant Partnership' and our team will reach you within 24 hours." },
];

export default function ContactUs() {
  useReveal();

  const [formData, setFormData] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState("");
  const [error,    setError]    = useState("");
  const [openFaq,  setOpenFaq]  = useState(null);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await api.post("/contact/add", formData);
      // Accept any 2xx response or explicit success flag
      if (res.status >= 200 && res.status < 300) {
        setSuccess("Message sent successfully! We'll get back to you within 2 hours. 🎉");
        setFormData({ name:"", email:"", phone:"", subject:"", message:"" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      // Still show success if the server returned 2xx but axios threw (unlikely),
      // otherwise show a friendly error
      if (err?.response?.status >= 200 && err?.response?.status < 300) {
        setSuccess("Message submitted! We'll get back to you within 2 hours. 🎉");
        setFormData({ name:"", email:"", phone:"", subject:"", message:"" });
      } else {
        setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <ContactStyles />
      <div style={{ fontFamily:"'Sora', sans-serif", background:"var(--cream)", width:"100%", overflowX:"hidden", color:"var(--text)" }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section style={{
          width:"100%",
          background:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 45%, #FFB347 100%)",
          position:"relative", overflow:"hidden",
          padding:"100px 5vw 90px",
        }}>
          {/* Dot grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
          {/* Orbs */}
          <div style={{ position:"absolute", top:-140, right:-140, width:500, height:500, borderRadius:"50%", background:"rgba(255,255,255,0.09)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-100, left:-80, width:360, height:360, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>
          {/* Spinning ring */}
          <div style={{ position:"absolute", bottom:"12%", right:"6%", width:200, height:200, borderRadius:"50%", border:"2px dashed rgba(255,255,255,0.22)", animation:"spin-slow 28s linear infinite", pointerEvents:"none" }}/>

          <div className="ct-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"center", position:"relative", zIndex:1 }}>

            {/* LEFT */}
            <div className="ct-hero-left">
              {/* Breadcrumb */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:24 }}>
                <Link to="/" style={{ color:"rgba(255,255,255,0.60)", fontSize:13, fontWeight:500, textDecoration:"none" }}
                  onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.90)"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.60)"}
                >Home</Link>
                <ChevronRight size={13} color="rgba(255,255,255,0.40)"/>
                <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>Contact Us</span>
              </div>

              {/* Badge */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
                background:"rgba(255,255,255,0.20)", border:"1.5px solid rgba(255,255,255,0.35)",
                borderRadius:99, padding:"8px 18px", backdropFilter:"blur(8px)",
              }}>
                <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-dot 1.5s ease infinite" }}/>
                <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:"0.04em" }}>Support team online · avg reply 2 hrs</span>
              </div>

              <h1 style={{
                fontSize:"clamp(2.6rem, 5vw, 4.8rem)", fontWeight:900,
                lineHeight:1.06, letterSpacing:"-0.03em", color:"#fff", marginBottom:18,
              }}>
                We'd love to<br/>
                <span style={{ background:"linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.75) 100%)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  hear from you.
                </span>
              </h1>

              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(0.95rem,1.3vw,1.1rem)", lineHeight:1.8, maxWidth:480, fontFamily:"'Nunito',sans-serif", fontWeight:500 }}>
                Got a question, a partnership idea, or just want to say hello? Drop us a message and our team will get back to you faster than your next delivery.
              </p>
            </div>

            {/* RIGHT — floating card */}
            <div className="ct-hero-visual" style={{ flexShrink:0, position:"relative" }}>
              <div style={{
                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(20px)",
                border:"1.5px solid rgba(255,255,255,0.32)",
                borderRadius:28, padding:"36px 32px", textAlign:"center",
                boxShadow:"0 24px 64px rgba(0,0,0,0.16)",
                animation:"float2 5s ease-in-out infinite", minWidth:200,
              }}>
                <div style={{ fontSize:64, marginBottom:12 }}>💬</div>
                <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginBottom:4 }}>Always Here</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontFamily:"'Nunito',sans-serif", marginBottom:16 }}>For you, 7 days a week</div>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  {["📧","📞","💬"].map((ic,i)=>(
                    <div key={i} style={{ width:36, height:36, background:"rgba(255,255,255,0.22)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{ic}</div>
                  ))}
                </div>
              </div>
              {/* Badges */}
              <div style={{ position:"absolute", top:-12, left:-20, background:"#fff", borderRadius:14, padding:"10px 14px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 10px 32px rgba(0,0,0,0.14)", animation:"float 4s ease-in-out infinite" }}>
                <span style={{fontSize:18}}>⚡</span>
                <div><div style={{fontSize:10,color:"var(--text-light)",fontWeight:600}}>Response</div><div style={{fontSize:13,color:"var(--text)",fontWeight:900}}>~2 hours</div></div>
              </div>
              <div style={{ position:"absolute", bottom:-12, right:-16, background:"#fff", borderRadius:14, padding:"10px 14px", display:"flex", alignItems:"center", gap:8, boxShadow:"0 10px 32px rgba(0,0,0,0.14)", animation:"float 4s 1.8s ease-in-out infinite" }}>
                <span style={{fontSize:18}}>😊</span>
                <div><div style={{fontSize:10,color:"var(--text-light)",fontWeight:600}}>Satisfaction</div><div style={{fontSize:13,color:"var(--text)",fontWeight:900}}>98.7%</div></div>
              </div>
            </div>
          </div>

          {/* Wave */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 72" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,72 C360,0 1080,72 1440,18 L1440,72 Z" fill="var(--cream)"/>
            </svg>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            QUICK INFO CARDS
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--cream)", padding:"56px 5vw 0" }}>
          <div className="ct-quick-grid ct-reveal" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {quickInfo.map((info, i) => (
              <div key={i} className="ct-info-card" style={{
                background:"var(--white)", border:`2px solid ${info.border}`,
                borderRadius:20, padding:"24px 20px", textAlign:"center", cursor:"default",
              }}>
                <div style={{ width:52, height:52, background:info.bg, border:`1.5px solid ${info.border}`, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 14px" }}>
                  {info.icon}
                </div>
                <div style={{ fontSize:12, fontWeight:800, color:"var(--text-light)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:6 }}>{info.title}</div>
                <div style={{ fontSize:14, fontWeight:800, color:"var(--text)", marginBottom:4 }}>{info.val}</div>
                <div style={{ fontSize:11, color:info.color, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>{info.sub}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════
            MAIN CONTACT FORM + INFO
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--cream)", padding:"52px 5vw 72px" }}>
          <div className="ct-form-grid ct-reveal" style={{
            display:"grid", gridTemplateColumns:"1fr 1.4fr",
            gap:0, background:"var(--white)",
            borderRadius:28, overflow:"hidden",
            boxShadow:"0 20px 64px rgba(255,122,0,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            border:"1.5px solid var(--border)",
          }}>

            {/* ── LEFT — info panel ── */}
            <div className="ct-info-side" style={{
              background:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 50%, #FFB347 100%)",
              padding:"52px 40px",
              position:"relative", overflow:"hidden",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
            }}>
              {/* Dot grid */}
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
              {/* Orb */}
              <div style={{ position:"absolute", bottom:-80, right:-80, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
              <div style={{ position:"absolute", top:-50, left:-50, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>

              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:13, fontWeight:800, color:"rgba(255,255,255,0.65)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:16 }}>Contact Information</div>
                <h2 style={{ fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:14 }}>
                  Let's talk<br/>food & more
                </h2>
                <p style={{ color:"rgba(255,255,255,0.80)", fontSize:14, lineHeight:1.8, maxWidth:280, fontFamily:"'Nunito',sans-serif", marginBottom:36 }}>
                  Our friendly support team is ready to help with any questions, feedback, or partnership requests.
                </p>

                {/* Contact items */}
                <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                  {[
                    { Icon:Mail,    val:"support@myapp.com",  label:"Email us anytime"       },
                    { Icon:Phone,   val:"+91 98765 43210",    label:"Mon–Sat · 9AM – 9PM"    },
                    { Icon:MapPin,  val:"Bangalore, India",   label:"Head Office"             },
                    { Icon:Clock,   val:"~2 Hour Reply",      label:"Average response time"   },
                  ].map(({ Icon, val, label }, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:40, height:40, background:"rgba(255,255,255,0.20)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.30)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={17} color="#fff"/>
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{val}</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.60)", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom social strip */}
              <div style={{ position:"relative", zIndex:1, marginTop:40 }}>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.55)", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:14 }}>Follow Us</div>
                <div style={{ display:"flex", gap:10 }}>
                  {["📘","🐦","📸","▶️"].map((ic,i)=>(
                    <div key={i} style={{ width:38, height:38, background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.28)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.30)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
                    >{ic}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT — form ── */}
            <div className="ct-form-side" style={{ padding:"52px 44px" }}>
              <div style={{ marginBottom:32 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--orange-light)", border:"1px solid #FFD4A8", borderRadius:99, padding:"5px 14px", marginBottom:14 }}>
                  <MessageCircle size={12} color="var(--orange)"/>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--orange-dark)", letterSpacing:"0.07em", textTransform:"uppercase" }}>Send a Message</span>
                </div>
                <h2 style={{ fontSize:"clamp(1.5rem,2.2vw,2rem)", fontWeight:900, color:"var(--text)" }}>
                  How can we help?
                </h2>
              </div>

              {/* Alerts */}
              {success && (
                <div className="ct-alert-success" style={{ marginBottom:20 }}>
                  <CheckCircle size={18} color="var(--green-dark)"/>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--green-dark)", fontFamily:"'Nunito',sans-serif" }}>{success}</span>
                </div>
              )}
              {error && (
                <div className="ct-alert-error" style={{ marginBottom:20 }}>
                  <AlertCircle size={18} color="#EF4444"/>
                  <span style={{ fontSize:14, fontWeight:600, color:"#EF4444", fontFamily:"'Nunito',sans-serif" }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {/* Name + Email row */}
                <div className="ct-name-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-mid)", marginBottom:6, letterSpacing:"0.03em" }}>Full Name *</label>
                    <input
                      type="text" name="name" required
                      placeholder="Aryan Mehta"
                      value={formData.name} onChange={handleChange}
                      className="ct-input"
                    />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-mid)", marginBottom:6, letterSpacing:"0.03em" }}>Email Address *</label>
                    <input
                      type="email" name="email" required
                      placeholder="aryan@example.com"
                      value={formData.email} onChange={handleChange}
                      className="ct-input"
                    />
                  </div>
                </div>

                {/* Phone + Subject row */}
                <div className="ct-name-row" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-mid)", marginBottom:6, letterSpacing:"0.03em" }}>Phone Number</label>
                    <input
                      type="tel" name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone} onChange={handleChange}
                      className="ct-input"
                    />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-mid)", marginBottom:6, letterSpacing:"0.03em" }}>Subject</label>
                    <select
                      name="subject"
                      value={formData.subject} onChange={handleChange}
                      className="ct-input"
                      style={{ cursor:"pointer", appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", backgroundSize:"16px", paddingRight:"36px" }}
                    >
                      <option value="">Select topic…</option>
                      <option value="Order Issue">🛵 Order Issue</option>
                      <option value="Partnership">🤝 Restaurant Partnership</option>
                      <option value="Delivery">📦 Delivery Query</option>
                      <option value="Feedback">💬 Feedback</option>
                      <option value="Other">❓ Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"var(--text-mid)", marginBottom:6, letterSpacing:"0.03em" }}>Your Message *</label>
                  <textarea
                    name="message" required
                    placeholder="Tell us how we can help you…"
                    value={formData.message} onChange={handleChange}
                    className="ct-textarea"
                  />
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="ct-submit">
                  {loading ? (
                    <>
                      <svg style={{ animation:"spin-slow 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.4"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <><Send size={16}/> Send Message</>
                  )}
                </button>

                <p style={{ fontSize:12, color:"var(--text-light)", textAlign:"center", fontFamily:"'Nunito',sans-serif" }}>
                  We reply within 2 hours during business hours (9 AM – 9 PM)
                </p>
              </form>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--white)", padding:"72px 5vw" }}>
          <div className="ct-reveal" style={{ textAlign:"center", marginBottom:48 }}>
            <span style={{ display:"inline-block", background:"var(--yellow-light)", border:"1px solid var(--yellow)", color:"#92670A", fontSize:11, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", padding:"5px 16px", borderRadius:99, marginBottom:14 }}>
              💛 FAQ
            </span>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:900, color:"var(--text)", margin:"0 0 10px" }}>
              Common questions
            </h2>
            <p style={{ color:"var(--text-mid)", fontSize:15, maxWidth:420, margin:"0 auto", fontFamily:"'Nunito',sans-serif", lineHeight:1.75 }}>
              Quick answers to questions we hear most often.
            </p>
          </div>

          <div className="ct-reveal" style={{ maxWidth:760, margin:"0 auto", display:"flex", flexDirection:"column", gap:14 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-card" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  background: openFaq === i ? "var(--orange-light)" : "var(--cream)",
                  border: `2px solid ${openFaq === i ? "#FFD4A8" : "var(--border)"}`,
                  borderRadius:18, overflow:"hidden",
                }}
              >
                <div style={{ padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                  <span style={{ fontSize:14, fontWeight:700, color: openFaq === i ? "var(--orange)" : "var(--text)" }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width:28, height:28, flexShrink:0,
                    background: openFaq === i ? "var(--orange)" : "var(--border)",
                    borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, transition:"all 0.2s ease",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    color: openFaq === i ? "#fff" : "var(--text-mid)",
                    fontWeight:800,
                  }}>+</div>
                </div>
                {openFaq === i && (
                  <div style={{ padding:"0 22px 18px", animation:"fadeIn 0.2s ease" }}>
                    <p style={{ fontSize:14, color:"var(--text-mid)", lineHeight:1.75, margin:0, fontFamily:"'Nunito',sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════
            MAP PLACEHOLDER STRIP
        ══════════════════════════════════════════ */}
        <div style={{ width:"100%", background:"var(--navy)", overflow:"hidden", padding:"12px 0", userSelect:"none" }}>
          <div style={{ display:"flex", animation:"marquee 22s linear infinite", width:"max-content" }}>
            {Array.from({length:4}).flatMap(()=>["📧 support@myapp.com","📞 +91 98765 43210","📍 Bangalore · Mumbai · Delhi","⚡ Reply in ~2 Hours","😊 98.7% Satisfaction Rate","💬 Live Chat on App"]).map((t,i)=>(
              <span key={i} style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontWeight:700, paddingRight:48, whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", fontFamily:"'Nunito',sans-serif" }}>
                {t}<span style={{marginLeft:48,color:"var(--orange)"}}>◆</span>
              </span>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════════
            FOOTER — identical to Home & About
        ══════════════════════════════════════════ */}
        <footer style={{ width:"100%", background:"var(--navy)", padding:"60px 5vw 28px" }}>
          <div className="ct-footer-grid" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:36, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:36, height:36, background:"var(--orange)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🍔</div>
                <span style={{ fontSize:22, fontWeight:900, color:"var(--orange)", fontFamily:"'Sora',sans-serif" }}>MyApp</span>
              </div>
              <p style={{ color:"#475569", fontSize:14, lineHeight:1.8, maxWidth:240, fontFamily:"'Nunito',sans-serif" }}>
                Delivering happiness to your doorstep, one fresh meal at a time. 🧡
              </p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["📘","🐦","📸","▶️"].map((icon,i)=>(
                  <div key={i} style={{ width:36, height:36, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.10)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,122,0,0.18)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                  >{icon}</div>
                ))}
              </div>
            </div>

            {[
              { title:"Quick Links", links:[{l:"Home",to:"/"},{l:"Browse Foods",to:"/foods"},{l:"About",to:"/about"},{l:"Contact",to:"/contact"}] },
              { title:"Account",     links:[{l:"Sign In",to:"/login"},{l:"Register",to:"/register"},{l:"My Orders",to:"/my-orders"},{l:"Admin",to:"/admin"}] },
              { title:"Support",     links:[{l:"Help Centre",to:"/"},{l:"Privacy Policy",to:"/"},{l:"Terms of Use",to:"/"},{l:"Contact Us",to:"/contact"}] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color:"rgba(255,255,255,0.45)", fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:20 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                  {col.links.map(l=>(
                    <li key={l.l}>
                      <Link to={l.to} className="ct-footer-link" style={{ color:"#4B5563", fontSize:14, textDecoration:"none", transition:"color 0.15s", fontFamily:"'Nunito',sans-serif" }}>
                        {l.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop:"1px solid #1E293B", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito',sans-serif" }}>© 2026 MyApp. All rights reserved.</p>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito',sans-serif" }}>Made with 🧡 for food lovers</p>
          </div>
        </footer>

      </div>
    </>
  );
}