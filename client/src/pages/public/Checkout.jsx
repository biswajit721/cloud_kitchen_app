import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { MapPin, Phone, User, Home, Hash, ShoppingBag, CheckCircle, ArrowRight, ChevronRight, Tag } from "lucide-react";

const CheckoutStyles = () => (
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
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes successPop { 0%{transform:scale(.85);opacity:0} 70%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes checkDraw { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .co-input {
      width:100%; padding:12px 14px 12px 42px;
      background:var(--cream); border:1.5px solid var(--border);
      border-radius:13px; font-family:'Sora',sans-serif;
      font-size:14px; color:var(--text); outline:none;
      transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .co-input:focus { border-color:var(--orange); background:var(--white); box-shadow:0 0 0 3px rgba(255,122,0,.10); }
    .co-input::placeholder { color:var(--text-light); font-family:'Nunito',sans-serif; }
    .co-textarea {
      width:100%; padding:12px 14px 12px 42px;
      background:var(--cream); border:1.5px solid var(--border);
      border-radius:13px; font-family:'Nunito',sans-serif;
      font-size:14px; color:var(--text); outline:none;
      resize:none; min-height:90px;
      transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .co-textarea:focus { border-color:var(--orange); background:var(--white); box-shadow:0 0 0 3px rgba(255,122,0,.10); }
    .co-textarea::placeholder { color:var(--text-light); }
    .pay-btn {
      width:100%; padding:15px; background:var(--orange); color:#fff; border:none;
      border-radius:16px; font-family:'Sora',sans-serif; font-size:16px; font-weight:800;
      cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
      box-shadow:0 8px 28px rgba(255,122,0,.34);
      transition:background .18s,transform .15s,box-shadow .18s;
    }
    .pay-btn:hover:not(:disabled) { background:var(--orange-dark); transform:translateY(-2px); box-shadow:0 12px 34px rgba(255,122,0,.42); }
    .pay-btn:disabled { opacity:.65; cursor:not-allowed; }
    .co-card { animation:fadeUp .5s ease both; }
    @media(max-width:860px){ .co-layout{grid-template-columns:1fr !important;} }
    @media(max-width:480px){ .co-field-row{grid-template-columns:1fr !important;} }
  `}</style>
);

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ fullName:"", phone:"", address:"", city:"", postalCode:"" });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [coupon,   setCoupon]   = useState("");
  const [couponOk, setCouponOk] = useState(false);

  const subtotal   = cartItems.reduce((a, i) => a + i.quantity * i.price, 0);
  const discount   = couponOk ? Math.round(subtotal * 0.1) : 0;
  const totalPrice = subtotal - discount;

  const handleChange = e => setAddress({ ...address, [e.target.name]: e.target.value });

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "FIRST50" || coupon.trim().toUpperCase() === "SAVE10") {
      setCouponOk(true);
    } else {
      setCouponOk(false);
    }
  };

  const handlePayment = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({ food: item._id, quantity: item.quantity })),
        totalAmount: totalPrice,
        shippingAddress: address,
      };
      await api.post("/orders", orderData);
      setSuccess(true);
      clearCart();
    } catch (e) {
      console.error(e);
      alert("❌ Order failed. Please try again.");
    }
    setLoading(false);
  };

  /* ── Empty cart ── */
  if (cartItems.length === 0 && !success) {
    return (
      <>
        <CheckoutStyles />
        <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:"var(--cream)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ textAlign:"center", background:"#fff", borderRadius:28, padding:"60px 40px", boxShadow:"0 16px 48px rgba(0,0,0,0.07)", border:"2px solid var(--border)", maxWidth:380 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:"var(--text)", marginBottom:8 }}>Your cart is empty</h2>
            <p style={{ fontSize:14, color:"var(--text-light)", marginBottom:24, fontFamily:"'Nunito',sans-serif" }}>Add some delicious food before checking out!</p>
            <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--orange)", color:"#fff", textDecoration:"none", borderRadius:13, padding:"12px 28px", fontWeight:800, fontSize:14, boxShadow:"0 4px 16px rgba(255,122,0,.28)" }}>
              Browse Menu <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <>
        <CheckoutStyles />
        <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:"var(--cream)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ textAlign:"center", background:"#fff", borderRadius:28, padding:"60px 40px", boxShadow:"0 24px 64px rgba(0,0,0,0.10)", border:"2px solid #A8E6C2", maxWidth:400, animation:"successPop .5s ease both" }}>
            <div style={{ width:80, height:80, background:"var(--green-light)", border:"3px solid var(--green)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(46,204,113,.22)" }}>
              <CheckCircle size={40} color="var(--green)"/>
            </div>
            <h2 style={{ fontSize:24, fontWeight:900, color:"var(--text)", marginBottom:8 }}>Order Placed! 🎉</h2>
            <p style={{ fontSize:14, color:"var(--text-mid)", marginBottom:6, fontFamily:"'Nunito',sans-serif", lineHeight:1.75 }}>
              Your order has been confirmed and is being prepared. Estimated delivery: <strong style={{color:"var(--orange)"}}>28–35 minutes.</strong>
            </p>
            <div style={{ background:"var(--orange-light)", border:"1.5px solid #FFD4A8", borderRadius:14, padding:"14px 18px", margin:"20px 0", textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:800, color:"var(--orange)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Order Summary</div>
              <div style={{ fontSize:14, color:"var(--text-mid)", fontFamily:"'Nunito',sans-serif" }}>
                Delivering to <strong style={{color:"var(--text)"}}>{address.fullName}</strong> in <strong style={{color:"var(--text)"}}>{address.city}</strong>
              </div>
              <div style={{ fontSize:15, fontWeight:900, color:"var(--orange)", marginTop:6 }}>₹{totalPrice} paid</div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <Link to="/my-orders" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--orange)", color:"#fff", textDecoration:"none", borderRadius:13, padding:"12px 22px", fontWeight:800, fontSize:13, boxShadow:"0 4px 16px rgba(255,122,0,.28)" }}>
                <ShoppingBag size={14}/> Track Order
              </Link>
              <Link to="/" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--cream)", color:"var(--text-mid)", textDecoration:"none", borderRadius:13, padding:"12px 20px", fontWeight:700, fontSize:13, border:"1.5px solid var(--border)" }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const Field = ({ icon: Icon, name, placeholder, type="text" }) => (
    <div style={{position:"relative"}}>
      <Icon size={15} color="#9CA3AF" style={{position:"absolute",left:14,top:type==="textarea"?"14px":"50%",transform:type==="textarea"?"none":"translateY(-50%)",pointerEvents:"none"}}/>
      {type === "textarea"
        ? <textarea name={name} placeholder={placeholder} value={address[name]} onChange={handleChange} className="co-textarea"/>
        : <input type={type} name={name} placeholder={placeholder} value={address[name]} onChange={handleChange} className="co-input"/>
      }
    </div>
  );

  return (
    <>
      <CheckoutStyles />
      <div style={{ fontFamily:"'Sora',sans-serif", background:"var(--cream)", minHeight:"100vh", color:"var(--text)" }}>

        {/* ── Hero strip ── */}
        <div style={{
          background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%)",
          padding:"40px 5vw 52px", position:"relative", overflow:"hidden",
        }}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,0.12) 1px,transparent 0)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
          <div style={{position:"absolute",top:-60,right:-60,width:240,height:240,borderRadius:"50%",background:"rgba(255,255,255,0.09)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Link to="/" style={{color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:500,textDecoration:"none"}}>Home</Link>
              <ChevronRight size={13} color="rgba(255,255,255,0.45)"/>
              <Link to="/foods" style={{color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:500,textDecoration:"none"}}>Cart</Link>
              <ChevronRight size={13} color="rgba(255,255,255,0.45)"/>
              <span style={{color:"#fff",fontSize:13,fontWeight:700}}>Checkout</span>
            </div>
            <h1 style={{fontSize:"clamp(1.8rem,3.5vw,2.6rem)",fontWeight:900,color:"#fff",lineHeight:1.1}}>
              Almost there! 🛵<br/>
              <span style={{fontSize:"clamp(1rem,2vw,1.3rem)",fontWeight:600,opacity:.8}}>Complete your order below</span>
            </h1>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,lineHeight:0}}>
            <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,52 C360,0 1080,52 1440,13 L1440,52 Z" fill="var(--cream)"/>
            </svg>
          </div>
        </div>

        {/* ── Layout ── */}
        <div style={{padding:"32px 5vw 72px"}}>
          <div className="co-layout" style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:24,maxWidth:1100,margin:"0 auto"}}>

            {/* ── LEFT — delivery form ── */}
            <div className="co-card">
              {/* Delivery Address */}
              <div style={{background:"var(--white)",border:"2px solid var(--border)",borderRadius:24,padding:"28px 26px",marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                  <div style={{width:38,height:38,background:"var(--orange-light)",border:"1.5px solid #FFD4A8",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <MapPin size={18} color="var(--orange)"/>
                  </div>
                  <div>
                    <h2 style={{fontSize:16,fontWeight:900,color:"var(--text)",margin:0}}>Delivery Address</h2>
                    <p style={{fontSize:12,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif",margin:0}}>Where should we deliver?</p>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="co-field-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-mid)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Full Name *</label>
                      <Field icon={User} name="fullName" placeholder="Aryan Mehta"/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-mid)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Phone *</label>
                      <Field icon={Phone} name="phone" placeholder="+91 98765 43210" type="tel"/>
                    </div>
                  </div>

                  <div className="co-field-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-mid)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>City *</label>
                      <Field icon={MapPin} name="city" placeholder="Bangalore"/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-mid)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Postal Code</label>
                      <Field icon={Hash} name="postalCode" placeholder="560001"/>
                    </div>
                  </div>

                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"var(--text-mid)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Full Address *</label>
                    <Field icon={Home} name="address" placeholder="Flat no., Street, Area, Landmark…" type="textarea"/>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div style={{background:"var(--white)",border:"2px solid var(--border)",borderRadius:24,padding:"24px 26px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <div style={{width:38,height:38,background:"var(--green-light)",border:"1.5px solid #A8E6C2",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💳</div>
                  <div>
                    <h2 style={{fontSize:16,fontWeight:900,color:"var(--text)",margin:0}}>Payment Method</h2>
                    <p style={{fontSize:12,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif",margin:0}}>Secure & encrypted</p>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {id:"cod",label:"Cash on Delivery",icon:"💵",sub:"Pay when your order arrives"},
                    {id:"upi",label:"UPI / GPay / PhonePe",icon:"📱",sub:"Instant payment via UPI"},
                    {id:"card",label:"Credit / Debit Card",icon:"💳",sub:"Visa, Mastercard, RuPay"},
                  ].map((m,i) => (
                    <label key={m.id} style={{display:"flex",alignItems:"center",gap:12,background: i===0?"var(--orange-light)":"var(--cream)",border:`2px solid ${i===0?"#FFD4A8":"var(--border)"}`,borderRadius:14,padding:"14px 16px",cursor:"pointer"}}>
                      <input type="radio" name="payment" defaultChecked={i===0} style={{accentColor:"var(--orange)",width:16,height:16}}/>
                      <span style={{fontSize:20}}>{m.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:800,color:"var(--text)"}}>{m.label}</div>
                        <div style={{fontSize:11,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif"}}>{m.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT — order summary ── */}
            <div style={{display:"flex",flexDirection:"column",gap:18}}>

              {/* Items */}
              <div style={{background:"var(--white)",border:"2px solid var(--border)",borderRadius:24,padding:"24px 22px",animation:"fadeUp .5s .1s ease both"}}>
                <h2 style={{fontSize:16,fontWeight:900,color:"var(--text)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
                  <ShoppingBag size={17} color="var(--orange)"/> Order Summary
                  <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:"var(--text-light)"}}>
                    {cartItems.reduce((s,i)=>s+i.quantity,0)} items
                  </span>
                </h2>

                <div style={{display:"flex",flexDirection:"column",gap:14,maxHeight:280,overflowY:"auto",paddingRight:4}}>
                  {cartItems.map(item => (
                    <div key={item._id} style={{display:"flex",alignItems:"center",gap:12,paddingBottom:12,borderBottom:"1px solid var(--border)"}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <img src={item.thumbnail} alt={item.name}
                          style={{width:54,height:54,borderRadius:12,objectFit:"cover",display:"block"}}
                        />
                        <div style={{position:"absolute",top:-6,right:-6,width:20,height:20,background:"var(--orange)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff",border:"2px solid #fff"}}>
                          {item.quantity}
                        </div>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:13,fontWeight:700,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:"0 0 3px"}}>{item.name}</p>
                        <p style={{fontSize:11,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif",margin:0}}>₹{item.price} × {item.quantity}</p>
                      </div>
                      <span style={{fontSize:14,fontWeight:900,color:"var(--orange)",flexShrink:0}}>₹{item.price*item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div style={{marginTop:16,display:"flex",gap:8}}>
                  <div style={{position:"relative",flex:1}}>
                    <Tag size={13} color="#9CA3AF" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                    <input
                      placeholder="Coupon code"
                      value={coupon} onChange={e=>{setCoupon(e.target.value);setCouponOk(false);}}
                      style={{width:"100%",padding:"10px 12px 10px 32px",background:"var(--cream)",border:`1.5px solid ${couponOk?"var(--green)":"var(--border)"}`,borderRadius:11,fontFamily:"'Sora',sans-serif",fontSize:13,color:"var(--text)",outline:"none"}}
                    />
                  </div>
                  <button onClick={applyCoupon}
                    style={{background: couponOk?"var(--green)":"var(--orange)",color:"#fff",border:"none",borderRadius:11,padding:"10px 16px",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}
                  >
                    {couponOk ? "✓ Applied" : "Apply"}
                  </button>
                </div>
                {couponOk && <p style={{fontSize:11,color:"var(--green-dark)",fontWeight:700,marginTop:6,fontFamily:"'Nunito',sans-serif"}}>🎉 10% discount applied!</p>}
                {coupon && !couponOk && <p style={{fontSize:11,color:"#EF4444",fontWeight:700,marginTop:6,fontFamily:"'Nunito',sans-serif"}}>Invalid coupon. Try FIRST50 or SAVE10</p>}

                {/* Totals */}
                <div style={{background:"var(--cream)",borderRadius:14,padding:"14px 16px",marginTop:16}}>
                  {[
                    {label:"Subtotal", val:`₹${subtotal}`},
                    {label:"Delivery Fee", val:"FREE", valColor:"var(--green)"},
                    ...(couponOk ? [{label:"Coupon Discount", val:`-₹${discount}`, valColor:"var(--green)"}] : []),
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:13,color:"var(--text-mid)",fontFamily:"'Nunito',sans-serif"}}>{r.label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:r.valColor||"var(--text)"}}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{height:1,background:"var(--border)",margin:"10px 0"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:15,fontWeight:900,color:"var(--text)"}}>Total</span>
                    <span style={{fontSize:20,fontWeight:900,color:"var(--orange)"}}>₹{totalPrice}</span>
                  </div>
                </div>

                {/* Offer tag */}
                <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--yellow-light)",border:"1px solid rgba(255,195,0,.40)",borderRadius:10,padding:"9px 12px",marginTop:12}}>
                  <span style={{fontSize:14}}>🎉</span>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontSize:12,fontWeight:700,color:"#92670A"}}>Free delivery applied! You save ₹49</span>
                </div>

                {/* Pay button */}
                <button className="pay-btn" onClick={handlePayment} disabled={loading} style={{marginTop:16}}>
                  {loading ? (
                    <svg style={{animation:"spin-slow .8s linear infinite"}} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/>
                    </svg>
                  ) : <><span style={{fontSize:18}}>🔒</span> Place Order · ₹{totalPrice}</>}
                </button>

                <p style={{textAlign:"center",fontSize:11,color:"var(--text-light)",fontFamily:"'Nunito',sans-serif",marginTop:10}}>
                  🔒 Secured by 256-bit SSL encryption
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}