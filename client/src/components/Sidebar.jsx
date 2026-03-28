import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  MessageSquare, LogOut, Home, X, Menu, ChevronRight
} from "lucide-react";

const navLinks = [
  { to:"/admin",         label:"Dashboard",  Icon:LayoutDashboard, exact:true  },
  { to:"/admin/food",   label:"Foods",       Icon:UtensilsCrossed               },
  { to:"/admin/orders",  label:"Orders",      Icon:ShoppingBag                   },
  { to:"/admin/contact", label:"Messages",    Icon:MessageSquare                 },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (to, exact) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const SidebarContent = () => (
    <div style={{
      width: 240, height:"100vh",
      background:"#1A1A2E",
      display:"flex", flexDirection:"column",
      fontFamily:"'Sora', sans-serif",
      position:"relative", overflow:"hidden",
      flexShrink: 0,
    }}>
      {/* Decorative orb */}
      <div style={{ position:"absolute", top:-60, right:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,122,0,0.08)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-40, left:-40, width:140, height:140, borderRadius:"50%", background:"rgba(46,204,113,0.07)", pointerEvents:"none" }}/>

      {/* Logo */}
      <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)", position:"relative", zIndex:1 }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:20 }}>
          <div style={{ width:36, height:36, background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 12px rgba(255,122,0,0.30)", flexShrink:0 }}>🍔</div>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:"#fff", letterSpacing:"-0.01em" }}>MyApp</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.40)", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Admin Panel</div>
          </div>
        </Link>

        {/* Admin user chip */}
        <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.10)", borderRadius:12, padding:"10px 12px" }}>
          <div style={{ width:32, height:32, background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, color:"#fff", flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name || "Admin"}</div>
            <div style={{ fontSize:10, color:"rgba(255,122,0,0.80)", fontWeight:700 }}>🛡️ Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:4, position:"relative", zIndex:1 }}>
        <div style={{ fontSize:9, fontWeight:800, color:"rgba(255,255,255,0.28)", letterSpacing:"0.12em", textTransform:"uppercase", padding:"0 8px", marginBottom:6 }}>
          Navigation
        </div>

        {navLinks.map(({ to, label, Icon, exact }) => {
          const active = isActive(to, exact);
          return (
            <Link key={to} to={to} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:12, textDecoration:"none",
              background: active ? "rgba(255,122,0,0.18)" : "transparent",
              border: `1px solid ${active ? "rgba(255,122,0,0.30)" : "transparent"}`,
              color: active ? "#FF7A00" : "rgba(255,255,255,0.60)",
              fontWeight: active ? 700 : 500,
              fontSize:13,
              transition:"all 0.15s ease",
            }}
              onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.90)"; } }}
              onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.60)"; } }}
            >
              <Icon size={16} style={{ flexShrink:0 }}/>
              {label}
              {active && <ChevronRight size={12} style={{ marginLeft:"auto", flexShrink:0 }}/>}
            </Link>
          );
        })}

        <div style={{ height:1, background:"rgba(255,255,255,0.07)", margin:"10px 0" }}/>

        <Link to="/" style={{
          display:"flex", alignItems:"center", gap:10,
          padding:"10px 12px", borderRadius:12, textDecoration:"none",
          color:"rgba(255,255,255,0.40)", fontWeight:500, fontSize:13,
          transition:"all 0.15s ease",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.70)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.40)"; }}
        >
          <Home size={16} style={{ flexShrink:0 }}/> Back to Site
        </Link>
      </nav>

      {/* Logout */}
      <div style={{ padding:"16px 12px 24px", borderTop:"1px solid rgba(255,255,255,0.07)", position:"relative", zIndex:1 }}>
        <button type="button" onClick={logout} style={{
          width:"100%", padding:"11px",
          background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)",
          color:"#EF4444", borderRadius:12,
          fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7,
          transition:"all 0.15s ease",
        }}
          onMouseEnter={e=>{ e.currentTarget.style.background="#EF4444"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#EF4444"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="rgba(239,68,68,0.12)"; e.currentTarget.style.color="#EF4444"; e.currentTarget.style.borderColor="rgba(239,68,68,0.25)"; }}
        >
          <LogOut size={14}/> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideInLeft { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .sb-hamburger { display:none; }
        @media(max-width:900px) {
          .sb-desktop { display:none !important; }
          .sb-hamburger { display:flex !important; }
        }
      `}</style>

      {/* Desktop */}
      <div className="sb-desktop" style={{ flexShrink:0 }}>
        <SidebarContent/>
      </div>

      {/* Mobile hamburger */}
      <button type="button" className="sb-hamburger" onClick={() => setMobileOpen(true)} style={{
        position:"fixed", top:16, left:16, zIndex:800,
        width:40, height:40, background:"#1A1A2E", border:"none",
        borderRadius:11, cursor:"pointer", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 16px rgba(0,0,0,0.25)",
      }}>
        <Menu size={18} color="#fff"/>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:900, animation:"fadeIn .2s ease", backdropFilter:"blur(4px)" }}/>
          <div style={{ position:"fixed", top:0, left:0, bottom:0, zIndex:910, animation:"slideInLeft .25s ease" }}>
            <div style={{ position:"relative" }}>
              <SidebarContent/>
              <button type="button" onClick={() => setMobileOpen(false)} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.10)", border:"none", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}>
                <X size={16} color="#fff"/>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}