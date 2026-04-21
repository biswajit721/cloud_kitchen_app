import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import snapbiteLogo from "../../assets/snapbite-logo.png";

/* ─── Styles ─── */
const AboutStyles = () => (
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

    /* ── Animations ── */
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
      50%      { transform: translateY(-7px) rotate(2deg); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pulse-dot {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.5); opacity: 0.6; }
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes count-up {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Hero animations ── */
    .ab-hero-content { animation: fadeUp 0.7s ease both; }
    .ab-hero-visual  { animation: fadeIn 0.9s 0.3s ease both; }

    /* ── Section entrance ── */
    .ab-reveal {
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .ab-reveal.visible { opacity: 1; transform: translateY(0); }

    /* ── Value cards ── */
    .val-card {
      transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease !important;
    }
    .val-card:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 48px rgba(0,0,0,0.09) !important;
    }

    /* ── Team cards ── */
    .team-card {
      transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s !important;
    }
    .team-card:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 48px rgba(255,122,0,0.12) !important;
      border-color: var(--orange) !important;
    }

    /* ── Timeline nodes ── */
    .tl-card {
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .tl-card:hover {
      border-color: var(--orange) !important;
      box-shadow: 0 10px 32px rgba(255,122,0,0.12) !important;
    }

    /* ── CTA buttons ── */
    .cta-primary:hover  { background: var(--white) !important; color: var(--orange) !important; transform: translateY(-3px); }
    .cta-ghost:hover    { background: rgba(255,255,255,0.20) !important; transform: translateY(-3px); }

    /* ── Stat boxes ── */
    .stat-box {
      transition: background 0.2s ease, transform 0.2s ease;
    }
    .stat-box:hover {
      background: rgba(255,255,255,0.14) !important;
      transform: translateY(-3px);
    }

    /* ── Footer links ── */
    .abt-footer-link:hover { color: var(--orange) !important; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .story-grid   { grid-template-columns: 1fr !important; gap: 40px !important; }
      .team-grid    { grid-template-columns: repeat(2, 1fr) !important; }
      .val-grid     { grid-template-columns: repeat(2, 1fr) !important; }
      .stats-grid   { grid-template-columns: repeat(2, 1fr) !important; }
      .footer-grid  { grid-template-columns: 1fr 1fr !important; }
      .tl-center    { left: 20px !important; }
      .tl-row       { grid-template-columns: 40px 1fr !important; gap: 16px !important; }
      .tl-left      { display: none !important; }
      .tl-right-col { grid-column: 1 / -1 !important; justify-content: flex-start !important; }
    }
    @media (max-width: 600px) {
      .team-grid   { grid-template-columns: 1fr 1fr !important; }
      .val-grid    { grid-template-columns: 1fr !important; }
      .stats-grid  { grid-template-columns: repeat(2, 1fr) !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .cta-row     { flex-direction: column !important; align-items: stretch !important; }
      .cta-row a   { justify-content: center !important; }
      .hero-cta-row { flex-direction: column !important; align-items: flex-start !important; }
    }
    @media (max-width: 420px) {
      .team-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
    }
  `}</style>
);

/* ── Scroll reveal hook ── */
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".ab-reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Data ── */
const team = [
  { name:"Aryan Mehta",  role:"Co-Founder & CEO",      emoji:"👨‍💼", accent:"#FF7A00", accentLight:"#FFF3E8",
    bio:"Former chef turned tech founder. Built SnapBite after waiting 90 mins for cold biryani." },
  { name:"Priya Sharma", role:"Co-Founder & CTO",      emoji:"👩‍💻", accent:"#2ECC71", accentLight:"#E8FAF0",
    bio:"Ex-Google engineer. Built the routing algo that cut delivery time by 40%." },
  { name:"Kabir Nair",   role:"Head of Operations",    emoji:"🧑‍💼", accent:"#FFC300", accentLight:"#FFF8E1",
    bio:"Logistics expert managing 10,000+ delivery partners across the country." },
  { name:"Zara Khan",    role:"Head of Design",        emoji:"👩‍🎨", accent:"#9B59B6", accentLight:"#F5EEFF",
    bio:"Passionate about every pixel. Redesigned the app that tripled user retention." },
];

const milestones = [
  { year:"2019", title:"Founded",    desc:"Launched in Bangalore with 8 restaurants and 3 delivery partners.", icon:"🌱", color:"#2ECC71" },
  { year:"2020", title:"Grew 400%",  desc:"Supported local restaurants through the pandemic. Demand surged 4×.", icon:"📈", color:"#FF7A00" },
  { year:"2022", title:"1M Orders",  desc:"Hit our first million orders milestone — celebrated with free food for a day!", icon:"🎯", color:"#FFC300" },
  { year:"2024", title:"500+ Cities", desc:"Expanded pan-India with 50,000+ restaurants and 10,000+ delivery partners.", icon:"🗺️", color:"#FF7A00" },
  { year:"2026", title:"What's Next", desc:"AI-powered delivery, drone pilots launching, and global expansion begins.", icon:"🚀", color:"#2ECC71" },
];

const values = [
  { icon:"⚡", title:"Speed First",      desc:"Every second matters when you're hungry. We obsess over delivery time.", bg:"#FFF3E8", border:"#FFD4A8", iconColor:"#FF7A00" },
  { icon:"❤️", title:"Quality Always",    desc:"We partner only with restaurants that cook with passion and heart.", bg:"#FFF0F5", border:"#FFB3CC", iconColor:"#E91E8C" },
  { icon:"🌱", title:"Sustainable",      desc:"Eco-friendly packaging and a carbon-neutral delivery fleet by 2027.", bg:"#E8FAF0", border:"#A8E6C2", iconColor:"#2ECC71" },
  { icon:"🤝", title:"Community",        desc:"Empowering local restaurants and delivery heroes with fair earnings.", bg:"#FFF8E1", border:"#FFE57A", iconColor:"#FFC300" },
  { icon:"🔒", title:"Trust & Safety",    desc:"Every order tracked. Every partner verified. Your safety is non-negotiable.", bg:"#EFF6FF", border:"#BFDBFE", iconColor:"#2563EB" },
  { icon:"🚀", title:"Always Innovating", desc:"Drone deliveries, AI recs — we stay two steps ahead of the curve.", bg:"#F5EEFF", border:"#D8B4FE", iconColor:"#9B59B6" },
];

const stats = [
  { val:"50K+", label:"Restaurant Partners", icon:"🍽️", color:"#FF7A00" },
  { val:"2M+",  label:"Happy Customers",     icon:"😊", color:"#2ECC71" },
  { val:"10K+", label:"Delivery Heroes",     icon:"🛵", color:"#FFC300" },
  { val:"500+", label:"Cities Covered",      icon:"🏙️", color:"#FF7A00" },
];

export default function About() {
  useReveal();

  return (
    <>
      <AboutStyles />
      <div style={{ fontFamily:"'Sora', sans-serif", background:"var(--cream)", width:"100%", overflowX:"hidden", color:"var(--text)" }}>

        {/* ══════════════════════════════════════════
            HERO — Orange gradient, matches Home
        ══════════════════════════════════════════ */}
        <section style={{
          width:"100%", minHeight:"80vh",
          background:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 45%, #FFB347 100%)",
          position:"relative", overflow:"hidden",
          display:"flex", alignItems:"center",
        }}>
          {/* Dot grid */}
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)",
            backgroundSize:"28px 28px", pointerEvents:"none",
          }}/>
          {/* Orbs */}
          <div style={{ position:"absolute", top:-140, right:-140, width:500, height:500, borderRadius:"50%", background:"rgba(255,255,255,0.09)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-100, left:-80, width:360, height:360, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>
          {/* Spinning ring */}
          <div style={{
            position:"absolute", bottom:"10%", right:"8%",
            width:220, height:220, borderRadius:"50%",
            border:"2px dashed rgba(255,255,255,0.22)",
            animation:"spin-slow 28s linear infinite", pointerEvents:"none",
          }}/>

          <div style={{ width:"100%", padding:"100px 5vw 80px", position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"center" }}>

            {/* LEFT copy */}
            <div className="ab-hero-content" style={{ maxWidth:680 }}>
              {/* Breadcrumb */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:24 }}>
                <Link to="/" style={{ color:"rgba(255,255,255,0.60)", fontSize:13, fontWeight:500, textDecoration:"none", transition:"color 0.15s" }}
                  onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.90)"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.60)"}
                >Home</Link>
                <ChevronRight size={13} color="rgba(255,255,255,0.40)"/>
                <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>About Us</span>
              </div>

              {/* Live badge */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
                background:"rgba(255,255,255,0.20)", border:"1.5px solid rgba(255,255,255,0.35)",
                borderRadius:99, padding:"8px 18px", backdropFilter:"blur(8px)",
              }}>
                <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-dot 1.5s ease infinite", flexShrink:0 }}/>
                <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:"0.04em" }}>Founded 2019 · Serving India</span>
              </div>

              <h1 style={{
                fontSize:"clamp(2.6rem, 5vw, 4.8rem)",
                fontWeight:900, lineHeight:1.06,
                letterSpacing:"-0.03em", color:"#fff", marginBottom:20,
              }}>
                We're not just<br/>
                <span style={{
                  background:"linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>
                  delivering food.
                </span>
              </h1>

              <p style={{
                color:"rgba(255,255,255,0.85)", fontSize:"clamp(0.95rem, 1.3vw, 1.12rem)",
                lineHeight:1.8, maxWidth:520, marginBottom:36,
                fontFamily:"'Nunito', sans-serif", fontWeight:500,
              }}>
                We're delivering moments — the joy of a hot meal, the comfort of your favourite dish,
                the magic of a family dinner you didn't have to cook.
              </p>

              <div className="hero-cta-row" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <Link to="/foods" className="cta-primary" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"#fff", color:"var(--orange)",
                  fontWeight:800, fontSize:14, padding:"13px 26px",
                  borderRadius:14, textDecoration:"none",
                  boxShadow:"0 8px 28px rgba(0,0,0,0.15)",
                  transition:"all 0.18s ease", fontFamily:"'Sora',sans-serif",
                }}>
                  Browse Menu <ArrowRight size={14}/>
                </Link>
                <Link to="/contact" className="cta-ghost" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:"rgba(255,255,255,0.16)", border:"1.5px solid rgba(255,255,255,0.40)",
                  color:"#fff", fontWeight:700, fontSize:14, padding:"13px 24px",
                  borderRadius:14, textDecoration:"none",
                  transition:"all 0.18s ease", fontFamily:"'Sora',sans-serif",
                }}>
                  Contact Us
                </Link>
              </div>
            </div>

            {/* RIGHT — floating emoji card */}
            <div className="ab-hero-visual" style={{ position:"relative", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{
                background:"rgba(255,255,255,0.18)", backdropFilter:"blur(20px)",
                border:"1.5px solid rgba(255,255,255,0.32)",
                borderRadius:28, padding:"40px 36px", textAlign:"center",
                boxShadow:"0 24px 64px rgba(0,0,0,0.18)",
                animation:"float2 5s ease-in-out infinite",
                minWidth:200,
              }}>
                <div style={{ fontSize:72, marginBottom:12 }}>🍱</div>
                <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginBottom:4 }}>Hot & Fresh</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", fontFamily:"'Nunito',sans-serif" }}>Always on time</div>
                <div style={{ marginTop:16, display:"flex", gap:8, justifyContent:"center" }}>
                  {["🌮","🍕","🍜"].map((e,i)=>(
                    <div key={i} style={{
                      width:36, height:36, background:"rgba(255,255,255,0.22)",
                      borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
                    }}>{e}</div>
                  ))}
                </div>
              </div>
              {/* Mini badges */}
              <div style={{
                position:"absolute", top:-10, left:-20,
                background:"#fff", borderRadius:14, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:8,
                boxShadow:"0 10px 32px rgba(0,0,0,0.14)",
                animation:"float 4s ease-in-out infinite",
              }}>
                <span style={{fontSize:18}}>⭐</span>
                <div>
                  <div style={{fontSize:11,color:"var(--text-light)",fontWeight:600}}>Rating</div>
                  <div style={{fontSize:13,color:"var(--text)",fontWeight:900}}>4.9 / 5.0</div>
                </div>
              </div>
              <div style={{
                position:"absolute", bottom:-10, right:-16,
                background:"#fff", borderRadius:14, padding:"10px 14px",
                display:"flex", alignItems:"center", gap:8,
                boxShadow:"0 10px 32px rgba(0,0,0,0.14)",
                animation:"float 4s 1.5s ease-in-out infinite",
              }}>
                <span style={{fontSize:18}}>🛵</span>
                <div>
                  <div style={{fontSize:11,color:"var(--text-light)",fontWeight:600}}>Delivery</div>
                  <div style={{fontSize:13,color:"var(--text)",fontWeight:900}}>~28 mins</div>
                </div>
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
            STATS STRIP
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--navy)", padding:"0 5vw" }}>
          <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {stats.map((s,i) => (
              <div key={i} className="stat-box" style={{
                padding:"32px 20px", textAlign:"center", cursor:"default",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                transition:"background 0.2s, transform 0.2s",
              }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
                <div style={{
                  fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:900,
                  color:"#fff", lineHeight:1,
                  animation:"count-up 0.5s ease both",
                }}>{s.val}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.50)", marginTop:6, fontWeight:600, fontFamily:"'Nunito',sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════
            MARQUEE
        ══════════════════════════════════════════ */}
        <div style={{ width:"100%", background:"var(--orange)", overflow:"hidden", padding:"12px 0", userSelect:"none" }}>
          <div style={{ display:"flex", animation:"marquee 22s linear infinite", width:"max-content" }}>
            {Array.from({length:4}).flatMap(()=>["🎉 India's Most Loved Food App","🛵 10,000+ Delivery Heroes","⚡ 28-Minute Average Delivery","🌱 Eco-Friendly Packaging","⭐ 4.9 Stars · 2M+ Reviews","🏙️ Serving 500+ Cities"]).map((t,i)=>(
              <span key={i} style={{
                color:"#fff", fontSize:12, fontWeight:700,
                paddingRight:48, whiteSpace:"nowrap",
                display:"inline-flex", alignItems:"center",
                fontFamily:"'Nunito',sans-serif",
              }}>
                {t}<span style={{marginLeft:48, color:"rgba(255,255,255,0.40)"}}>◆</span>
              </span>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════════
            ORIGIN STORY
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--white)", padding:"80px 5vw" }}>
          <div className="story-grid ab-reveal" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"center" }}>

            {/* LEFT copy */}
            <div>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:6,
                background:"var(--green-light)", border:"1px solid rgba(46,204,113,0.35)",
                borderRadius:99, padding:"6px 16px", marginBottom:24,
              }}>
                <span style={{ fontSize:12, fontWeight:800, color:"var(--green-dark)", letterSpacing:"0.07em", textTransform:"uppercase" }}>Our Origin</span>
              </div>

              <h2 style={{
                fontSize:"clamp(1.8rem, 3vw, 2.6rem)", fontWeight:900,
                color:"var(--text)", lineHeight:1.15, marginBottom:24,
              }}>
                It started with<br/>
                <span style={{ color:"var(--orange)" }}>cold biryani. 🍛</span>
              </h2>

              {[
                "In 2019, our founder Aryan ordered biryani at 7 PM. It arrived at 9:30 PM — cold, soggy, and wrong. That night, instead of complaining, he started building.",
                "He called his college friend Priya, a software engineer at Google, and said: \"Food delivery in India is broken. Let's fix it.\"",
                "Six months later, SnapBite launched in Bangalore with 8 restaurants, 3 delivery partners, and one stubborn vision — food should arrive hot, fast, and exactly as ordered.",
              ].map((para, i) => (
                <p key={i} style={{ color:"var(--text-mid)", fontSize:15, lineHeight:1.85, marginBottom:16, fontFamily:"'Nunito',sans-serif", fontWeight:500 }}>
                  {para}
                </p>
              ))}

              {/* Before / After */}
              <div style={{ display:"flex", gap:16, marginTop:32, flexWrap:"wrap" }}>
                {[
                  { label:"That first wait",    val:"90 min",  bg:"#FFF0F0", border:"#FFCCCC", col:"#EF4444", icon:"😤" },
                  { label:"Our average today",  val:"28 min",  bg:"var(--green-light)", border:"#A8E6C2", col:"var(--green-dark)", icon:"🚀" },
                ].map(s => (
                  <div key={s.label} style={{
                    flex:1, minWidth:140,
                    background:s.bg, border:`2px solid ${s.border}`,
                    borderRadius:18, padding:"20px 24px", textAlign:"center",
                  }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
                    <div style={{ fontSize:26, fontWeight:900, color:s.col, lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:"var(--text-light)", marginTop:5, fontWeight:600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT visual */}
            <div style={{ position:"relative" }}>
              {/* Big card */}
              <div style={{
                background:"linear-gradient(135deg, var(--orange-light), #FFF9F2)",
                border:"2px solid #FFD4A8", borderRadius:28, padding:"44px 36px",
                textAlign:"center", position:"relative", overflow:"hidden",
                boxShadow:"0 16px 48px rgba(255,122,0,0.12)",
              }}>
                {/* Bg circle */}
                <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,122,0,0.07)", pointerEvents:"none" }}/>
                <div style={{ fontSize:80, marginBottom:16, position:"relative", animation:"float2 5s ease-in-out infinite" }}>🍱</div>
                <h3 style={{ fontSize:20, fontWeight:900, color:"var(--text)", marginBottom:4 }}>The Biryani That</h3>
                <p style={{ fontSize:20, fontWeight:900, color:"var(--orange)", marginBottom:28 }}>Changed Everything</p>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { val:"8",     label:"First Restaurants", icon:"🍽️" },
                    { val:"3",     label:"First Partners",    icon:"🛵" },
                    { val:"2019",  label:"Year Founded",      icon:"📅" },
                    { val:"🏙️ BLR", label:"First City",       icon:null  },
                  ].map((s, i) => (
                    <div key={i} style={{
                      background:"#fff", borderRadius:14, padding:"16px 12px",
                      border:"1.5px solid var(--border)", textAlign:"center",
                    }}>
                      {s.icon && !s.val.includes("🏙️") && <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>}
                      <div style={{ fontSize:s.val.length > 4 ? 16 : 22, fontWeight:900, color:"var(--orange)", lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:10, color:"var(--text-light)", marginTop:4, fontWeight:600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Deco blobs */}
              <div style={{ position:"absolute", top:-18, right:-18, width:52, height:52, background:"var(--yellow)", borderRadius:14, opacity:0.30 }}/>
              <div style={{ position:"absolute", bottom:-14, left:-14, width:38, height:38, background:"var(--green)", borderRadius:10, opacity:0.20 }}/>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            VALUES
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--cream)", padding:"80px 5vw" }}>
          <div className="ab-reveal" style={{ textAlign:"center", marginBottom:52 }}>
            <span style={{
              display:"inline-block",
              background:"var(--yellow-light)", border:"1px solid var(--yellow)",
              color:"#92670A", fontSize:11, fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
              padding:"5px 16px", borderRadius:99, marginBottom:14,
            }}>💛 Core Values</span>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:900, color:"var(--text)", margin:"0 0 12px" }}>
              What we stand for
            </h2>
            <p style={{ color:"var(--text-mid)", fontSize:15, maxWidth:440, margin:"0 auto", fontFamily:"'Nunito',sans-serif", lineHeight:1.75 }}>
              Six principles that guide every delivery, every decision, every single day.
            </p>
          </div>

          <div className="val-grid ab-reveal" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {values.map((v, i) => (
              <div key={i} className="val-card" style={{
                background:v.bg, border:`2px solid ${v.border}`,
                borderRadius:22, padding:"30px 26px", cursor:"default",
              }}>
                <div style={{
                  width:52, height:52, background:"rgba(255,255,255,0.80)",
                  border:`1.5px solid ${v.border}`,
                  borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:26, marginBottom:18,
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize:16, fontWeight:800, color:"var(--text)", marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.75, margin:0, fontFamily:"'Nunito',sans-serif" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════
            TIMELINE
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--white)", padding:"80px 5vw" }}>
          <div className="ab-reveal" style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{
              display:"inline-block",
              background:"var(--orange-light)", border:"1px solid #FFD4A8",
              color:"var(--orange-dark)", fontSize:11, fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
              padding:"5px 16px", borderRadius:99, marginBottom:14,
            }}>🗺️ Our Journey</span>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:900, color:"var(--text)" }}>
              How far we've come
            </h2>
          </div>

          {/* Timeline */}
          <div className="ab-reveal" style={{ position:"relative", maxWidth:820, margin:"0 auto" }}>
            {/* Vertical line */}
            <div className="tl-center" style={{
              position:"absolute", left:"50%", top:0, bottom:0,
              width:2, background:"linear-gradient(to bottom, var(--orange), rgba(255,122,0,0.10))",
              transform:"translateX(-50%)", borderRadius:2,
            }}/>

            <div style={{ display:"flex", flexDirection:"column", gap:36 }}>
              {milestones.map((m, i) => (
                <div key={i} className="tl-row" style={{
                  display:"grid",
                  gridTemplateColumns:"1fr 56px 1fr",
                  alignItems:"center", gap:20,
                }}>
                  {/* Left (even) */}
                  <div className="tl-left" style={{ display:"flex", justifyContent:"flex-end" }}>
                    {i % 2 === 0 ? (
                      <div className="tl-card" style={{
                        background:"var(--cream)", border:`2px solid var(--border)`,
                        borderRadius:20, padding:"22px 26px", maxWidth:300,
                        cursor:"default",
                      }}>
                        <div style={{ fontSize:11, fontWeight:800, color:m.color, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:6 }}>{m.year}</div>
                        <div style={{ fontSize:16, fontWeight:800, color:"var(--text)", marginBottom:8 }}>{m.title}</div>
                        <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.7, margin:0, fontFamily:"'Nunito',sans-serif" }}>{m.desc}</p>
                      </div>
                    ) : <div/>}
                  </div>

                  {/* Center dot */}
                  <div style={{
                    width:56, height:56, flexShrink:0,
                    background:"linear-gradient(135deg, var(--orange), var(--orange-mid))",
                    borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:22,
                    boxShadow:`0 0 0 6px var(--orange-light), 0 6px 20px rgba(255,122,0,0.28)`,
                    zIndex:1, position:"relative",
                    justifySelf:"center",
                  }}>
                    {m.icon}
                  </div>

                  {/* Right (odd) */}
                  <div className="tl-right-col" style={{ display:"flex", justifyContent:"flex-start" }}>
                    {i % 2 !== 0 ? (
                      <div className="tl-card" style={{
                        background:"var(--cream)", border:`2px solid var(--border)`,
                        borderRadius:20, padding:"22px 26px", maxWidth:300,
                        cursor:"default",
                      }}>
                        <div style={{ fontSize:11, fontWeight:800, color:m.color, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:6 }}>{m.year}</div>
                        <div style={{ fontSize:16, fontWeight:800, color:"var(--text)", marginBottom:8 }}>{m.title}</div>
                        <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.7, margin:0, fontFamily:"'Nunito',sans-serif" }}>{m.desc}</p>
                      </div>
                    ) : <div/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            TEAM
        ══════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"var(--cream)", padding:"80px 5vw" }}>
          <div className="ab-reveal" style={{ textAlign:"center", marginBottom:52 }}>
            <span style={{
              display:"inline-block",
              background:"var(--green-light)", border:"1px solid rgba(46,204,113,0.35)",
              color:"var(--green-dark)", fontSize:11, fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
              padding:"5px 16px", borderRadius:99, marginBottom:14,
            }}>👥 The Team</span>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:900, color:"var(--text)", margin:"0 0 12px" }}>
              Meet the dreamers
            </h2>
            <p style={{ color:"var(--text-mid)", fontSize:15, maxWidth:400, margin:"0 auto", fontFamily:"'Nunito',sans-serif", lineHeight:1.75 }}>
              The small but mighty team behind every great delivery.
            </p>
          </div>

          <div className="team-grid ab-reveal" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
            {team.map((member, i) => (
              <div key={i} className="team-card" style={{
                background:"var(--white)", border:"2px solid var(--border)",
                borderRadius:22, overflow:"hidden", cursor:"default",
              }}>
                {/* Avatar */}
                <div style={{
                  background:`linear-gradient(135deg, ${member.accentLight}, #fff)`,
                  borderBottom:`2px solid ${member.accentLight}`,
                  padding:"32px 20px", textAlign:"center", position:"relative",
                }}>
                  {/* Deco circle */}
                  <div style={{ position:"absolute", top:-24, right:-24, width:80, height:80, borderRadius:"50%", background:`${member.accent}15`, pointerEvents:"none" }}/>
                  <div style={{
                    width:76, height:76, margin:"0 auto 14px",
                    background:`linear-gradient(135deg, ${member.accentLight}, #fff)`,
                    border:`2px solid ${member.accent}40`,
                    borderRadius:"50%",
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:38,
                    boxShadow:`0 6px 20px ${member.accent}20`,
                  }}>
                    {member.emoji}
                  </div>
                  <div style={{ fontSize:16, fontWeight:800, color:"var(--text)", marginBottom:5 }}>{member.name}</div>
                  <div style={{
                    display:"inline-block",
                    fontSize:11, fontWeight:800,
                    color:member.accent,
                    background:`${member.accent}15`,
                    border:`1px solid ${member.accent}30`,
                    padding:"3px 10px", borderRadius:99,
                  }}>{member.role}</div>
                </div>
                <div style={{ padding:"18px 18px 20px" }}>
                  <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.75, margin:0, fontFamily:"'Nunito',sans-serif" }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════
            CTA BANNER
        ══════════════════════════════════════════ */}
        <section style={{
          width:"100%",
          background:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 50%, #FFB347 100%)",
          padding:"80px 5vw", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:340, height:340, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-60, left:-60, width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>
          <div style={{
            position:"absolute", bottom:"15%", right:"12%",
            width:160, height:160, borderRadius:"50%",
            border:"2px dashed rgba(255,255,255,0.25)",
            animation:"spin-slow 24s linear infinite", pointerEvents:"none",
          }}/>

          <div className="ab-reveal" style={{ position:"relative", zIndex:1, textAlign:"center" }}>
            <div style={{ fontSize:52, marginBottom:18 }}>🤝</div>
            <h2 style={{
              fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:900,
              color:"#fff", lineHeight:1.14, marginBottom:14,
            }}>
              Hungry for more?{" "}
              <span style={{
                background:"linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                So are we.
              </span>
            </h2>
            <p style={{
              color:"rgba(255,255,255,0.82)", fontSize:16, maxWidth:520,
              margin:"0 auto 36px", lineHeight:1.8,
              fontFamily:"'Nunito',sans-serif", fontWeight:500,
            }}>
              Whether you're a restaurant owner, a delivery hero, or a food-obsessed engineer — we'd love to have you on board.
            </p>

            <div className="cta-row" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              {[
                { label:"🍴 Partner with Us", to:"/contact", primary:true  },
                { label:"💼 Join Our Team",   to:"/contact", primary:false },
                { label:"🛵 Deliver with Us", to:"/contact", primary:false },
              ].map(btn => (
                <Link key={btn.label} to={btn.to}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    padding:"13px 26px", borderRadius:14,
                    fontWeight:800, fontSize:14,
                    textDecoration:"none", fontFamily:"'Sora',sans-serif",
                    background: btn.primary ? "#fff" : "rgba(255,255,255,0.18)",
                    color: btn.primary ? "var(--orange)" : "#fff",
                    border: btn.primary ? "none" : "1.5px solid rgba(255,255,255,0.38)",
                    boxShadow: btn.primary ? "0 8px 28px rgba(0,0,0,0.14)" : "none",
                    transition:"transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; if(btn.primary) e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; if(btn.primary) e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.14)"; }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════
            FOOTER — matches Home.jsx exactly
        ══════════════════════════════════════════ */}
        <footer style={{ width:"100%", background:"var(--navy)", padding:"60px 5vw 28px" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:36, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <img src={snapbiteLogo} alt="SnapBite" style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }} />
                <span style={{ fontSize:22, fontWeight:900, color:"var(--orange)", fontFamily:"'Sora',sans-serif" }}>SnapBite</span>
              </div>
              <p style={{ color:"#475569", fontSize:14, lineHeight:1.8, maxWidth:240, fontFamily:"'Nunito',sans-serif" }}>
                Delivering happiness to your doorstep, one fresh meal at a time. 🧡
              </p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["📘","🐦","📸","▶️"].map((icon,i)=>(
                  <div key={i} style={{
                    width:36, height:36, background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.10)",
                    borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, cursor:"pointer", transition:"background 0.15s",
                  }}
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
                      <Link to={l.to} className="abt-footer-link"
                        style={{ color:"#4B5563", fontSize:14, textDecoration:"none", transition:"color 0.15s", fontFamily:"'Nunito',sans-serif" }}
                      >{l.l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid #1E293B", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito',sans-serif" }}>© 2026 SnapBite. All rights reserved.</p>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito',sans-serif" }}>Made with 🧡 for food lovers</p>
          </div>
        </footer>

      </div>
    </>
  );
}