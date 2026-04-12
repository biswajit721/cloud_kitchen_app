import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  MapPin, Phone, User, Home, Hash,
  ShoppingBag, CheckCircle, ArrowRight,
  ChevronRight, Tag, Plus, Minus, Trash2,
  Download, FileText,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   COUPON CODES — correct discounts
   FIRST50   = 50% off (max ₹150)
   SAVE10    = 10% off
   FREEDEL   = Free delivery (₹49 off) — already free so shown as bonus msg
   WEEKEND30 = 30% off
═══════════════════════════════════════════════════════════════════════════ */
const COUPONS = {
  FIRST50:   { type:"percent", value:50, max:150,  label:"50% Off",        desc:"50% discount applied (max ₹150)!" },
  SAVE10:    { type:"percent", value:10, max:null,  label:"10% Off",        desc:"10% discount applied!"             },
  FREEDEL:   { type:"flat",    value:49, max:null,  label:"Free Delivery",  desc:"Free delivery bonus applied!"      },
  WEEKEND30: { type:"percent", value:30, max:null,  label:"30% Off",        desc:"30% weekend discount applied!"     },
};

function calcDiscount(couponCode, subtotal) {
  const c = COUPONS[couponCode?.trim().toUpperCase()];
  if (!c) return 0;
  if (c.type === "flat")    return c.value;
  if (c.type === "percent") {
    const d = Math.round(subtotal * c.value / 100);
    return c.max ? Math.min(d, c.max) : d;
  }
  return 0;
}

