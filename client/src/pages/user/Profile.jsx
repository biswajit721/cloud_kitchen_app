import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  User, Mail, Shield, ShoppingBag, LogOut,
  ChevronRight, Edit3, MapPin, Phone, Star,
  Clock, Heart, Gift
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div style={{
        fontFamily:"'Sora',sans-serif", minHeight:"100vh",
        background:"#FFF9F2", display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
          <p style={{ fontSize:16, color:"#9CA3AF", marginBottom:20 }}>Please log in to view your profile</p>
          <Link to="/login" style={{ background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:11, padding:"11px 28px", fontWeight:800, fontSize:14 }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const isAdmin = user.role === "admin";

  const quickLinks = isAdmin
    ? [
        { icon:"⚙️", label:"Admin Panel",   sub:"Manage orders & foods",   to:"/admin",     color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8" },
        { icon:"📩", label:"Contact Msgs",  sub:"View user messages",      to:"/admin/contact", color:"#2ECC71", bg:"#E8FAF0", border:"#A8E6C2" },
      ]
    : [
        { icon:"📦", label:"My Orders",     sub:"Track & view past orders", to:"/my-orders", color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8" },
        { icon:"🍔", label:"Browse Menu",   sub:"Discover new dishes",      to:"/foods",     color:"#2ECC71", bg:"#E8FAF0", border:"#A8E6C2" },
        { icon:"📞", label:"Contact Us",    sub:"Help & support",           to:"/contact",   color:"#FFC300", bg:"#FFF8E1", border:"#FFE57A" },
      ];

  const stats = isAdmin
    ? [
        { icon:"🍽️", val:"Admin",    label:"Role"           },
        { icon:"🏙️", val:"500+",    label:"Cities Served"  },
        { icon:"👥", val:"2M+",     label:"Users"          },
      ]
    : [
        { icon:"📦", val:"Member",   label:"Status"         },
        { icon:"⭐", val:"4.9",     label:"App Rating"     },
        { icon:"🛵", val:"~28min",  label:"Avg Delivery"   },
      ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #FF7A00; border-radius: 99px; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes spin-s  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.45);opacity:.55} }
        @keyframes shimmer { 0%{background-position:-400% center} 100%{background-position:400% center} }

        .pf-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #FFF9F2;
          color: #2C2C2C;
          padding-top: 64px;
        }

        /* hero */
        .pf-hero {
          width: 100%;
          background: linear-gradient(155deg, #FF7A00 0%, #FF9A3C 50%, #FFB347 100%);
          padding: 52px 5vw 80px;
          position: relative;
          overflow: hidden;
        }
        .pf-hero-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0);
          background-size: 26px 26px; pointer-events: none;
        }
        .pf-hero-orb1 { position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.09);pointer-events:none; }
        .pf-hero-orb2 { position:absolute;bottom:-60px;left:-60px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,0.07);pointer-events:none; }
        .pf-ring      { position:absolute;bottom:14%;right:5%;width:140px;height:140px;border-radius:50%;border:2px dashed rgba(255,255,255,0.22);animation:spin-s 28s linear infinite;pointer-events:none; }

        /* avatar */
        .pf-avatar {
          width: 88px; height: 88px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 3px solid rgba(255,255,255,0.45);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 900; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
          backdrop-filter: blur(8px);
        }

        /* stat chip */
        .pf-stat {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.22);
          border-radius: 14px; padding: 12px 18px; backdrop-filter: blur(8px);
          flex: 1; min-width: 80px;
        }

        /* main card */
        .pf-card {
          background: #fff; border-radius: 22px;
          border: 2px solid #F0ECE6;
          box-shadow: 0 4px 28px rgba(0,0,0,0.06);
          animation: fadeUp .5s ease both;
          overflow: hidden;
        }

        /* info row */
        .pf-info-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 22px;
          border-bottom: 1px solid #F0ECE6;
          transition: background .15s;
        }
        .pf-info-row:last-child { border-bottom: none; }
        .pf-info-row:hover { background: #FFF9F2; }

        /* quick link */
        .pf-link-card {
          display: flex; align-items: center; gap: 13px;
          padding: 16px 18px;
          background: #fff; border-radius: 16px;
          border: 2px solid #F0ECE6;
          text-decoration: none; color: inherit;
          transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s, border-color .2s;
        }
        .pf-link-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(255,122,0,0.10);
          border-color: #FFD4A8;
        }

        /* logout btn */
        .pf-logout {
          width: 100%; padding: 13px; background: #FEF2F2;
          border: 1.5px solid #FECACA; color: #EF4444;
          border-radius: 13px; font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .18s ease;
        }
        .pf-logout:hover { background: #EF4444; color: #fff; border-color: #EF4444; }

        /* responsive */
        @media (max-width: 700px) {
          .pf-grid { grid-template-columns: 1fr !important; }
          .pf-hero  { padding: 40px 5vw 70px !important; }
          .pf-hero-inner { flex-direction: column !important; align-items: flex-start !important; }
          .pf-stats-row { flex-wrap: wrap !important; }
        }
        @media (max-width: 480px) {
          .pf-content { padding: 0 16px 48px !important; }
        }
      `}</style>

      <div className="pf-page">

        {/* ══════════ HERO ══════════ */}
        <div className="pf-hero">
          <div className="pf-hero-dots"/>
          <div className="pf-hero-orb1"/> <div className="pf-hero-orb2"/>
          <div className="pf-ring"/>

          {/* Breadcrumb */}
          <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:6, marginBottom:24 }}>
            <Link to="/" style={{ color:"rgba(255,255,255,0.60)", fontSize:13, fontWeight:500, textDecoration:"none" }}
              onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.90)"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.60)"}
            >Home</Link>
            <ChevronRight size={13} color="rgba(255,255,255,0.40)"/>
            <span style={{ color:"#fff", fontSize:13, fontWeight:700 }}>My Profile</span>
          </div>

          {/* User info row */}
          <div className="pf-hero-inner" style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
            <div className="pf-avatar">{initials}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 }}>
                <h1 style={{ fontSize:"clamp(1.4rem,3vw,1.9rem)", fontWeight:900, color:"#fff", letterSpacing:"-0.02em" }}>
                  {user.name}
                </h1>
                {/* Role badge */}
                <span style={{
                  fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em",
                  padding:"4px 12px", borderRadius:99,
                  background: isAdmin ? "rgba(239,68,68,0.22)" : "rgba(46,204,113,0.22)",
                  border: `1px solid ${isAdmin ? "rgba(239,68,68,0.40)" : "rgba(46,204,113,0.40)"}`,
                  color:"#fff",
                }}>
                  {isAdmin ? "🛡️ Admin" : "✅ Member"}
                </span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Mail size={13} color="rgba(255,255,255,0.65)"/>
                <span style={{ fontSize:13.5, color:"rgba(255,255,255,0.80)", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="pf-stats-row" style={{ position:"relative", zIndex:1, display:"flex", gap:9 }}>
            {stats.map((s, i) => (
              <div key={i} className="pf-stat">
                <span style={{ fontSize:16 }}>{s.icon}</span>
                <span style={{ fontSize:15, fontWeight:900, color:"#fff", lineHeight:1 }}>{s.val}</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.58)", fontWeight:600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Wave */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", display:"block" }}>
              <path d="M0,56 C360,0 1080,56 1440,14 L1440,56 Z" fill="#FFF9F2"/>
            </svg>
          </div>
        </div>


        {/* ══════════ CONTENT ══════════ */}
        <div className="pf-content" style={{ maxWidth:860, margin:"0 auto", padding:"0 5vw 64px" }}>

          {/* Pull up over wave */}
          <div style={{ marginTop:-28, position:"relative", zIndex:1 }}>

            <div className="pf-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>

              {/* ── Account Details ── */}
              <div style={{ gridColumn:"1 / -1" }}>
                <div className="pf-card">
                  {/* Card header */}
                  <div style={{ padding:"18px 22px", borderBottom:"1.5px solid #F0ECE6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <User size={17} color="#FF7A00"/>
                      </div>
                      <div>
                        <h2 style={{ fontSize:15, fontWeight:900, color:"#2C2C2C", margin:0 }}>Account Details</h2>
                        <p style={{ fontSize:11.5, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0 }}>Your personal information</p>
                      </div>
                    </div>
                    <button style={{ display:"flex", alignItems:"center", gap:5, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:9, padding:"7px 13px", fontSize:12, fontWeight:700, color:"#FF7A00", cursor:"pointer", fontFamily:"'Sora',sans-serif" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="#FF7A00";e.currentTarget.style.color="#fff";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="#FFF3E8";e.currentTarget.style.color="#FF7A00";}}
                    >
                      <Edit3 size={12}/> Edit
                    </button>
                  </div>

                  {/* Info rows */}
                  {[
                    { icon:<User size={15} color="#FF7A00"/>,   label:"Full Name",     val:user.name,  bg:"#FFF3E8", border:"#FFD4A8" },
                    { icon:<Mail size={15} color="#2ECC71"/>,   label:"Email Address", val:user.email, bg:"#E8FAF0", border:"#A8E6C2" },
                    { icon:<Shield size={15} color="#FFC300"/>, label:"Account Role",  val:null,       bg:"#FFF8E1", border:"#FFE57A",
                      custom: (
                        <span style={{
                          fontSize:12, fontWeight:800, padding:"4px 12px", borderRadius:99,
                          background: isAdmin ? "#FEF2F2" : "#E8FAF0",
                          border: `1px solid ${isAdmin ? "#FECACA" : "#A8E6C2"}`,
                          color: isAdmin ? "#EF4444" : "#27AE60",
                          textTransform:"capitalize",
                        }}>
                          {isAdmin ? "🛡️ Administrator" : "✅ " + user.role}
                        </span>
                      )
                    },
                    { icon:<MapPin size={15} color="#9B59B6"/>, label:"Location",      val:"India",   bg:"#F5EEFF", border:"#D8B4FE" },
                  ].map((row, i) => (
                    <div key={i} className="pf-info-row">
                      <div style={{ width:34, height:34, background:row.bg, border:`1.5px solid ${row.border}`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {row.icon}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10.5, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{row.label}</div>
                        {row.custom
                          ? row.custom
                          : <div style={{ fontSize:14, fontWeight:700, color:"#2C2C2C", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.val}</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Quick Links ── */}
              <div style={{ gridColumn:"1 / -1" }}>
                <h3 style={{ fontSize:14, fontWeight:800, color:"#5C5C6E", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>
                  Quick Access
                </h3>
                <div className="pf-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
                  {quickLinks.map((link, i) => (
                    <Link key={i} to={link.to} className="pf-link-card">
                      <div style={{ width:42, height:42, background:link.bg, border:`2px solid ${link.border}`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                        {link.icon}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13.5, fontWeight:800, color:"#2C2C2C" }}>{link.label}</div>
                        <div style={{ fontSize:11.5, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{link.sub}</div>
                      </div>
                      <ChevronRight size={15} color="#C4BAB1"/>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Perks / Offers ── */}
              {!isAdmin && (
                <div style={{ gridColumn:"1 / -1" }}>
                  <div style={{ background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%)", borderRadius:20, padding:"24px 24px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.11) 1px,transparent 0)", backgroundSize:"22px 22px", pointerEvents:"none" }}/>
                    <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.09)", pointerEvents:"none" }}/>
                    <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>🎉 Member Offer</div>
                        <h3 style={{ fontSize:"clamp(1.1rem,2vw,1.5rem)", fontWeight:900, color:"#fff", marginBottom:6 }}>
                          50% off your next order
                        </h3>
                        <p style={{ fontSize:13, color:"rgba(255,255,255,0.78)", fontFamily:"'Nunito',sans-serif", marginBottom:0 }}>
                          Use code <strong style={{ color:"#fff", background:"rgba(255,255,255,0.22)", padding:"2px 8px", borderRadius:6 }}>SAVE50</strong> at checkout
                        </p>
                      </div>
                      <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#fff", color:"#FF7A00", textDecoration:"none", borderRadius:12, padding:"11px 22px", fontWeight:800, fontSize:13, boxShadow:"0 6px 18px rgba(0,0,0,0.14)", flexShrink:0 }}>
                        Order Now →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Logout ── */}
              <div style={{ gridColumn:"1 / -1" }}>
                <button className="pf-logout" onClick={logout}>
                  <LogOut size={16}/> Sign Out of Account
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}