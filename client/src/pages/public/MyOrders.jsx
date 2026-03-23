import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { ShoppingBag, MapPin, CreditCard, Clock, ChevronDown, ChevronUp, ArrowRight, Package } from "lucide-react";

const OrderStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    :root {
      --orange:#FF7A00; --orange-dark:#E06A00; --orange-light:#FFF3E8;
      --green:#2ECC71; --green-light:#E8FAF0; --green-dark:#27AE60;
      --yellow:#FFC300; --yellow-light:#FFF8E1;
      --cream:#FFF9F2; --white:#FFFFFF;
      --text:#2C2C2C; --text-mid:#5C5C6E; --text-light:#9CA3AF;
      --border:#F0ECE6; --navy:#1A1A2E;
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:var(--cream)} ::-webkit-scrollbar-thumb{background:var(--orange);border-radius:99px}
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1)} 50%{transform:scale(1.5);opacity:.6} }
    .ord-card {
      background:var(--white); border:2px solid var(--border); border-radius:22px; overflow:hidden;
      transition:border-color .2s,box-shadow .2s; animation:fadeUp .4s ease both;
    }
    .ord-card:hover { border-color:#FFD4A8; box-shadow:0 10px 32px rgba(255,122,0,.09); }
    .ord-skeleton { background:linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%); background-size:600px 100%; animation:shimmer 1.4s infinite; border-radius:10px; }
    .expand-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:5px; font-family:'Sora',sans-serif; font-size:12px; font-weight:700; color:var(--orange); padding:5px 10px; border-radius:8px; transition:background .15s; }
    .expand-btn:hover { background:var(--orange-light); }
  `}</style>
);

/* Status config */
const statusMap = {
  pending:    { label:"Pending",    color:"#FFC300", bg:"#FFF8E1", border:"#FFE57A", dot:"#FFC300", icon:"⏳" },
  confirmed:  { label:"Confirmed",  color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE", dot:"#2563EB", icon:"✅" },
  preparing:  { label:"Preparing",  color:"#FF7A00", bg:"#FFF3E8", border:"#FFD4A8", dot:"#FF7A00", icon:"👨‍🍳" },
  out_for_delivery:{ label:"On the Way", color:"#9B59B6", bg:"#F5EEFF", border:"#D8B4FE", dot:"#9B59B6", icon:"🛵" },
  delivered:  { label:"Delivered",  color:"#2ECC71", bg:"#E8FAF0", border:"#A8E6C2", dot:"#2ECC71", icon:"🎉" },
  cancelled:  { label:"Cancelled",  color:"#EF4444", bg:"#FEF2F2", border:"#FECACA", dot:"#EF4444", icon:"❌" },
};
function getStatus(s) { return statusMap[s?.toLowerCase()] || statusMap["pending"]; }

/* Stepper steps */
const steps = ["confirmed","preparing","out_for_delivery","delivered"];
function stepIndex(status) { return steps.indexOf(status?.toLowerCase()); }

export default function MyOrders() {
  const { user } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!user?.token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await api.get("orders/my-orders");
        const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setOrders(data.filter(Boolean));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [user?.token]);

  const toggle = id => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  return (
    <>
      <OrderStyles />
      <div style={{ fontFamily:"'Sora',sans-serif", background:"var(--cream)", minHeight:"100vh", color:"var(--text)" }}>

        {/* ── Hero strip ── */}
        <section style={{
          background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%)",
          padding:"60px 5vw 68px", position:"relative", overflow:"hidden",
        }}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.12) 1px,transparent 0)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:-100,right:-100,width:360,height:360,borderRadius:"50%",background:"rgba(255,255,255,0.09)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"10%",right:"5%",width:150,height:150,borderRadius:"50%",border:"2px dashed rgba(255,255,255,0.22)",animation:"spin-slow 26s linear infinite",pointerEvents:"none"}}/>

          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,marginBottom:18,background:"rgba(255,255,255,0.20)",border:"1.5px solid rgba(255,255,255,0.35)",borderRadius:99,padding:"7px 16px",backdropFilter:"blur(8px)"}}>
              <span style={{width:8,height:8,background:"#2ECC71",borderRadius:"50%",display:"block",animation:"pulse-dot 1.5s ease infinite"}}/>
              <span style={{color:"#fff",fontSize:12,fontWeight:700}}>Real-time order tracking</span>
            </div>
            <h1 style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:12}}>
              My Orders 📦
            </h1>
            <p style={{color:"rgba(255,255,255,0.82)",fontSize:14,fontFamily:"'Nunito',sans-serif",fontWeight:500,maxWidth:440,lineHeight:1.75}}>
              Track all your orders, view details, and reorder your favourites.
            </p>

            {/* Quick stats */}
            {!loading && orders.length > 0 && (
              <div style={{display:"flex",gap:24,marginTop:24,flexWrap:"wrap"}}>
                {[
                  {val:orders.length, label:"Total Orders"},
                  {val:`₹${totalSpent}`, label:"Total Spent"},
                  {val:orders.filter(o=>o.orderStatus==="delivered").length, label:"Delivered"},
                ].map((s,i)=>(
                  <div key={i} style={{paddingRight:24,borderRight:i<2?"1px solid rgba(255,255,255,0.22)":"none"}}>
                    <div style={{fontSize:"clamp(1.1rem,2vw,1.4rem)",fontWeight:900,color:"#fff",lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:3,fontWeight:600}}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{position:"absolute",bottom:0,left:0,right:0,lineHeight:0}}>
            <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,52 C360,0 1080,52 1440,13 L1440,52 Z" fill="var(--cream)"/>
            </svg>
          </div>
        </section>

        {/* ── Content ── */}
        <section style={{padding:"36px 5vw 72px",maxWidth:900,margin:"0 auto"}}>

          {/* Loading skeletons */}
          {loading && (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {Array.from({length:3}).map((_,i)=>(
                <div key={i} style={{background:"var(--white)",border:"2px solid var(--border)",borderRadius:22,padding:"24px 22px",display:"flex",flexDirection:"column",gap:12}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div className="ord-skeleton" style={{height:14,width:"35%"}}/>
                    <div className="ord-skeleton" style={{height:22,width:"18%",borderRadius:99}}/>
                  </div>
                  <div className="ord-skeleton" style={{height:11,width:"55%"}}/>
                  <div className="ord-skeleton" style={{height:11,width:"40%"}}/>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && orders.length === 0 && (
            <div style={{textAlign:"center",padding:"72px 20px",background:"var(--white)",borderRadius:24,border:"2px solid var(--border)"}}>
              <div style={{fontSize:60,marginBottom:16}}>📦</div>
              <h3 style={{fontSize:20,fontWeight:800,color:"var(--text)",marginBottom:8}}>No orders yet</h3>
              <p style={{fontSize:14,color:"var(--text-light)",marginBottom:24,fontFamily:"'Nunito',sans-serif"}}>
                Your order history will appear here once you place your first order.
              </p>
              <Link to="/foods" style={{display:"inline-flex",alignItems:"center",gap:6,background:"var(--orange)",color:"#fff",textDecoration:"none",borderRadius:13,padding:"12px 28px",fontWeight:800,fontSize:14,boxShadow:"0 4px 16px rgba(255,122,0,.28)"}}>
                Order Now <ArrowRight size={14}/>
              </Link>
            </div>
          )}

          {/* Orders */}
          {!loading && orders.length > 0 && (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {orders.map((order, idx) => {
                const st      = getStatus(order.orderStatus);
                const isOpen  = !!expanded[order._id];
                const si      = stepIndex(order.orderStatus);
                const isDelivered = order.orderStatus?.toLowerCase() === "delivered";

                return (
                  <div key={order._id} className="ord-card" style={{animationDelay:`${idx*.06}s`}}>

                    {/* Card header */}
                    <div style={{padding:"20px 22px",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
                      <div style={{flex:1,minWidth:0}}>
                        {/* Order ID + status */}
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:8}}>
                          <div style={{width:36,height:36,background:"var(--orange-light)",border:"1.5px solid #FFD4A8",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                            {st.icon}
                          </div>
                          <div>
                            <div style={{fontSize:12,fontWeight:800,color:"var(--text-light)",letterSpacing:"0.06em",textTransform:"uppercase"}}>
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                              <span style={{width:6,height:6,borderRadius:"50%",background:st.dot,display:"block",flexShrink:0,animation: !isDelivered?"pulse-dot 1.5s ease infinite":"none"}}/>
                              <span style={{fontSize:13,fontWeight:800,color:st.color,background:st.bg,border:`1px solid ${st.border}`,borderRadius:99,padding:"3px 10px",display:"inline-block"}}>
                                {st.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                          <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"var(--text-mid)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                            <MapPin size={11} color="var(--orange)"/>
                            {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                          </span>
                          <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"var(--text-mid)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                            <CreditCard size={11} color="var(--green)"/>
                            {order.paymentStatus || "Pending"}
                          </span>
                          {order.createdAt && (
                            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"var(--text-mid)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>
                              <Clock size={11} color="var(--text-light)"/>
                              {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Total + expand */}
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                        <span style={{fontSize:20,fontWeight:900,color:"var(--orange)"}}>₹{order.totalAmount}</span>
                        <button className="expand-btn" onClick={() => toggle(order._id)}>
                          <Package size={12}/> {isOpen ? "Hide" : "View"} Details
                          {isOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                        </button>
                      </div>
                    </div>

                    {/* Delivery progress stepper */}
                    {!["pending","cancelled"].includes(order.orderStatus?.toLowerCase()) && (
                      <div style={{padding:"0 22px 18px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:0}}>
                          {steps.map((step, i) => {
                            const done  = i <= si;
                            const sc    = getStatus(step);
                            return (
                              <React.Fragment key={step}>
                                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:"0 0 auto"}}>
                                  <div style={{width:28,height:28,borderRadius:"50%",background:done?sc.color:"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,transition:"background .3s",boxShadow:done?`0 2px 8px ${sc.color}44`:"none"}}>
                                    {done ? "✓" : "○"}
                                  </div>
                                  <div style={{fontSize:10,fontWeight:700,color:done?sc.color:"var(--text-light)",textTransform:"capitalize",whiteSpace:"nowrap"}}>
                                    {step.replace("_"," ")}
                                  </div>
                                </div>
                                {i < steps.length-1 && (
                                  <div style={{flex:1,height:2,background:i<si?"var(--green)":"var(--border)",margin:"0 6px 14px",transition:"background .3s"}}/>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Expanded items */}
                    {isOpen && (
                      <div style={{borderTop:"1.5px solid var(--border)",background:"var(--cream)",padding:"18px 22px",animation:"fadeIn .2s ease"}}>
                        <div style={{fontSize:11,fontWeight:800,color:"var(--text-light)",letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:14}}>
                          Order Items
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:12}}>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:"var(--white)",borderRadius:14,border:"1.5px solid var(--border)"}}>
                              {item.food?.thumbnail && (
                                <img src={item.food.thumbnail} alt={item.food.name}
                                  style={{width:50,height:50,borderRadius:11,objectFit:"cover",flexShrink:0}}
                                />
                              )}
                              <div style={{flex:1,minWidth:0}}>
                                <p style={{fontSize:13,fontWeight:800,color:"var(--text)",margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.food?.name}</p>
                                <p style={{fontSize:12,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif",margin:0}}>₹{item.food?.price} × {item.quantity}</p>
                              </div>
                              <span style={{fontSize:14,fontWeight:900,color:"var(--orange)",flexShrink:0}}>₹{item.food?.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping detail */}
                        <div style={{marginTop:14,background:"var(--white)",border:"1.5px solid var(--border)",borderRadius:14,padding:"14px 16px"}}>
                          <div style={{fontSize:11,fontWeight:800,color:"var(--text-light)",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>Shipping Details</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                            {[
                              {label:"Name",    val:order.shippingAddress?.fullName},
                              {label:"Phone",   val:order.shippingAddress?.phone},
                              {label:"City",    val:order.shippingAddress?.city},
                              {label:"Pincode", val:order.shippingAddress?.postalCode},
                            ].map((f,i) => f.val ? (
                              <div key={i}>
                                <div style={{fontSize:10,fontWeight:700,color:"var(--text-light)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{f.label}</div>
                                <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{f.val}</div>
                              </div>
                            ) : null)}
                          </div>
                          {order.shippingAddress?.address && (
                            <div style={{marginTop:8}}>
                              <div style={{fontSize:10,fontWeight:700,color:"var(--text-light)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Address</div>
                              <div style={{fontSize:13,fontWeight:600,color:"var(--text-mid)",fontFamily:"'Nunito',sans-serif"}}>{order.shippingAddress.address}</div>
                            </div>
                          )}
                        </div>

                        {/* Reorder */}
                        {isDelivered && (
                          <Link to="/foods" style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:14,background:"var(--orange)",color:"#fff",textDecoration:"none",borderRadius:12,padding:"10px 20px",fontWeight:800,fontSize:13,boxShadow:"0 4px 14px rgba(255,122,0,.26)"}}>
                            🔁 Reorder
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}