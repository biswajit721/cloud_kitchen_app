import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  ShoppingBag, Users, MessageSquare, UtensilsCrossed,
  TrendingUp, Clock, ArrowRight, Star, Zap, Package,
  ChevronRight, BarChart2, Settings, RefreshCw
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats,   setStats]   = useState({ orders:0, foods:0, contacts:0, revenue:0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ordersRes, foodsRes, contactsRes] = await Promise.allSettled([
          api.get("/orders"),
          api.get("/food"),
          api.get("/contact/get"),
        ]);

        const orders   = ordersRes.status   === "fulfilled" ? (ordersRes.value.data.data   || ordersRes.value.data.orders   || []) : [];
        const foods    = foodsRes.status    === "fulfilled" ? (foodsRes.value.data.data    || []) : [];
        const contacts = contactsRes.status === "fulfilled" ? (contactsRes.value.data.contact || []) : [];

        const revenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

        setStats({
          orders:   orders.length,
          foods:    foods.length,
          contacts: contacts.length,
          revenue,
        });

        // last 5 orders for recent activity
        setRecent(orders.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const statCards = [
    {
      label: "Total Orders",
      value: loading ? "—" : stats.orders,
      icon: ShoppingBag,
      color: "#FF7A00", bg: "#FFF3E8", border: "#FFD4A8",
      sub: "All time",
      to: "/admin/orders",
    },
    {
      label: "Menu Items",
      value: loading ? "—" : stats.foods,
      icon: UtensilsCrossed,
      color: "#2ECC71", bg: "#E8FAF0", border: "#A8E6C2",
      sub: "Active dishes",
      to: "/admin/foods",
    },
    {
      label: "Messages",
      value: loading ? "—" : stats.contacts,
      icon: MessageSquare,
      color: "#FFC300", bg: "#FFF8E1", border: "#FFE57A",
      sub: "Unread inbox",
      to: "/admin/contact",
    },
    {
      label: "Revenue",
      value: loading ? "—" : `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "#9B59B6", bg: "#F5EEFF", border: "#D8B4FE",
      sub: "Total earned",
      to: "/admin/orders",
    },
  ];

  const quickLinks = [
    { icon:"🍔", label:"Manage Foods",     sub:"Add, edit, delete menu items",   to:"/admin/food",   color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8" },
    { icon:"📦", label:"View Orders",      sub:"Track & update order statuses",   to:"/admin/orders",  color:"#2ECC71", bg:"#E8FAF0", border:"#A8E6C2" },
    { icon:"📩", label:"Contact Messages", sub:"Reply to user inquiries",         to:"/admin/contact", color:"#FFC300", bg:"#FFF8E1", border:"#FFE57A" },
  ];

  const statusMap = {
    pending:          { label:"Pending",    color:"#B8860B", bg:"#FFF8E1" },
    confirmed:        { label:"Confirmed",  color:"#2563EB", bg:"#EFF6FF" },
    preparing:        { label:"Preparing",  color:"#E06A00", bg:"#FFF3E8" },
    out_for_delivery: { label:"On the Way", color:"#7C3AED", bg:"#F5EEFF" },
    delivered:        { label:"Delivered",  color:"#27AE60", bg:"#E8FAF0" },
    cancelled:        { label:"Cancelled",  color:"#DC2626", bg:"#FEF2F2" },
  };
  const getStatus = s => statusMap[s?.toLowerCase()] || statusMap["pending"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #FF7A00; border-radius: 99px; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes pulse-d  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.55;transform:scale(1.45)} }
        @keyframes spin-s   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .adm-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #FFF9F2;
          padding: 32px 28px 64px;
          color: #2C2C2C;
        }

        .adm-stat-card {
          background: #fff;
          border-radius: 20px;
          border: 2px solid #F0ECE6;
          padding: 22px 20px;
          cursor: default;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
          animation: fadeUp .4s ease both;
          text-decoration: none;
          display: block;
        }
        .adm-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(255,122,0,0.10);
        }

        .adm-quick-link {
          display: flex; align-items: center; gap: 14px;
          background: #fff; border: 2px solid #F0ECE6;
          border-radius: 18px; padding: 18px 16px;
          text-decoration: none; color: inherit;
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s;
          animation: fadeUp .4s ease both;
        }
        .adm-quick-link:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(255,122,0,0.10);
          border-color: #FFD4A8;
        }

        .adm-skel {
          background: linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }

        /* Responsive */
        @media(max-width:900px) {
          .adm-page { padding: 24px 16px 48px; }
          .adm-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .adm-quick-grid { grid-template-columns: 1fr !important; }
          .adm-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media(max-width:480px) {
          .adm-stats-grid { grid-template-columns: 1fr 1fr !important; }
          .adm-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
        }
      `}</style>

      <div className="adm-page">

        {/* ── Header ── */}
        <div className="adm-header-row" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            {/* Admin avatar */}
            <div style={{
              width:52, height:52,
              background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",
              borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, fontWeight:900, color:"#fff",
              boxShadow:"0 6px 20px rgba(255,122,0,0.28)", flexShrink:0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                <h1 style={{ fontSize:"clamp(1.3rem,2.5vw,1.7rem)", fontWeight:900, color:"#2C2C2C", margin:0, letterSpacing:"-0.02em" }}>
                  Admin Dashboard
                </h1>
                <span style={{ fontSize:11, fontWeight:800, background:"#FFF3E8", color:"#FF7A00", border:"1px solid #FFD4A8", borderRadius:99, padding:"3px 10px" }}>
                  🛡️ Admin
                </span>
              </div>
              <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0 }}>
                Welcome back, <strong style={{color:"#2C2C2C"}}>{user?.name}</strong> — here's your overview
              </p>
            </div>
          </div>

          {/* Live badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#E8FAF0", border:"1px solid #A8E6C2", borderRadius:12, padding:"9px 16px" }}>
            <span style={{ width:7, height:7, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-d 1.5s ease infinite" }}/>
            <span style={{ fontSize:12, fontWeight:700, color:"#27AE60", fontFamily:"'Nunito',sans-serif" }}>System Online</span>
          </div>
        </div>


        {/* ── Stat Cards ── */}
        <div className="adm-stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {statCards.map((s, i) => (
            <Link key={i} to={s.to} className="adm-stat-card" style={{ animationDelay:`${i*0.06}s` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{
                  width:44, height:44,
                  background:s.bg, border:`1.5px solid ${s.border}`,
                  borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <s.icon size={20} color={s.color}/>
                </div>
                <ChevronRight size={15} color="#C4BAB1"/>
              </div>
              <div>
                {loading
                  ? <div className="adm-skel" style={{ height:28, width:"60%", marginBottom:6 }}/>
                  : <div style={{ fontSize:"clamp(1.4rem,2.5vw,1.9rem)", fontWeight:900, color:"#2C2C2C", lineHeight:1, marginBottom:5 }}>{s.value}</div>
                }
                <div style={{ fontSize:12, fontWeight:700, color:"#5C5C6E", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{s.label}</div>
                <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{s.sub}</div>
              </div>
            </Link>
          ))}
        </div>


        {/* ── Bottom grid — Quick Links + Recent Orders ── */}
        <div className="adm-bottom-grid" style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:20 }}>

          {/* ── Quick Actions ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Section header */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <div style={{ width:32, height:32, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap size={15} color="#FF7A00"/>
              </div>
              <h2 style={{ fontSize:15, fontWeight:900, color:"#2C2C2C", margin:0 }}>Quick Actions</h2>
            </div>

            <div className="adm-quick-grid" style={{ display:"grid", gridTemplateColumns:"1fr", gap:12 }}>
              {quickLinks.map((link, i) => (
                <Link key={i} to={link.to} className="adm-quick-link" style={{ animationDelay:`${0.2 + i*0.06}s` }}>
                  <div style={{ width:42, height:42, background:link.bg, border:`2px solid ${link.border}`, borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    {link.icon}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:"#2C2C2C" }}>{link.label}</div>
                    <div style={{ fontSize:11.5, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>{link.sub}</div>
                  </div>
                  <ChevronRight size={15} color="#C4BAB1" style={{flexShrink:0}}/>
                </Link>
              ))}
            </div>

            {/* Tips card */}
            <div style={{
              background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 100%)",
              borderRadius:20, padding:"20px 18px", position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", top:-24, right:-24, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.12)", pointerEvents:"none" }}/>
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:22, marginBottom:8 }}>💡</div>
                <h3 style={{ fontSize:14, fontWeight:900, color:"#fff", marginBottom:6 }}>Pro Tip</h3>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.82)", fontFamily:"'Nunito',sans-serif", lineHeight:1.6, margin:"0 0 14px" }}>
                  Mark popular items as "Trending" to feature them on the Home page hero section.
                </p>
                <Link to="/admin/food" style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.22)", color:"#fff", textDecoration:"none", borderRadius:9, padding:"7px 14px", fontSize:12, fontWeight:800 }}>
                  Manage Foods <ArrowRight size={12}/>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Recent Orders ── */}
          <div style={{ background:"#fff", border:"2px solid #F0ECE6", borderRadius:22, overflow:"hidden", animation:"fadeUp .4s .15s ease both" }}>
            {/* Header */}
            <div style={{ padding:"18px 22px", borderBottom:"1px solid #F0ECE6", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Package size={16} color="#FF7A00"/>
                </div>
                <div>
                  <h2 style={{ fontSize:15, fontWeight:900, color:"#2C2C2C", margin:0 }}>Recent Orders</h2>
                  <p style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0 }}>Last 5 orders placed</p>
                </div>
              </div>
              <Link to="/admin/orders" style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:700, color:"#FF7A00", textDecoration:"none" }}>
                View all <ChevronRight size={13}/>
              </Link>
            </div>

            {/* Body */}
            <div style={{ padding:"8px 0" }}>
              {loading && (
                <div style={{ padding:"16px 22px", display:"flex", flexDirection:"column", gap:14 }}>
                  {[1,2,3].map(i=>(
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div className="adm-skel" style={{ width:36, height:36, borderRadius:10, flexShrink:0 }}/>
                      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
                        <div className="adm-skel" style={{ height:12, width:"55%" }}/>
                        <div className="adm-skel" style={{ height:10, width:"35%" }}/>
                      </div>
                      <div className="adm-skel" style={{ height:22, width:70, borderRadius:99 }}/>
                    </div>
                  ))}
                </div>
              )}

              {!loading && recent.length === 0 && (
                <div style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>📭</div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>No orders yet</p>
                </div>
              )}

              {!loading && recent.map((order, i) => {
                const st = getStatus(order.orderStatus);
                return (
                  <div key={order._id} style={{
                    display:"flex", alignItems:"center", gap:14,
                    padding:"13px 22px",
                    borderBottom: i < recent.length - 1 ? "1px solid #F0ECE6" : "none",
                    transition:"background .15s",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF9F2"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    {/* Icon */}
                    <div style={{ width:38, height:38, background:st.bg, borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                      {order.orderStatus?.toLowerCase() === "delivered" ? "🎉"
                        : order.orderStatus?.toLowerCase() === "cancelled" ? "❌"
                        : order.orderStatus?.toLowerCase() === "out_for_delivery" ? "🛵"
                        : order.orderStatus?.toLowerCase() === "preparing" ? "👨‍🍳"
                        : order.orderStatus?.toLowerCase() === "confirmed" ? "✅" : "⏳"}
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#2C2C2C", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        #{order._id?.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                        <Clock size={9}/>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : "—"}
                        {order.shippingAddress?.city && (
                          <><span>·</span> {order.shippingAddress.city}</>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:14, fontWeight:900, color:"#FF7A00", marginBottom:4 }}>₹{order.totalAmount}</div>
                      <span style={{ fontSize:10.5, fontWeight:800, color:st.color, background:st.bg, borderRadius:99, padding:"2px 8px" }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}