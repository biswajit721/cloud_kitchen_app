import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { ShoppingBag, MapPin, Clock, CreditCard, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const orderStatusOptions = [
  { value:"pending",          label:"⏳ Pending"     },
  { value:"confirmed",        label:"✅ Confirmed"   },
  { value:"preparing",        label:"👨‍🍳 Preparing"  },
  { value:"out_for_delivery", label:"🛵 On the Way"  },
  { value:"delivered",        label:"🎉 Delivered"   },
  { value:"cancelled",        label:"❌ Cancelled"   },
];
const paymentStatusOptions = [
  { value:"pending", label:"⏳ Pending" },
  { value:"paid",    label:"✅ Paid"    },
  { value:"failed",  label:"❌ Failed"  },
];

const orderStatusStyle = {
  pending:          { color:"#B8860B", bg:"#FFF8E1", border:"#FFE57A" },
  confirmed:        { color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE" },
  preparing:        { color:"#E06A00", bg:"#FFF3E8", border:"#FFD4A8" },
  out_for_delivery: { color:"#7C3AED", bg:"#F5EEFF", border:"#D8B4FE" },
  delivered:        { color:"#27AE60", bg:"#E8FAF0", border:"#A8E6C2" },
  cancelled:        { color:"#DC2626", bg:"#FEF2F2", border:"#FECACA" },
};
const paymentStatusStyle = {
  pending: { color:"#B8860B", bg:"#FFF8E1" },
  paid:    { color:"#27AE60", bg:"#E8FAF0" },
  failed:  { color:"#DC2626", bg:"#FEF2F2" },
};

const S = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#FF7A00;border-radius:99px}
    @keyframes fadeUp  {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer {0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes spin-s  {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .ao-card{background:#fff;border-radius:20px;border:2px solid #F0ECE6;overflow:hidden;animation:fadeUp .4s ease both;transition:border-color .2s,box-shadow .2s;}
    .ao-card:hover{border-color:#FFD4A8;box-shadow:0 10px 32px rgba(255,122,0,.08);}
    .ao-skel{background:linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:8px;}
    .ao-select{
      width:100%;padding:9px 12px;border:1.5px solid #F0ECE6;border-radius:11px;
      font-family:'Sora',sans-serif;font-size:12.5px;color:#2C2C2C;outline:none;
      background:#FFF9F2;cursor:pointer;transition:border-color .2s;
      appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 10px center;background-size:14px;padding-right:30px;
    }
    .ao-select:focus{border-color:#FF7A00;background-color:#fff;}
    .ao-page{font-family:'Sora',sans-serif;min-height:100vh;background:#FFF9F2;padding:28px 24px 64px;color:#2C2C2C;}
    @media(max-width:900px){.ao-page{padding:20px 14px 48px;} .ao-grid{grid-template-columns:1fr 1fr !important;}}
    @media(max-width:600px){.ao-grid{grid-template-columns:1fr !important;}}
  `}</style>
);

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState({});
  const [updating, setUpdating] = useState({});
  const [toast,    setToast]    = useState("");

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      /* ── FIX: leading slash required ── */
      const res = await api.get("/orders");
      setOrders(res.data.data || []);
    } catch (e) { console.error("fetchOrders error:", e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user?.token) fetchOrders(); }, [user?.token]);

  const handleStatusChange = async (orderId, field, value) => {
    const key = orderId + field;
    setUpdating(u => ({ ...u, [key]: true }));

    /* Optimistic update */
    setOrders(prev => prev.map(o =>
      o._id === orderId ? { ...o, [field]: value } : o
    ));

    try {
      /* ── FIX: leading slash required ── */
      const res = await api.put(`/orders/${orderId}`, { [field]: value });
      const updated = res.data.data;
      if (updated) {
        setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      }
      showToast(`✅ ${field === "orderStatus" ? "Order" : "Payment"} status updated`);
    } catch (e) {
      console.error("Status update error:", e);
      /* Revert on error */
      fetchOrders();
      showToast("❌ Update failed — please try again");
    } finally {
      setUpdating(u => ({ ...u, [key]: false }));
    }
  };

  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const delivered    = orders.filter(o => o.orderStatus === "delivered").length;

  return (
    <>
      <S/>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#2C2C2C", color:"#fff", borderRadius:12,
          padding:"11px 22px", fontSize:13, fontWeight:700,
          fontFamily:"'Sora',sans-serif", zIndex:9999,
          boxShadow:"0 8px 28px rgba(0,0,0,.22)",
          animation:"fadeUp .3s ease both",
        }}>
          {toast}
        </div>
      )}

      <div className="ao-page">

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:38, height:38, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ShoppingBag size={18} color="#FF7A00"/>
              </div>
              <h1 style={{ fontSize:"clamp(1.3rem,2.5vw,1.7rem)", fontWeight:900, color:"#2C2C2C", margin:0 }}>Order Management</h1>
            </div>
            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0, paddingLeft:48 }}>
              {orders.length} total · {delivered} delivered · ₹{totalRevenue.toLocaleString("en-IN")} revenue
            </p>
          </div>
          <button type="button" onClick={fetchOrders}
            style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", border:"1.5px solid #F0ECE6", color:"#5C5C6E", borderRadius:11, padding:"9px 16px", fontFamily:"'Sora',sans-serif", fontSize:12.5, fontWeight:700, cursor:"pointer" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="#FF7A00"; e.currentTarget.style.color="#FF7A00"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="#F0ECE6"; e.currentTarget.style.color="#5C5C6E"; }}>
            <RefreshCw size={13}/> Refresh
          </button>
        </div>

        {/* Summary chips */}
        {!loading && (
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
            {[
              { label:"Total",     val:orders.length,                                       color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8" },
              { label:"Delivered", val:delivered,                                           color:"#27AE60", bg:"#E8FAF0", border:"#A8E6C2" },
              { label:"Pending",   val:orders.filter(o=>o.orderStatus==="pending").length,  color:"#B8860B", bg:"#FFF8E1", border:"#FFE57A" },
              { label:"Revenue",   val:`₹${totalRevenue.toLocaleString("en-IN")}`,          color:"#7C3AED", bg:"#F5EEFF", border:"#D8B4FE" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, background:s.bg, border:`1.5px solid ${s.border}`, borderRadius:12, padding:"8px 14px" }}>
                <span style={{ fontSize:14, fontWeight:900, color:s.color }}>{s.val}</span>
                <span style={{ fontSize:11, color:s.color, fontWeight:700, opacity:.75 }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="ao-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background:"#fff", borderRadius:20, border:"2px solid #F0ECE6", padding:"20px" }}>
                <div style={{ display:"flex", gap:12, marginBottom:14 }}>
                  <div className="ao-skel" style={{ width:40, height:40, borderRadius:11, flexShrink:0 }}/>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                    <div className="ao-skel" style={{ height:13, width:"55%" }}/>
                    <div className="ao-skel" style={{ height:10, width:"35%" }}/>
                  </div>
                </div>
                <div className="ao-skel" style={{ height:36, marginBottom:8 }}/>
                <div className="ao-skel" style={{ height:36 }}/>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff", borderRadius:22, border:"2px solid #F0ECE6" }}>
            <div style={{ fontSize:56, marginBottom:14 }}>📭</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>No orders yet</h3>
            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>Orders placed by customers will appear here.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && orders.length > 0 && (
          <div className="ao-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {orders.map((order, idx) => {
              const os    = orderStatusStyle[order.orderStatus]      || orderStatusStyle["pending"];
              const ps    = paymentStatusStyle[order.paymentStatus]  || paymentStatusStyle["pending"];
              const isOpen = !!expanded[order._id];

              return (
                <div key={order._id} className="ao-card" style={{ animationDelay:`${Math.min(idx*.04,.3)}s` }}>
                  <div style={{ padding:"16px 18px 16px" }}>

                    {/* Top row */}
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:"#9CA3AF", letterSpacing:".05em", textTransform:"uppercase", marginBottom:3 }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </div>
                        <div style={{ fontSize:14, fontWeight:800, color:"#2C2C2C" }}>
                          {order.user?.name || order.shippingAddress?.fullName || "Customer"}
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end" }}>
                        <span style={{ fontSize:10.5, fontWeight:800, color:os.color, background:os.bg, border:`1px solid ${os.border}`, borderRadius:99, padding:"3px 10px" }}>
                          {orderStatusOptions.find(o=>o.value===order.orderStatus)?.label || order.orderStatus}
                        </span>
                        <span style={{ fontSize:10.5, fontWeight:800, color:ps.color, background:ps.bg, borderRadius:99, padding:"3px 10px" }}>
                          {paymentStatusOptions.find(o=>o.value===order.paymentStatus)?.label || order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:12 }}>
                      {order.shippingAddress?.city && (
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                          <MapPin size={11} color="#FF7A00"/> {order.shippingAddress.city}
                        </span>
                      )}
                      {order.createdAt && (
                        <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                          <Clock size={11} color="#9CA3AF"/> {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                        </span>
                      )}
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                        <CreditCard size={11} color="#2ECC71"/> {order.paymentStatus || "pending"}
                      </span>
                    </div>

                    {/* Amount */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, background:"#FFF9F2", borderRadius:10, padding:"8px 12px" }}>
                      <span style={{ fontSize:12, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>
                        {order.items?.length || 0} item{(order.items?.length||0)!==1?"s":""}
                      </span>
                      <span style={{ fontSize:18, fontWeight:900, color:"#FF7A00" }}>₹{order.totalAmount}</span>
                    </div>

                    {/* Expand items */}
                    <button type="button" onClick={() => toggle(order._id)}
                      style={{ width:"100%", background:"#FFF9F2", border:"1.5px solid #F0ECE6", borderRadius:10, padding:"7px", fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:700, color:"#5C5C6E", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginBottom:12, transition:"all .15s" }}
                      onMouseEnter={e=>{ e.currentTarget.style.background="#FFF3E8"; e.currentTarget.style.color="#FF7A00"; e.currentTarget.style.borderColor="#FFD4A8"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background="#FFF9F2"; e.currentTarget.style.color="#5C5C6E"; e.currentTarget.style.borderColor="#F0ECE6"; }}>
                      {isOpen ? <><ChevronUp size={12}/> Hide Items</> : <><ChevronDown size={12}/> View Items</>}
                    </button>

                    {/* Items */}
                    {isOpen && (
                      <div style={{ background:"#FFF9F2", borderRadius:12, padding:"10px 12px", marginBottom:12, maxHeight:180, overflowY:"auto" }}>
                        {order.items?.length > 0 ? order.items.map((item, i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom:i<order.items.length-1?"1px solid #F0ECE6":"none" }}>
                            {item.food?.thumbnail && (
                              <img src={item.food.thumbnail} alt={item.food?.name} style={{ width:36, height:36, borderRadius:8, objectFit:"cover", flexShrink:0 }}/>
                            )}
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12.5, fontWeight:700, color:"#2C2C2C", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                {item.food?.name || "Food Item"}
                              </div>
                              <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>
                                ₹{item.food?.price} × {item.quantity}
                              </div>
                            </div>
                            <span style={{ fontSize:12.5, fontWeight:800, color:"#FF7A00", flexShrink:0 }}>
                              ₹{(item.food?.price||0)*item.quantity}
                            </span>
                          </div>
                        )) : (
                          <p style={{ fontSize:12, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>No item details available.</p>
                        )}
                      </div>
                    )}

                    {/* Shipping info when expanded */}
                    {isOpen && order.shippingAddress && (
                      <div style={{ background:"#F0F7FF", border:"1.5px solid #BFDBFE", borderRadius:12, padding:"10px 12px", marginBottom:12 }}>
                        <div style={{ fontSize:10, fontWeight:800, color:"#2563EB", textTransform:"uppercase", letterSpacing:".06em", marginBottom:6 }}>📍 Shipping Address</div>
                        <div style={{ fontSize:12, color:"#2C2C2C", fontFamily:"'Nunito',sans-serif", lineHeight:1.7 }}>
                          <strong>{order.shippingAddress.fullName}</strong> · {order.shippingAddress.phone}<br/>
                          {order.shippingAddress.address}<br/>
                          {order.shippingAddress.city}{order.shippingAddress.postalCode ? ` — ${order.shippingAddress.postalCode}` : ""}
                        </div>
                      </div>
                    )}

                    {/* ─── Status selects ───
                        FIX: these now call handleStatusChange which uses /orders/:id with leading slash
                        Optimistic update shows change instantly, API call confirms it.
                    ─── */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      <div>
                        <label style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".05em", display:"block", marginBottom:4 }}>
                          Order Status {updating[order._id+"orderStatus"] && <span style={{color:"#FF7A00"}}>· saving…</span>}
                        </label>
                        <select
                          className="ao-select"
                          value={order.orderStatus || "pending"}
                          onChange={e => handleStatusChange(order._id, "orderStatus", e.target.value)}
                          disabled={!!updating[order._id+"orderStatus"]}
                          style={{
                            opacity: updating[order._id+"orderStatus"] ? .6 : 1,
                            borderColor: os.border,
                            color: os.color,
                            background: os.bg,
                          }}>
                          {orderStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:10, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".05em", display:"block", marginBottom:4 }}>
                          Payment Status {updating[order._id+"paymentStatus"] && <span style={{color:"#FF7A00"}}>· saving…</span>}
                        </label>
                        <select
                          className="ao-select"
                          value={order.paymentStatus || "pending"}
                          onChange={e => handleStatusChange(order._id, "paymentStatus", e.target.value)}
                          disabled={!!updating[order._id+"paymentStatus"]}
                          style={{
                            opacity: updating[order._id+"paymentStatus"] ? .6 : 1,
                            borderColor: paymentStatusStyle[order.paymentStatus]?.bg || "#F0ECE6",
                          }}>
                          {paymentStatusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}