/* ───────────────────────────────────────────────────────────────────────────
   generateInvoice — pure browser, no library needed.
   Opens styled A4 invoice in new tab → user chooses "Save as PDF"
─────────────────────────────────────────────────────────────────────────── */
function generateInvoice(snap) {
  const { invoiceNo, orderDate, address, items, subtotal, discount, totalPrice, couponLabel } = snap;

  const rows = items.map(it => `
    <tr>
      <td class="td">${it.name}</td>
      <td class="td tc">${it.quantity}</td>
      <td class="td tr">₹${it.price.toLocaleString("en-IN")}</td>
      <td class="td tr fw">₹${(it.price * it.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  const couponRow = discount > 0
    ? `<div class="trow green"><span>Coupon ${couponLabel ? `(${couponLabel})` : "Discount"}</span><span>−₹${discount.toLocaleString("en-IN")}</span></div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${invoiceNo} — MyApp</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Sora',Arial,sans-serif;background:#fff;color:#2C2C2C;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{width:794px;min-height:1123px;margin:0 auto;padding:52px 56px}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:2px solid #F0ECE6;margin-bottom:28px}
  .brand{display:flex;align-items:center;gap:14px}
  .brand-icon{width:52px;height:52px;background:#FF7A00;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px}
  .brand-name{font-size:28px;font-weight:900;color:#FF7A00}
  .brand-sub{font-size:12px;color:#9CA3AF;margin-top:2px}
  .inv-meta{text-align:right}
  .inv-title{font-size:30px;font-weight:900;color:#2C2C2C;letter-spacing:-.02em}
  .inv-no{font-size:13px;color:#9CA3AF;margin-top:5px}
  .inv-date{font-size:12px;color:#9CA3AF;margin-top:2px}
  .badge{display:inline-flex;align-items:center;gap:7px;background:#E8FAF0;border:1.5px solid #2ECC71;border-radius:99px;padding:8px 18px;font-size:13px;font-weight:800;color:#27AE60;margin-bottom:24px}
  .dot{width:8px;height:8px;background:#2ECC71;border-radius:50%;display:inline-block}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
  .card{background:#FFF9F2;border:1.5px solid #F0ECE6;border-radius:14px;padding:18px 20px}
  .card-lbl{font-size:10px;font-weight:800;color:#FF7A00;text-transform:uppercase;letter-spacing:.08em;margin-bottom:9px}
  .card-name{font-size:15px;font-weight:800;color:#2C2C2C;margin-bottom:5px}
  .card-txt{font-size:13px;color:#5C5C6E;line-height:1.75}
  .tbl-wrap{border:1.5px solid #F0ECE6;border-radius:14px;overflow:hidden;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  thead{background:#FF7A00}
  th{padding:12px 16px;font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.06em;text-align:left}
  th.tc{text-align:center}th.tr{text-align:right}
  .td{padding:12px 16px;border-bottom:1px solid #F0ECE6;font-size:13px;color:#2C2C2C}
  .td.tc{text-align:center;color:#5C5C6E}.td.tr{text-align:right;color:#5C5C6E}.td.fw{font-weight:700;color:#FF7A00;text-align:right}
  tr:last-child .td{border-bottom:none}
  .totals{display:flex;justify-content:flex-end;margin-bottom:28px}
  .tot-box{width:290px;background:#FFF9F2;border:1.5px solid #F0ECE6;border-radius:14px;padding:18px 20px}
  .trow{display:flex;justify-content:space-between;font-size:13px;color:#5C5C6E;margin-bottom:8px}
  .trow.green{color:#27AE60;font-weight:700}
  .tdiv{height:1px;background:#F0ECE6;margin:10px 0}
  .tgrand{display:flex;justify-content:space-between;align-items:center}
  .tgrand .lbl{font-size:15px;font-weight:900;color:#2C2C2C}
  .tgrand .val{font-size:24px;font-weight:900;color:#FF7A00}
  .ty{background:linear-gradient(135deg,#FF7A00,#FF9A3C);border-radius:16px;padding:24px 28px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
  .ty h3{font-size:18px;font-weight:900;color:#fff;margin-bottom:4px}
  .ty p{font-size:13px;color:rgba(255,255,255,.85)}
  .ty-icon{font-size:52px}
  .foot{border-top:1.5px solid #F0ECE6;padding-top:20px;display:flex;justify-content:space-between;align-items:center}
  .foot-l{font-size:12px;color:#9CA3AF}.foot-r{font-size:11px;color:#C4BAB1}
  @media print{@page{size:A4;margin:0}.page{padding:36px 44px;width:100%}}
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="brand">
      <div class="brand-icon">🍔</div>
      <div><div class="brand-name">MyApp</div><div class="brand-sub">Fresh Food Delivery Platform</div></div>
    </div>
    <div class="inv-meta">
      <div class="inv-title">INVOICE</div>
      <div class="inv-no">${invoiceNo}</div>
      <div class="inv-date">${orderDate}</div>
    </div>
  </div>
  <div class="badge"><span class="dot"></span> Payment Confirmed &nbsp;·&nbsp; Order Being Prepared</div>
  <div class="cards">
    <div class="card">
      <div class="card-lbl">Bill To</div>
      <div class="card-name">${address.fullName}</div>
      <div class="card-txt">📞 ${address.phone}<br/>${address.address}<br/>${address.city}${address.postalCode?" — "+address.postalCode:""}</div>
    </div>
    <div class="card">
      <div class="card-lbl">Delivery Details</div>
      <div class="card-txt" style="margin-top:4px">
        <strong style="color:#2C2C2C">Estimated Time</strong><br/>28–35 minutes after confirmation<br/><br/>
        <strong style="color:#2C2C2C">Delivery Fee</strong><br/>
        <span style="color:#27AE60;font-weight:700">FREE — you saved ₹49!</span>
      </div>
    </div>
  </div>
  <div class="tbl-wrap">
    <table>
      <thead>
        <tr>
          <th style="width:48%">Item</th>
          <th class="tc" style="width:14%">Qty</th>
          <th class="tr" style="width:18%">Unit Price</th>
          <th class="tr" style="width:20%">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div class="totals">
    <div class="tot-box">
      <div class="trow"><span>Subtotal</span><span>₹${subtotal.toLocaleString("en-IN")}</span></div>
      <div class="trow green"><span>Delivery Fee</span><span>FREE</span></div>
      ${couponRow}
      <div class="tdiv"></div>
      <div class="tgrand"><span class="lbl">Grand Total</span><span class="val">₹${totalPrice.toLocaleString("en-IN")}</span></div>
      ${discount>0?`<p style="font-size:11px;color:#27AE60;font-weight:700;margin-top:6px">You saved ₹${(discount+49).toLocaleString("en-IN")} on this order! 🎉</p>`:""}
    </div>
  </div>
  <div class="ty">
    <div><h3>Thank you for your order! 🙌</h3><p>Your food is being freshly prepared. Enjoy your meal!</p></div>
    <div class="ty-icon">🍽️</div>
  </div>
  <div class="foot">
    <div class="foot-l">MyApp · Fresh Food Delivery · support@myapp.com</div>
    <div class="foot-r">${invoiceNo} · ${orderDate}</div>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type:"text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      setTimeout(() => { win.focus(); win.print(); setTimeout(()=>URL.revokeObjectURL(url),120_000); }, 900);
    });
  }
}

const makeInvoiceNo = () => {
  const d  = new Date();
  const yy = d.getFullYear().toString().slice(-2);
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const rnd= Math.floor(10000+Math.random()*90000);
  return `INV-${yy}${mm}-${rnd}`;
};
const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}) +
         " at " + d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
};

/* Field must be outside Checkout component */
function Field({ icon:Icon, name, placeholder, type="text", value, onChange }) {
  return (
    <div style={{ position:"relative" }}>
      <Icon size={15} color="#C4BAB1" style={{ position:"absolute", left:14, top:type==="textarea"?14:"50%", transform:type==="textarea"?"none":"translateY(-50%)", pointerEvents:"none", zIndex:1 }}/>
      {type==="textarea"
        ? <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} className="co-textarea"/>
        : <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className="co-input"/>
      }
    </div>
  );
}

function CoStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#FFF9F2}::-webkit-scrollbar-thumb{background:#FF7A00;border-radius:99px}
      @keyframes spin-s{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes successPop{0%{transform:scale(.88);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
      @keyframes pulse{0%,100%{box-shadow:0 6px 20px rgba(255,122,0,.32)}50%{box-shadow:0 10px 32px rgba(255,122,0,.55)}}

      .co-input{width:100%;padding:12px 14px 12px 42px;background:#F8F6F3;border:1.5px solid #F0ECE6;border-radius:12px;font-family:'Sora',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;transition:border-color .2s,background .2s,box-shadow .2s}
      .co-input:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09)}
      .co-input::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;font-size:13px}
      .co-textarea{width:100%;padding:12px 14px 12px 42px;background:#F8F6F3;border:1.5px solid #F0ECE6;border-radius:12px;font-family:'Nunito',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;resize:vertical;min-height:88px;transition:border-color .2s,background .2s,box-shadow .2s}
      .co-textarea:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09)}
      .co-textarea::placeholder{color:#9CA3AF}

      .dl-invoice-btn{width:100%;padding:14px;display:flex;align-items:center;justify-content:center;gap:9px;background:#FF7A00;color:#fff;border:none;border-radius:14px;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;cursor:pointer;animation:pulse 2s ease-in-out infinite;transition:background .18s,transform .15s}
      .dl-invoice-btn:hover{background:#E06A00;transform:scale(1.02);animation:none;box-shadow:0 10px 32px rgba(255,122,0,.45)}

      @media(max-width:860px){.co-layout{grid-template-columns:1fr!important}}
      @media(max-width:480px){.co-field-row{grid-template-columns:1fr!important}}
    `}</style>
  );
}

export default function Checkout() {
  const { cartItems, clearCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const [address,    setAddress]    = useState({ fullName:"", phone:"", address:"", city:"", postalCode:"" });
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, label, desc, discount }
  const [couponErr,  setCouponErr]  = useState("");
  const [orderSnap,  setOrderSnap]  = useState(null);

  const subtotal   = cartItems.reduce((a,i) => a + i.quantity * i.price, 0);
  const discount   = appliedCoupon?.discount || 0;
  const totalPrice = Math.max(0, subtotal - discount);
  const totalItems = cartItems.reduce((a,i) => a + i.quantity, 0);

  const handleChange = e => setAddress(p => ({ ...p, [e.target.name]: e.target.value }));

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponErr("Please enter a coupon code."); return; }
    const c = COUPONS[code];
    if (!c) {
      setCouponErr("Invalid code. Try FIRST50, SAVE10, FREEDEL, or WEEKEND30.");
      setAppliedCoupon(null);
      return;
    }
    const d = calcDiscount(code, subtotal);
    setAppliedCoupon({ code, label:c.label, desc:c.desc, discount:d });
    setCouponErr("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponErr("");
  };

  const handlePayment = async () => {
    if (!address.fullName||!address.phone||!address.address||!address.city) {
      alert("Please fill in all required fields (Name, Phone, City, Address)."); return;
    }
    setLoading(true);
    try {
      await api.post("/orders", {
        items:           cartItems.map(i=>({ food:i._id, quantity:i.quantity })),
        totalAmount:     totalPrice,
        shippingAddress: address,
      });

      const snap = {
        invoiceNo:   makeInvoiceNo(),
        orderDate:   formatDate(),
        address:     { ...address },
        items:       cartItems.map(i=>({ name:i.name, quantity:i.quantity, price:i.price, thumbnail:i.thumbnail })),
        subtotal, discount, totalPrice,
        couponLabel: appliedCoupon?.label || null,
      };
      setOrderSnap(snap);
      clearCart();
      setSuccess(true);
      setTimeout(() => generateInvoice(snap), 700);

    } catch (e) {
      console.error(e);
      alert("❌ Order failed. Please try again.");
    }
    setLoading(false);
  };

  const onInc    = (e,id) => { e.preventDefault(); e.stopPropagation(); increaseQty(id); };
  const onDec    = (e,id) => { e.preventDefault(); e.stopPropagation(); decreaseQty(id); };
  const onRemove = (e,id) => { e.preventDefault(); e.stopPropagation(); removeFromCart(id); };

  /* ═══ EMPTY CART ═══ */
  if (cartItems.length===0 && !success) {
    return (
      <><CoStyles/>
        <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:"#FFF9F2", display:"flex", alignItems:"center", justifyContent:"center", padding:24, paddingTop:88 }}>
          <div style={{ textAlign:"center", background:"#fff", borderRadius:28, padding:"60px 40px", boxShadow:"0 16px 48px rgba(0,0,0,.07)", border:"2px solid #F0ECE6", maxWidth:380 }}>
            <div style={{fontSize:64,marginBottom:16}}>🛒</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#2C2C2C", marginBottom:8 }}>Your cart is empty</h2>
            <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24, fontFamily:"'Nunito',sans-serif" }}>Add some delicious food before checking out!</p>
            <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:13, padding:"12px 28px", fontWeight:800, fontSize:14, boxShadow:"0 4px 16px rgba(255,122,0,.28)" }}>
              Browse Menu <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ═══ SUCCESS SCREEN ═══ */
  if (success && orderSnap) {
    return (
      <><CoStyles/>
        <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:"#FFF9F2", display:"flex", alignItems:"center", justifyContent:"center", padding:24, paddingTop:88 }}>
          <div style={{ background:"#fff", borderRadius:28, padding:"44px 40px", boxShadow:"0 24px 64px rgba(0,0,0,.10)", border:"2px solid #A8E6C2", maxWidth:500, width:"100%", animation:"successPop .5s ease both" }}>

            <div style={{ width:80, height:80, background:"#E8FAF0", border:"3px solid #2ECC71", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(46,204,113,.22)" }}>
              <CheckCircle size={40} color="#2ECC71"/>
            </div>

            <h2 style={{ fontSize:26, fontWeight:900, color:"#2C2C2C", marginBottom:6, textAlign:"center" }}>Order Placed! 🎉</h2>
            <p style={{ fontSize:14, color:"#5C5C6E", marginBottom:4, fontFamily:"'Nunito',sans-serif", lineHeight:1.75, textAlign:"center" }}>
              Confirmed and being prepared. Estimated delivery: <strong style={{color:"#FF7A00"}}> 28–35 minutes.</strong>
            </p>

            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:99, padding:"5px 14px" }}>
                <FileText size={12} color="#FF7A00"/>
                <span style={{ fontSize:12, fontWeight:700, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif" }}>{orderSnap.invoiceNo}</span>
              </div>
            </div>

            <div style={{ background:"#FFF9F2", border:"1.5px solid #F0ECE6", borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#FF7A00", marginBottom:12, textTransform:"uppercase", letterSpacing:".06em" }}>Order Summary</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                {orderSnap.items.map((item,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <img src={item.thumbnail} alt={item.name} style={{ width:34, height:34, borderRadius:9, objectFit:"cover", flexShrink:0 }}/>
                      <span style={{ fontSize:13, color:"#2C2C2C", fontWeight:600 }}>
                        {item.name}<span style={{color:"#9CA3AF",fontWeight:400}}> × {item.quantity}</span>
                      </span>
                    </div>
                    <span style={{ fontSize:13, fontWeight:700, color:"#FF7A00", flexShrink:0 }}>₹{item.price*item.quantity}</span>
                  </div>
                ))}
              </div>
              <div style={{ height:1, background:"#F0ECE6", margin:"10px 0" }}/>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {discount>0 && (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#27AE60", fontWeight:700 }}>
                    <span>Coupon ({orderSnap.couponLabel})</span><span>−₹{discount}</span>
                  </div>
                )}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif" }}>
                    Delivering to <strong style={{color:"#2C2C2C"}}>{orderSnap.address.fullName}</strong> in <strong style={{color:"#2C2C2C"}}>{orderSnap.address.city}</strong>
                  </span>
                  <span style={{ fontSize:18, fontWeight:900, color:"#FF7A00", flexShrink:0, marginLeft:12 }}>₹{orderSnap.totalPrice}</span>
                </div>
              </div>
            </div>

            <button type="button" className="dl-invoice-btn" onClick={() => generateInvoice(orderSnap)}>
              <Download size={18}/> Download Invoice (PDF)
            </button>
            <p style={{ textAlign:"center", fontSize:11.5, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", marginTop:8, marginBottom:18 }}>
              📄 Invoice auto-generated · Click "Save as PDF" in the print dialog
            </p>

            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Link to="/my-orders" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:13, padding:"11px 22px", fontWeight:800, fontSize:13, boxShadow:"0 4px 16px rgba(255,122,0,.28)" }}>
                <ShoppingBag size={14}/> Track Order
              </Link>
              <Link to="/" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FFF9F2", color:"#5C5C6E", textDecoration:"none", borderRadius:13, padding:"11px 20px", fontWeight:700, fontSize:13, border:"1.5px solid #F0ECE6" }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══ CHECKOUT FORM ═══ */
  return (
    <><CoStyles/>
      <div style={{ fontFamily:"'Sora',sans-serif", background:"#FFF9F2", minHeight:"100vh", color:"#2C2C2C", paddingTop:64 }}>

        {/* Hero */}
        <div style={{ background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%)", padding:"40px 5vw 52px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.12) 1px,transparent 0)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,.09)", pointerEvents:"none" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
              <Link to="/" style={{color:"rgba(255,255,255,.65)",fontSize:13,fontWeight:500,textDecoration:"none"}}>Home</Link>
              <ChevronRight size={13} color="rgba(255,255,255,.45)"/>
              <Link to="/foods" style={{color:"rgba(255,255,255,.65)",fontSize:13,fontWeight:500,textDecoration:"none"}}>Menu</Link>
              <ChevronRight size={13} color="rgba(255,255,255,.45)"/>
              <span style={{color:"#fff",fontSize:13,fontWeight:700}}>Checkout</span>
            </div>
            <h1 style={{fontSize:"clamp(1.8rem,3.5vw,2.6rem)",fontWeight:900,color:"#fff",lineHeight:1.1}}>
              Almost there! 🛵<br/>
              <span style={{fontSize:"clamp(1rem,2vw,1.2rem)",fontWeight:600,opacity:.8}}>
                {totalItems} item{totalItems!==1?"s":""} · ₹{totalPrice} total
              </span>
            </h1>
          </div>
          <div style={{position:"absolute",bottom:0,left:0,right:0,lineHeight:0}}>
            <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,52 C360,0 1080,52 1440,13 L1440,52 Z" fill="#FFF9F2"/>
            </svg>
          </div>
        </div>

        <div style={{padding:"28px 5vw 72px"}}>
          <div className="co-layout" style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:22,maxWidth:1100,margin:"0 auto"}}>

            {/* ══ LEFT ══ */}
            <div style={{display:"flex",flexDirection:"column",gap:18}}>

              {/* Delivery address */}
              <div style={{background:"#fff",border:"2px solid #F0ECE6",borderRadius:22,padding:"26px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                  <div style={{width:38,height:38,background:"#FFF3E8",border:"1.5px solid #FFD4A8",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <MapPin size={18} color="#FF7A00"/>
                  </div>
                  <div>
                    <h2 style={{fontSize:15,fontWeight:900,color:"#2C2C2C",margin:0}}>Delivery Address</h2>
                    <p style={{fontSize:12,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",margin:0}}>Where should we deliver?</p>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="co-field-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Full Name *</label>
                      <Field icon={User} name="fullName" placeholder="Aryan Mehta" value={address.fullName} onChange={handleChange}/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Phone *</label>
                      <Field icon={Phone} name="phone" placeholder="+91 98765 43210" type="tel" value={address.phone} onChange={handleChange}/>
                    </div>
                  </div>
                  <div className="co-field-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>City *</label>
                      <Field icon={MapPin} name="city" placeholder="Bangalore" value={address.city} onChange={handleChange}/>
                    </div>
                    <div>
                      <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Postal Code</label>
                      <Field icon={Hash} name="postalCode" placeholder="560001" value={address.postalCode} onChange={handleChange}/>
                    </div>
                  </div>
                  <div>
                    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Full Address *</label>
                    <Field icon={Home} name="address" placeholder="Flat no., Street, Area, Landmark…" type="textarea" value={address.address} onChange={handleChange}/>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div style={{background:"#fff",border:"2px solid #F0ECE6",borderRadius:22,padding:"22px 24px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <div style={{width:38,height:38,background:"#E8FAF0",border:"1.5px solid #A8E6C2",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💳</div>
                  <div>
                    <h2 style={{fontSize:15,fontWeight:900,color:"#2C2C2C",margin:0}}>Payment Method</h2>
                    <p style={{fontSize:12,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",margin:0}}>Secure & encrypted</p>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    {id:"cod", label:"Cash on Delivery", icon:"💵", sub:"Pay when your order arrives"},
                    {id:"upi", label:"UPI / GPay / PhonePe", icon:"📱", sub:"Instant payment via UPI"},
                    {id:"card",label:"Credit / Debit Card", icon:"💳", sub:"Visa, Mastercard, RuPay"},
                  ].map((m,i)=>(
                    <label key={m.id} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:i===0?"#FFF3E8":"#FFF9F2",border:`2px solid ${i===0?"#FFD4A8":"#F0ECE6"}`,borderRadius:13,padding:"13px 15px"}}>
                      <input type="radio" name="payment" defaultChecked={i===0} style={{accentColor:"#FF7A00",width:15,height:15}}/>
                      <span style={{fontSize:20}}>{m.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:800,color:"#2C2C2C"}}>{m.label}</div>
                        <div style={{fontSize:11,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>{m.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Available coupons hint */}
              <div style={{background:"#FFF9F2",border:"1.5px solid #F0ECE6",borderRadius:16,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#FF7A00",marginBottom:10,textTransform:"uppercase",letterSpacing:".06em"}}>🎟️ Available Coupons</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {Object.entries(COUPONS).map(([code,c])=>(
                    <div key={code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff",border:"1.5px solid #F0ECE6",borderRadius:10,padding:"8px 12px"}}>
                      <div>
                        <span style={{fontSize:12,fontWeight:800,color:"#FF7A00",fontFamily:"'Sora',sans-serif"}}>{code}</span>
                        <span style={{fontSize:11,color:"#5C5C6E",fontFamily:"'Nunito',sans-serif",marginLeft:8}}>{c.label}</span>
                      </div>
                      <button type="button" onClick={()=>{ setCouponCode(code); setCouponErr(""); }}
                        style={{fontSize:10,fontWeight:800,color:"#FF7A00",background:"#FFF3E8",border:"1px solid #FFD4A8",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ RIGHT — order summary ══ */}
            <div style={{position:"relative"}}>
              <div style={{position:"sticky",top:76,background:"#fff",border:"2px solid #F0ECE6",borderRadius:22,overflow:"hidden",display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 92px)"}}>
                <div style={{overflowY:"auto",flex:1,padding:"20px 18px 0"}}>

                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                    <h2 style={{fontSize:15,fontWeight:900,color:"#2C2C2C",display:"flex",alignItems:"center",gap:7,margin:0}}>
                      <ShoppingBag size={16} color="#FF7A00"/> Order Summary
                    </h2>
                    <span style={{fontSize:12,fontWeight:700,color:"#9CA3AF"}}>{totalItems} item{totalItems!==1?"s":""}</span>
                  </div>

                  {/* Cart items */}
                  <div style={{display:"flex",flexDirection:"column",gap:0}}>
                    {cartItems.map((item,idx)=>(
                      <div key={item._id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:idx<cartItems.length-1?"1px solid #F0ECE6":"none"}}>
                        <div style={{position:"relative",flexShrink:0}}>
                          <img src={item.thumbnail} alt={item.name} style={{width:50,height:50,borderRadius:10,objectFit:"cover",display:"block"}}/>
                          <div style={{position:"absolute",top:-5,right:-5,width:17,height:17,background:"#FF7A00",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff",border:"2px solid #fff"}}>
                            {item.quantity}
                          </div>
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:12.5,fontWeight:700,color:"#2C2C2C",margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</p>
                          <p style={{fontSize:11,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",margin:"0 0 6px"}}>₹{item.price} each</p>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <button type="button" onClick={e=>onDec(e,item._id)} style={{width:24,height:24,flexShrink:0,background:"#FFF9F2",border:"1.5px solid #F0ECE6",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.borderColor="#FECACA";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="#FFF9F2";e.currentTarget.style.borderColor="#F0ECE6";}}>
                              <Minus size={10} color="#5C5C6E"/>
                            </button>
                            <span style={{fontSize:13,fontWeight:800,color:"#2C2C2C",minWidth:18,textAlign:"center",userSelect:"none"}}>{item.quantity}</span>
                            <button type="button" onClick={e=>onInc(e,item._id)} style={{width:24,height:24,flexShrink:0,background:"#FFF3E8",border:"1.5px solid #FFD4A8",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#FFE8CC";e.currentTarget.style.borderColor="#FF7A00";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="#FFF3E8";e.currentTarget.style.borderColor="#FFD4A8";}}>
                              <Plus size={10} color="#FF7A00"/>
                            </button>
                            <button type="button" onClick={e=>onRemove(e,item._id)} style={{width:24,height:24,flexShrink:0,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginLeft:1}}
                              onMouseEnter={e=>{e.currentTarget.style.background="#EF4444";e.currentTarget.style.borderColor="#EF4444";}}
                              onMouseLeave={e=>{e.currentTarget.style.background="#FEF2F2";e.currentTarget.style.borderColor="#FECACA";}}>
                              <Trash2 size={9} color="#EF4444"/>
                            </button>
                          </div>
                        </div>
                        <span style={{fontSize:13,fontWeight:900,color:"#FF7A00",flexShrink:0}}>₹{item.price*item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/foods" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"8px",background:"#FFF9F2",border:"1.5px dashed #FFD4A8",borderRadius:10,textDecoration:"none",color:"#FF7A00",fontSize:11.5,fontWeight:700,marginTop:12,marginBottom:14}}
                    onMouseEnter={e=>e.currentTarget.style.background="#FFF3E8"} onMouseLeave={e=>e.currentTarget.style.background="#FFF9F2"}>
                    <Plus size={12}/> Add more items
                  </Link>

                  {/* ── Coupon input ── */}
                  {!appliedCoupon ? (
                    <div style={{marginBottom:8}}>
                      <div style={{display:"flex",gap:7,marginBottom:4}}>
                        <div style={{position:"relative",flex:1}}>
                          <Tag size={11} color="#C4BAB1" style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                          <input placeholder="Enter coupon code" value={couponCode}
                            onChange={e=>{setCouponCode(e.target.value.toUpperCase());setCouponErr("");}}
                            onKeyDown={e=>e.key==="Enter"&&applyCoupon()}
                            style={{width:"100%",padding:"9px 10px 9px 28px",background:"#FFF9F2",border:`1.5px solid ${couponErr?"#FECACA":"#F0ECE6"}`,borderRadius:9,fontFamily:"'Sora',sans-serif",fontSize:12,color:"#2C2C2C",outline:"none"}}/>
                        </div>
                        <button type="button" onClick={applyCoupon}
                          style={{background:"#FF7A00",color:"#fff",border:"none",borderRadius:9,padding:"0 13px",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                          Apply
                        </button>
                      </div>
                      {couponErr && <p style={{fontSize:11,color:"#EF4444",fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>{couponErr}</p>}
                    </div>
                  ) : (
                    <div style={{background:"#E8FAF0",border:"1.5px solid #2ECC71",borderRadius:10,padding:"10px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:800,color:"#27AE60"}}>🎉 {appliedCoupon.desc}</div>
                        <div style={{fontSize:11,color:"#27AE60",fontFamily:"'Nunito',sans-serif"}}>Code: {appliedCoupon.code}</div>
                      </div>
                      <button type="button" onClick={removeCoupon} style={{background:"none",border:"none",cursor:"pointer",color:"#DC2626",fontSize:16,fontWeight:800,padding:"0 4px"}}>×</button>
                    </div>
                  )}

                  {/* Totals */}
                  <div style={{background:"#FFF9F2",borderRadius:12,padding:"12px 13px",marginTop:8,marginBottom:10}}>
                    {[
                      {label:"Subtotal", val:`₹${subtotal}`, color:"#2C2C2C"},
                      {label:"Delivery", val:"FREE",          color:"#27AE60"},
                      ...(discount>0?[{label:`Coupon (${appliedCoupon?.label})`, val:`-₹${discount}`, color:"#27AE60"}]:[]),
                    ].map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                        <span style={{fontSize:12.5,color:"#5C5C6E",fontFamily:"'Nunito',sans-serif"}}>{r.label}</span>
                        <span style={{fontSize:12.5,fontWeight:700,color:r.color}}>{r.val}</span>
                      </div>
                    ))}
                    <div style={{height:1,background:"#F0ECE6",margin:"8px 0"}}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:14,fontWeight:900,color:"#2C2C2C"}}>Total</span>
                      <span style={{fontSize:19,fontWeight:900,color:"#FF7A00"}}>₹{totalPrice}</span>
                    </div>
                    {discount>0 && <p style={{fontSize:11,color:"#27AE60",fontWeight:700,margin:"5px 0 0",fontFamily:"'Nunito',sans-serif"}}>You save ₹{discount+49} total 🎉</p>}
                  </div>

                  <div style={{display:"flex",alignItems:"center",gap:6,background:"#FFF8E1",border:"1px solid rgba(255,195,0,.40)",borderRadius:9,padding:"7px 10px",marginBottom:12}}>
                    <span style={{fontSize:12}}>🎉</span>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:11,fontWeight:700,color:"#92670A"}}>Free delivery — save ₹49!</span>
                  </div>
                </div>

                {/* Place Order */}
                <div style={{padding:"12px 18px 16px",borderTop:"1px solid #F0ECE6",background:"#fff",flexShrink:0}}>
                  <button type="button" onClick={handlePayment} disabled={loading||cartItems.length===0}
                    style={{width:"100%",padding:"13px",background:loading||cartItems.length===0?"#FFC470":"#FF7A00",color:"#fff",border:"none",borderRadius:13,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:800,cursor:loading||cartItems.length===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:loading?"none":"0 6px 20px rgba(255,122,0,.30)",transition:"background .18s"}}
                    onMouseEnter={e=>{if(!loading&&cartItems.length>0)e.currentTarget.style.background="#E06A00";}}
                    onMouseLeave={e=>{if(!loading&&cartItems.length>0)e.currentTarget.style.background="#FF7A00";}}>
                    {loading
                      ? <svg style={{animation:"spin-s .8s linear infinite"}} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/></svg>
                      : <><span>🔒</span> Place Order · ₹{totalPrice}</>
                    }
                  </button>
                  <p style={{textAlign:"center",fontSize:10.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",marginTop:7}}>🔒 SSL secured · Invoice generated automatically</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}