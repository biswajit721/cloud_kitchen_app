import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  ShoppingBag, MapPin, CreditCard, Clock,
  ChevronDown, ChevronUp, ArrowRight, Package,
  RefreshCw
} from "lucide-react";

/* ─── Status config ─── */
const statusMap = {
  pending:          { label:"Pending",    color:"#B8860B", bg:"#FFF8E1", border:"#FFE57A", dot:"#FFC300", icon:"⏳" },
  confirmed:        { label:"Confirmed",  color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE", dot:"#2563EB", icon:"✅" },
  preparing:        { label:"Preparing",  color:"#E06A00", bg:"#FFF3E8", border:"#FFD4A8", dot:"#FF7A00", icon:"👨‍🍳" },
  out_for_delivery: { label:"On the Way", color:"#7C3AED", bg:"#F5EEFF", border:"#D8B4FE", dot:"#9B59B6", icon:"🛵" },
  delivered:        { label:"Delivered",  color:"#27AE60", bg:"#E8FAF0", border:"#A8E6C2", dot:"#2ECC71", icon:"🎉" },
  cancelled:        { label:"Cancelled",  color:"#DC2626", bg:"#FEF2F2", border:"#FECACA", dot:"#EF4444", icon:"❌" },
};
function getStatus(s) { return statusMap[s?.toLowerCase()] || statusMap["pending"]; }

const STEPS = ["confirmed", "preparing", "out_for_delivery", "delivered"];
function stepIndex(status) { return STEPS.indexOf(status?.toLowerCase()); }

export default function MyOrders() {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState({});
  const [error,    setError]    = useState("");

  const fetchOrders = async () => {
    if (!user?.token) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const res  = await api.get("orders/my-orders");
      const raw  = res.data.data;
      const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
      setOrders(data.filter(Boolean));
    } catch (e) {
      console.error(e);
      setError("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [user?.token]);

  const toggle     = id => setExpanded(e => ({ ...e, [id]: !e[id] }));
  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const delivered  = orders.filter(o => o.orderStatus?.toLowerCase() === "delivered").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FFF9F2; }
        ::-webkit-scrollbar-thumb { background: #FF7A00; border-radius: 99px; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes spin-s   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-d  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.55} }
        @keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

        /* page */
        .mo-page {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #FFF9F2;
          color: #2C2C2C;
          padding-top: 64px;          /* ← clears fixed navbar */
        }

        /* hero */
        .mo-hero {
          background: linear-gradient(135deg, #FF7A00 0%, #FF9A3C 50%, #FFB347 100%);
          padding: 52px 5vw 72px;
          position: relative;
          overflow: hidden;
        }
        .mo-hero-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0);
          background-size: 26px 26px; pointer-events: none;
        }
        .mo-orb1 { position:absolute;top:-90px;right:-90px;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,0.09);pointer-events:none; }
        .mo-orb2 { position:absolute;bottom:-60px;left:-60px;width:250px;height:250px;border-radius:50%;background:rgba(255,255,255,0.07);pointer-events:none; }
        .mo-ring { position:absolute;bottom:12%;right:5%;width:140px;height:140px;border-radius:50%;border:2px dashed rgba(255,255,255,0.22);animation:spin-s 28s linear infinite;pointer-events:none; }

        /* stat chips in hero */
        .mo-stat {
          padding-right: 24px;
          margin-right: 24px;
          border-right: 1px solid rgba(255,255,255,0.22);
        }
        .mo-stat:last-child { border-right: none; padding-right: 0; margin-right: 0; }

        /* order card */
        .mo-card {
          background: #fff;
          border: 2px solid #F0ECE6;
          border-radius: 22px;
          overflow: hidden;
          transition: border-color .2s ease, box-shadow .2s ease;
          animation: fadeUp .4s ease both;
        }
        .mo-card:hover { border-color: #FFD4A8; box-shadow: 0 10px 32px rgba(255,122,0,.09); }

        /* expand btn */
        .mo-expand {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; gap: 5px;
          font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700;
          color: #FF7A00; padding: 6px 11px; border-radius: 9px;
          transition: background .15s ease;
        }
        .mo-expand:hover { background: #FFF3E8; }

        /* skeleton */
        .mo-skel {
          background: linear-gradient(90deg, #f5f0ea 25%, #ede8e2 50%, #f5f0ea 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
        }

        /* stepper */
        .mo-step-done  { background: var(--c, #FF7A00) !important; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
        .mo-step-empty { background: #F0ECE6 !important; color: #9CA3AF !important; }

        /* item row */
        .mo-item {
          display: flex; align-items: center; gap: 13px;
          padding: 12px 14px;
          background: #fff; border-radius: 14px;
          border: 1.5px solid #F0ECE6;
          transition: border-color .15s;
        }
        .mo-item:hover { border-color: #FFD4A8; }

        /* responsive */
        @media (max-width: 600px) {
          .mo-card-top  { flex-direction: column !important; }
          .mo-card-right { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; }
          .mo-meta-row  { flex-direction: column !important; gap: 6px !important; }
          .mo-stats-row { flex-wrap: wrap !important; gap: 12px !important; }
          .mo-stat      { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
          .mo-ship-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="mo-page">

        {/* ══════════ HERO ══════════ */}
        <section className="mo-hero">
          <div className="mo-hero-dots"/>
          <div className="mo-orb1"/> <div className="mo-orb2"/> <div className="mo-ring"/>

          <div style={{ position:"relative", zIndex:1 }}>
            {/* Live badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:18, background:"rgba(255,255,255,0.20)", border:"1.5px solid rgba(255,255,255,0.35)", borderRadius:99, padding:"7px 16px", backdropFilter:"blur(8px)" }}>
              <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-d 1.5s ease infinite" }}/>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>Real-time order tracking</span>
            </div>

            <h1 style={{ fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:10 }}>
              My Orders 📦
            </h1>
            <p style={{ color:"rgba(255,255,255,0.82)", fontSize:14, fontFamily:"'Nunito',sans-serif", fontWeight:500, maxWidth:440, lineHeight:1.75, marginBottom: orders.length > 0 ? 24 : 0 }}>
              Track all your orders, view details, and reorder your favourites.
            </p>

            {/* Stats row — only when there are orders */}
            {!loading && orders.length > 0 && (
              <div className="mo-stats-row" style={{ display:"flex", gap:0, flexWrap:"wrap" }}>
                {[
                  { val: orders.length,         label:"Total Orders"  },
                  { val: `₹${totalSpent}`,       label:"Total Spent"   },
                  { val: delivered,              label:"Delivered"     },
                  { val: orders.length - delivered, label:"In Progress" },
                ].map((s, i) => (
                  <div key={i} className="mo-stat">
                    <div style={{ fontSize:"clamp(1.1rem,2vw,1.4rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:3, fontWeight:600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wave divider */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", display:"block" }}>
              <path d="M0,52 C360,0 1080,52 1440,13 L1440,52 Z" fill="#FFF9F2"/>
            </svg>
          </div>
        </section>


        {/* ══════════ CONTENT ══════════ */}
        <section style={{ padding:"32px 5vw 72px", maxWidth:920, margin:"0 auto" }}>

          {/* ── Loading skeletons ── */}
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background:"#fff", border:"2px solid #F0ECE6", borderRadius:22, padding:"24px 22px", display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div className="mo-skel" style={{ height:14, width:"35%" }}/>
                    <div className="mo-skel" style={{ height:24, width:"16%", borderRadius:99 }}/>
                  </div>
                  <div className="mo-skel" style={{ height:11, width:"55%" }}/>
                  <div className="mo-skel" style={{ height:11, width:"42%" }}/>
                  <div className="mo-skel" style={{ height:36, width:"100%", borderRadius:12 }}/>
                </div>
              ))}
            </div>
          )}

          {/* ── Error state ── */}
          {!loading && error && (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:24, border:"2px solid #FECACA" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>⚠️</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>Something went wrong</h3>
              <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:20, fontFamily:"'Nunito',sans-serif" }}>{error}</p>
              <button onClick={fetchOrders} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", border:"none", borderRadius:12, padding:"11px 26px", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Sora',sans-serif", boxShadow:"0 4px 14px rgba(255,122,0,.28)" }}>
                <RefreshCw size={14}/> Try Again
              </button>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff", borderRadius:24, border:"2px solid #F0ECE6" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>📦</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>No orders yet</h3>
              <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24, fontFamily:"'Nunito',sans-serif", lineHeight:1.7 }}>
                You haven't placed any orders yet.<br/>Browse our menu and get your first meal delivered!
              </p>
              <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:13, padding:"13px 30px", fontWeight:800, fontSize:14, boxShadow:"0 6px 20px rgba(255,122,0,.30)" }}>
                Browse Menu <ArrowRight size={15}/>
              </Link>
            </div>
          )}

          {/* ── Order cards ── */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {orders.map((order, idx) => {
                const st          = getStatus(order.orderStatus);
                const isOpen      = !!expanded[order._id];
                const si          = stepIndex(order.orderStatus);
                const isDelivered = order.orderStatus?.toLowerCase() === "delivered";
                const isCancelled = order.orderStatus?.toLowerCase() === "cancelled";
                const showStepper = !["pending", "cancelled"].includes(order.orderStatus?.toLowerCase());

                return (
                  <div key={order._id} className="mo-card" style={{ animationDelay:`${Math.min(idx * 0.06, 0.3)}s` }}>

                    {/* ── Card top ── */}
                    <div className="mo-card-top" style={{ padding:"20px 22px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>

                      {/* Left: icon + id + meta */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                          {/* Status icon */}
                          <div style={{ width:40, height:40, background:st.bg, border:`2px solid ${st.border}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                            {st.icon}
                          </div>
                          <div>
                            <div style={{ fontSize:11.5, fontWeight:800, color:"#9CA3AF", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:4 }}>
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </div>
                            {/* Status pill */}
                            <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:st.dot, display:"block", flexShrink:0, animation: !isDelivered && !isCancelled ? "pulse-d 1.5s ease infinite" : "none" }}/>
                              <span style={{ fontSize:12.5, fontWeight:800, color:st.color, background:st.bg, border:`1.5px solid ${st.border}`, borderRadius:99, padding:"3px 11px" }}>
                                {st.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Meta row */}
                        <div className="mo-meta-row" style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                          {order.shippingAddress?.city && (
                            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                              <MapPin size={11} color="#FF7A00"/>
                              {order.shippingAddress.fullName}, {order.shippingAddress.city}
                            </span>
                          )}
                          <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                            <CreditCard size={11} color="#2ECC71"/>
                            {order.paymentStatus || "Pending"}
                          </span>
                          {order.createdAt && (
                            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                              <Clock size={11} color="#9CA3AF"/>
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: total + expand */}
                      <div className="mo-card-right" style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                        <span style={{ fontSize:22, fontWeight:900, color:"#FF7A00" }}>₹{order.totalAmount}</span>
                        <button className="mo-expand" onClick={() => toggle(order._id)}>
                          <Package size={12}/>
                          {isOpen ? "Hide" : "View"} Details
                          {isOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                        </button>
                      </div>
                    </div>

                    {/* ── Progress stepper ── */}
                    {showStepper && (
                      <div style={{ padding:"0 22px 18px" }}>
                        <div style={{ display:"flex", alignItems:"center" }}>
                          {STEPS.map((step, i) => {
                            const done = i <= si;
                            const sc   = getStatus(step);
                            return (
                              <React.Fragment key={step}>
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:"0 0 auto" }}>
                                  <div style={{
                                    width:30, height:30, borderRadius:"50%",
                                    background: done ? sc.dot : "#F0ECE6",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    fontSize:13, fontWeight:900,
                                    color: done ? "#fff" : "#9CA3AF",
                                    transition:"background .3s",
                                    boxShadow: done ? `0 2px 10px ${sc.dot}55` : "none",
                                  }}>
                                    {done ? "✓" : i + 1}
                                  </div>
                                  <div style={{ fontSize:9.5, fontWeight:700, color: done ? sc.color : "#9CA3AF", textTransform:"capitalize", whiteSpace:"nowrap", letterSpacing:"0.02em" }}>
                                    {step.replace(/_/g, " ")}
                                  </div>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div style={{ flex:1, height:2, background: i < si ? "#2ECC71" : "#F0ECE6", margin:"0 5px 14px", borderRadius:99, transition:"background .3s" }}/>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ── Cancelled ribbon ── */}
                    {isCancelled && (
                      <div style={{ margin:"0 22px 16px", background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:14 }}>❌</span>
                        <span style={{ fontSize:13, fontWeight:700, color:"#DC2626", fontFamily:"'Nunito',sans-serif" }}>This order was cancelled.</span>
                      </div>
                    )}

                    {/* ── Expanded panel ── */}
                    {isOpen && (
                      <div style={{ borderTop:"1.5px solid #F0ECE6", background:"#FFF9F2", padding:"18px 22px", animation:"fadeIn .2s ease" }}>

                        {/* Items */}
                        <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:12 }}>
                          Order Items ({order.items?.length || 0})
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                          {order.items?.length > 0 ? order.items.map((item, i) => (
                            <div key={i} className="mo-item">
                              {item.food?.thumbnail && (
                                <img src={item.food.thumbnail} alt={item.food?.name || "Food"}
                                  style={{ width:52, height:52, borderRadius:12, objectFit:"cover", flexShrink:0 }}
                                />
                              )}
                              <div style={{ flex:1, minWidth:0 }}>
                                <p style={{ fontSize:13.5, fontWeight:800, color:"#2C2C2C", margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                  {item.food?.name || "Food Item"}
                                </p>
                                <p style={{ fontSize:12, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0 }}>
                                  ₹{item.food?.price} × {item.quantity}
                                </p>
                              </div>
                              <span style={{ fontSize:14, fontWeight:900, color:"#FF7A00", flexShrink:0 }}>
                                ₹{(item.food?.price || 0) * item.quantity}
                              </span>
                            </div>
                          )) : (
                            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>No item details available.</p>
                          )}
                        </div>

                        {/* Order total row */}
                        <div style={{ background:"#fff", border:"1.5px solid #F0ECE6", borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                          <span style={{ fontSize:14, fontWeight:800, color:"#2C2C2C" }}>Order Total</span>
                          <span style={{ fontSize:18, fontWeight:900, color:"#FF7A00" }}>₹{order.totalAmount}</span>
                        </div>

                        {/* Shipping details */}
                        {order.shippingAddress && (
                          <div style={{ background:"#fff", border:"1.5px solid #F0ECE6", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
                            <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>
                              Shipping Details
                            </div>
                            <div className="mo-ship-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                              {[
                                { label:"Name",    val:order.shippingAddress.fullName  },
                                { label:"Phone",   val:order.shippingAddress.phone     },
                                { label:"City",    val:order.shippingAddress.city      },
                                { label:"Pincode", val:order.shippingAddress.postalCode },
                              ].filter(f => f.val).map((f, i) => (
                                <div key={i}>
                                  <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>{f.label}</div>
                                  <div style={{ fontSize:13, fontWeight:700, color:"#2C2C2C" }}>{f.val}</div>
                                </div>
                              ))}
                            </div>
                            {order.shippingAddress.address && (
                              <div style={{ marginTop:10 }}>
                                <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:2 }}>Address</div>
                                <div style={{ fontSize:13, fontWeight:600, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", lineHeight:1.6 }}>
                                  {order.shippingAddress.address}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                          {isDelivered && (
                            <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:11, padding:"10px 20px", fontWeight:800, fontSize:13, boxShadow:"0 4px 14px rgba(255,122,0,.26)" }}>
                              🔁 Reorder
                            </Link>
                          )}
                          <Link to="/contact" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FFF3E8", color:"#FF7A00", textDecoration:"none", borderRadius:11, padding:"10px 18px", fontWeight:700, fontSize:13, border:"1.5px solid #FFD4A8" }}>
                            💬 Need Help?
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom count */}
          {!loading && orders.length > 0 && (
            <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", marginTop:28, fontFamily:"'Nunito',sans-serif" }}>
              Showing all {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          )}
        </section>
      </div>
    </>
  );
}