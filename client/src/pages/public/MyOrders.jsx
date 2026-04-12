import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  ShoppingBag, MapPin, CreditCard, Clock,
  ChevronDown, ChevronUp, ArrowRight, Package,
  RefreshCw, Download, FileText,
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

const STEPS = ["confirmed","preparing","out_for_delivery","delivered"];
function stepIndex(status) { return STEPS.indexOf(status?.toLowerCase()); }

/* ─────────────────────────────────────────────────────────────────────────────
   generateOrderInvoice — builds invoice HTML from an existing order record.
   Status-aware: shows correct watermark (DELIVERED / PAID / CANCELLED / etc.)
───────────────────────────────────────────────────────────────────────────── */
function generateOrderInvoice(order) {
  const orderStatus   = order.orderStatus?.toLowerCase()   || "pending";
  const paymentStatus = order.paymentStatus?.toLowerCase() || "pending";

  /* ── Watermark / badge based on combined status ── */
  let watermarkText  = "";
  let watermarkColor = "";
  let statusBadge    = "";
  let badgeColor     = "";
  let badgeBg        = "";

  if (orderStatus === "cancelled") {
    watermarkText  = "CANCELLED";
    watermarkColor = "rgba(220,38,38,0.08)";
    statusBadge    = "❌ Order Cancelled";
    badgeColor     = "#DC2626";
    badgeBg        = "#FEF2F2";
  } else if (orderStatus === "delivered" && paymentStatus === "paid") {
    watermarkText  = "PAID & DELIVERED";
    watermarkColor = "rgba(39,174,96,0.07)";
    statusBadge    = "🎉 Delivered · ✅ Paid";
    badgeColor     = "#27AE60";
    badgeBg        = "#E8FAF0";
  } else if (orderStatus === "delivered") {
    watermarkText  = "DELIVERED";
    watermarkColor = "rgba(39,174,96,0.07)";
    statusBadge    = "🎉 Order Delivered";
    badgeColor     = "#27AE60";
    badgeBg        = "#E8FAF0";
  } else if (paymentStatus === "paid") {
    watermarkText  = "PAID";
    watermarkColor = "rgba(37,99,235,0.07)";
    statusBadge    = "✅ Payment Confirmed";
    badgeColor     = "#2563EB";
    badgeBg        = "#EFF6FF";
  } else if (orderStatus === "out_for_delivery") {
    watermarkText  = "OUT FOR DELIVERY";
    watermarkColor = "rgba(124,58,237,0.07)";
    statusBadge    = "🛵 Out for Delivery";
    badgeColor     = "#7C3AED";
    badgeBg        = "#F5EEFF";
  } else if (orderStatus === "preparing") {
    watermarkText  = "PREPARING";
    watermarkColor = "rgba(255,122,0,0.07)";
    statusBadge    = "👨‍🍳 Being Prepared";
    badgeColor     = "#E06A00";
    badgeBg        = "#FFF3E8";
  } else if (orderStatus === "confirmed") {
    watermarkText  = "CONFIRMED";
    watermarkColor = "rgba(37,99,235,0.07)";
    statusBadge    = "✅ Order Confirmed";
    badgeColor     = "#2563EB";
    badgeBg        = "#EFF6FF";
  } else {
    watermarkText  = "PENDING";
    watermarkColor = "rgba(184,134,11,0.07)";
    statusBadge    = "⏳ Order Pending";
    badgeColor     = "#B8860B";
    badgeBg        = "#FFF8E1";
  }

  const invoiceNo = `INV-${order._id?.slice(-8).toUpperCase() || "XXXXXXXX"}`;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN",{ day:"2-digit", month:"long", year:"numeric" }) +
      " at " + new Date(order.createdAt).toLocaleTimeString("en-IN",{ hour:"2-digit", minute:"2-digit" })
    : new Date().toLocaleDateString("en-IN",{ day:"2-digit", month:"long", year:"numeric" });

  const addr = order.shippingAddress || {};

  const rows = (order.items || []).map(item => {
    const name  = item.food?.name  || "Food Item";
    const price = item.food?.price || 0;
    const qty   = item.quantity    || 1;
    return `
      <tr>
        <td class="td">${name}</td>
        <td class="td tc">${qty}</td>
        <td class="td tr">₹${price.toLocaleString("en-IN")}</td>
        <td class="td tr fw">₹${(price * qty).toLocaleString("en-IN")}</td>
      </tr>`;
  }).join("");

  const total = order.totalAmount || 0;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${invoiceNo} — MyApp</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Sora',Arial,sans-serif;background:#fff;color:#2C2C2C;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{width:794px;min-height:1123px;margin:0 auto;padding:52px 56px;position:relative}

  /* watermark */
  .watermark{
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);
    font-size:72px;font-weight:900;color:${watermarkColor};
    white-space:nowrap;pointer-events:none;z-index:0;letter-spacing:.06em;
    text-transform:uppercase;
  }

  .content{position:relative;z-index:1}

  /* header */
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:2px solid #F0ECE6;margin-bottom:28px}
  .brand{display:flex;align-items:center;gap:14px}
  .brand-icon{width:52px;height:52px;background:#FF7A00;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px}
  .brand-name{font-size:28px;font-weight:900;color:#FF7A00}
  .brand-sub{font-size:12px;color:#9CA3AF;margin-top:2px}
  .inv-meta{text-align:right}
  .inv-title{font-size:30px;font-weight:900;color:#2C2C2C;letter-spacing:-.02em}
  .inv-no{font-size:13px;color:#9CA3AF;margin-top:5px}
  .inv-date{font-size:12px;color:#9CA3AF;margin-top:2px}

  /* status badge */
  .badge{
    display:inline-flex;align-items:center;gap:8px;
    background:${badgeBg};border:2px solid ${badgeColor}40;
    border-radius:99px;padding:8px 18px;font-size:13px;font-weight:800;
    color:${badgeColor};margin-bottom:24px;
  }

  /* cards */
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
  .card{background:#FFF9F2;border:1.5px solid #F0ECE6;border-radius:14px;padding:18px 20px}
  .card-lbl{font-size:10px;font-weight:800;color:#FF7A00;text-transform:uppercase;letter-spacing:.08em;margin-bottom:9px}
  .card-name{font-size:15px;font-weight:800;color:#2C2C2C;margin-bottom:5px}
  .card-txt{font-size:13px;color:#5C5C6E;line-height:1.75}

  /* table */
  .tbl-wrap{border:1.5px solid #F0ECE6;border-radius:14px;overflow:hidden;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  thead{background:#FF7A00}
  th{padding:12px 16px;font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:.06em;text-align:left}
  th.tc{text-align:center} th.tr{text-align:right}
  .td{padding:12px 16px;border-bottom:1px solid #F0ECE6;font-size:13px;color:#2C2C2C}
  .td.tc{text-align:center;color:#5C5C6E}
  .td.tr{text-align:right;color:#5C5C6E}
  .td.fw{font-weight:700;color:#FF7A00;text-align:right}
  tr:last-child .td{border-bottom:none}

  /* totals */
  .totals{display:flex;justify-content:flex-end;margin-bottom:28px}
  .tot-box{width:280px;background:#FFF9F2;border:1.5px solid #F0ECE6;border-radius:14px;padding:18px 20px}
  .trow{display:flex;justify-content:space-between;font-size:13px;color:#5C5C6E;margin-bottom:8px}
  .trow.green{color:#27AE60;font-weight:700}
  .tdiv{height:1px;background:#F0ECE6;margin:10px 0}
  .tgrand{display:flex;justify-content:space-between;align-items:center}
  .tgrand .lbl{font-size:15px;font-weight:900;color:#2C2C2C}
  .tgrand .val{font-size:24px;font-weight:900;color:#FF7A00}

  /* status info box */
  .status-box{background:${badgeBg};border:1.5px solid ${badgeColor}40;border-radius:14px;padding:18px 20px;margin-bottom:28px;display:flex;align-items:center;gap:14px}
  .status-box-icon{font-size:32px}
  .status-box-text h4{font-size:14px;font-weight:800;color:${badgeColor};margin-bottom:3px}
  .status-box-text p{font-size:12px;color:#5C5C6E;line-height:1.6}

  /* footer */
  .foot{border-top:1.5px solid #F0ECE6;padding-top:20px;display:flex;justify-content:space-between;align-items:center}
  .foot-l{font-size:12px;color:#9CA3AF}
  .foot-r{font-size:11px;color:#C4BAB1}

  @media print{
    @page{size:A4;margin:0}
    .page{padding:36px 44px;width:100%}
  }
</style>
</head>
<body>
<div class="page">
  <div class="watermark">${watermarkText}</div>
  <div class="content">

    <!-- Header -->
    <div class="hdr">
      <div class="brand">
        <div class="brand-icon">🍔</div>
        <div>
          <div class="brand-name">MyApp</div>
          <div class="brand-sub">Fresh Food Delivery Platform</div>
        </div>
      </div>
      <div class="inv-meta">
        <div class="inv-title">INVOICE</div>
        <div class="inv-no">${invoiceNo}</div>
        <div class="inv-date">${orderDate}</div>
      </div>
    </div>

    <!-- Status badge -->
    <div class="badge">${statusBadge}</div>

    <!-- Bill To & Status card -->
    <div class="cards">
      <div class="card">
        <div class="card-lbl">Bill To</div>
        <div class="card-name">${addr.fullName || "Customer"}</div>
        <div class="card-txt">
          ${addr.phone ? `📞 ${addr.phone}<br/>` : ""}
          ${addr.address ? `${addr.address}<br/>` : ""}
          ${addr.city ? addr.city : ""}${addr.postalCode ? ` — ${addr.postalCode}` : ""}
        </div>
      </div>
      <div class="card">
        <div class="card-lbl">Order Details</div>
        <div class="card-txt">
          <strong style="color:#2C2C2C">Order Status</strong><br/>
          <span style="color:${badgeColor};font-weight:700">${statusBadge}</span><br/><br/>
          <strong style="color:#2C2C2C">Payment</strong><br/>
          <span style="color:${paymentStatus==="paid"?"#27AE60":paymentStatus==="failed"?"#DC2626":"#B8860B"};font-weight:700">
            ${paymentStatus === "paid" ? "✅ Paid" : paymentStatus === "failed" ? "❌ Failed" : "⏳ Pending"}
          </span>
        </div>
      </div>
    </div>

    <!-- Items table -->
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
        <tbody>${rows || `<tr><td class="td" colspan="4" style="text-align:center;color:#9CA3AF">No item details available</td></tr>`}</tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="totals">
      <div class="tot-box">
        <div class="trow"><span>Subtotal</span><span>₹${total.toLocaleString("en-IN")}</span></div>
        <div class="trow green"><span>Delivery Fee</span><span>FREE</span></div>
        <div class="tdiv"></div>
        <div class="tgrand">
          <span class="lbl">Grand Total</span>
          <span class="val">₹${total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <!-- Status message box -->
    <div class="status-box">
      <div class="status-box-icon">
        ${orderStatus === "delivered" ? "🎉" : orderStatus === "cancelled" ? "❌" : orderStatus === "out_for_delivery" ? "🛵" : orderStatus === "preparing" ? "👨‍🍳" : "✅"}
      </div>
      <div class="status-box-text">
        <h4>${statusBadge}</h4>
        <p>
          ${orderStatus === "delivered"
            ? "Your order has been successfully delivered. Thank you for ordering with MyApp!"
            : orderStatus === "cancelled"
            ? "This order was cancelled. If you have questions, please contact support."
            : orderStatus === "out_for_delivery"
            ? "Your order is on the way! Expected delivery in 20–30 minutes."
            : orderStatus === "preparing"
            ? "Your order is being freshly prepared by our kitchen team."
            : "Your order has been confirmed and is being processed."}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="foot">
      <div class="foot-l">MyApp · Fresh Food Delivery · support@myapp.com</div>
      <div class="foot-r">${invoiceNo} · ${orderDate}</div>
    </div>

  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type:"text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      setTimeout(() => {
        win.focus();
        win.print();
        setTimeout(() => URL.revokeObjectURL(url), 120_000);
      }, 900);
    });
  }
}

/* ── Download button label based on status ── */
function getInvoiceLabel(order) {
  const os = order.orderStatus?.toLowerCase();
  const ps = order.paymentStatus?.toLowerCase();
  if (os === "cancelled")        return { label:"Cancelled Invoice",  icon:"❌", color:"#DC2626", bg:"#FEF2F2", border:"#FECACA" };
  if (os === "delivered" && ps === "paid") return { label:"Delivered · Paid Invoice", icon:"🎉", color:"#27AE60", bg:"#E8FAF0", border:"#A8E6C2" };
  if (os === "delivered")        return { label:"Delivered Invoice",  icon:"🎉", color:"#27AE60", bg:"#E8FAF0", border:"#A8E6C2" };
  if (ps === "paid")             return { label:"Paid Invoice",       icon:"✅", color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE" };
  if (os === "out_for_delivery") return { label:"On the Way",         icon:"🛵", color:"#7C3AED", bg:"#F5EEFF", border:"#D8B4FE" };
  if (os === "preparing")        return { label:"Preparing Invoice",  icon:"👨‍🍳", color:"#E06A00", bg:"#FFF3E8", border:"#FFD4A8" };
  if (os === "confirmed")        return { label:"Confirmed Invoice",  icon:"✅", color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE" };
  return                                { label:"Pending Invoice",    icon:"⏳", color:"#B8860B", bg:"#FFF8E1", border:"#FFE57A" };
}

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
      /* ── FIX: leading slash required ── */
      const res  = await api.get("/orders/my-orders");
      const raw  = res.data.data;
      const data = Array.isArray(raw) ? raw : raw ? [raw] : [];
      setOrders(data.filter(Boolean));
    } catch (e) {
      console.error("fetchOrders error:", e);
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
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#FFF9F2}::-webkit-scrollbar-thumb{background:#FF7A00;border-radius:99px}
        @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
        @keyframes spin-s  {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse-d {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.55}}
        @keyframes shimmer {0%{background-position:-600px 0}100%{background-position:600px 0}}

        .mo-page{font-family:'Sora',sans-serif;min-height:100vh;background:#FFF9F2;color:#2C2C2C;padding-top:64px}
        .mo-hero{background:linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%);padding:52px 5vw 72px;position:relative;overflow:hidden}
        .mo-card{background:#fff;border:2px solid #F0ECE6;border-radius:22px;overflow:hidden;transition:border-color .2s,box-shadow .2s;animation:fadeUp .4s ease both}
        .mo-card:hover{border-color:#FFD4A8;box-shadow:0 10px 32px rgba(255,122,0,.09)}
        .mo-expand{background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:#FF7A00;padding:6px 11px;border-radius:9px;transition:background .15s}
        .mo-expand:hover{background:#FFF3E8}
        .mo-skel{background:linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%);background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:10px}
        .mo-item{display:flex;align-items:center;gap:13px;padding:12px 14px;background:#fff;border-radius:14px;border:1.5px solid #F0ECE6;transition:border-color .15s}
        .mo-item:hover{border-color:#FFD4A8}

        /* invoice download button */
        .inv-dl-btn{
          display:inline-flex;align-items:center;gap:7px;
          border:none;border-radius:10px;padding:9px 16px;
          font-family:'Sora',sans-serif;font-size:12px;font-weight:800;
          cursor:pointer;transition:all .18s;white-space:nowrap;
        }
        .inv-dl-btn:hover{transform:scale(1.03);filter:brightness(.93)}

        @media(max-width:600px){
          .mo-card-top{flex-direction:column!important}
          .mo-meta-row{flex-direction:column!important;gap:6px!important}
          .mo-stats-row{flex-wrap:wrap!important;gap:12px!important}
          .mo-ship-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <div className="mo-page">

        {/* ══ HERO ══ */}
        <section className="mo-hero">
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.11) 1px,transparent 0)", backgroundSize:"26px 26px", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:-90, right:-90, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,.09)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-60, left:-60, width:250, height:250, borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"12%", right:"5%", width:140, height:140, borderRadius:"50%", border:"2px dashed rgba(255,255,255,.22)", animation:"spin-s 28s linear infinite", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:18, background:"rgba(255,255,255,.20)", border:"1.5px solid rgba(255,255,255,.35)", borderRadius:99, padding:"7px 16px", backdropFilter:"blur(8px)" }}>
              <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-d 1.5s ease infinite" }}/>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>Real-time order tracking</span>
            </div>
            <h1 style={{ fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:10 }}>My Orders 📦</h1>
            <p style={{ color:"rgba(255,255,255,.82)", fontSize:14, fontFamily:"'Nunito',sans-serif", fontWeight:500, maxWidth:440, lineHeight:1.75, marginBottom:orders.length>0?24:0 }}>
              Track your orders, download invoices, and reorder your favourites.
            </p>
            {!loading && orders.length > 0 && (
              <div className="mo-stats-row" style={{ display:"flex", gap:0, flexWrap:"wrap" }}>
                {[
                  { val:orders.length,       label:"Total Orders" },
                  { val:`₹${totalSpent}`,     label:"Total Spent"  },
                  { val:delivered,            label:"Delivered"    },
                  { val:orders.length-delivered, label:"In Progress" },
                ].map((s,i) => (
                  <div key={i} style={{ paddingRight:24, marginRight:24, borderRight:i<3?"1px solid rgba(255,255,255,.22)":"none" }}>
                    <div style={{ fontSize:"clamp(1.1rem,2vw,1.4rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.val}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", marginTop:3, fontWeight:600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 52" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,52 C360,0 1080,52 1440,13 L1440,52 Z" fill="#FFF9F2"/>
            </svg>
          </div>
        </section>


        {/* ══ CONTENT ══ */}
        <section style={{ padding:"32px 5vw 72px", maxWidth:920, margin:"0 auto" }}>

          {/* Loading */}
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background:"#fff", border:"2px solid #F0ECE6", borderRadius:22, padding:"24px 22px", display:"flex", flexDirection:"column", gap:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div className="mo-skel" style={{ height:14, width:"35%" }}/>
                    <div className="mo-skel" style={{ height:24, width:"16%", borderRadius:99 }}/>
                  </div>
                  <div className="mo-skel" style={{ height:11, width:"55%" }}/>
                  <div className="mo-skel" style={{ height:36 }}/>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:24, border:"2px solid #FECACA" }}>
              <div style={{fontSize:48,marginBottom:14}}>⚠️</div>
              <h3 style={{ fontSize:18, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>Something went wrong</h3>
              <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:20, fontFamily:"'Nunito',sans-serif" }}>{error}</p>
              <button type="button" onClick={fetchOrders} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", border:"none", borderRadius:12, padding:"11px 26px", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}>
                <RefreshCw size={14}/> Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff", borderRadius:24, border:"2px solid #F0ECE6" }}>
              <div style={{fontSize:64,marginBottom:16}}>📦</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>No orders yet</h3>
              <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24, fontFamily:"'Nunito',sans-serif", lineHeight:1.7 }}>
                You haven't placed any orders yet.<br/>Browse our menu and get your first meal delivered!
              </p>
              <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:13, padding:"13px 30px", fontWeight:800, fontSize:14, boxShadow:"0 6px 20px rgba(255,122,0,.30)" }}>
                Browse Menu <ArrowRight size={15}/>
              </Link>
            </div>
          )}

          {/* Order cards */}
          {!loading && !error && orders.length > 0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {orders.map((order, idx) => {
                const st          = getStatus(order.orderStatus);
                const isOpen      = !!expanded[order._id];
                const si          = stepIndex(order.orderStatus);
                const isDelivered = order.orderStatus?.toLowerCase() === "delivered";
                const isCancelled = order.orderStatus?.toLowerCase() === "cancelled";
                const showStepper = !["pending","cancelled"].includes(order.orderStatus?.toLowerCase());
                const invLabel    = getInvoiceLabel(order);

                return (
                  <div key={order._id} className="mo-card" style={{ animationDelay:`${Math.min(idx*.06,.3)}s` }}>

                    {/* Card top */}
                    <div className="mo-card-top" style={{ padding:"20px 22px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                          <div style={{ width:40, height:40, background:st.bg, border:`2px solid ${st.border}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                            {st.icon}
                          </div>
                          <div>
                            <div style={{ fontSize:11.5, fontWeight:800, color:"#9CA3AF", letterSpacing:".06em", textTransform:"uppercase", marginBottom:4 }}>
                              Order #{order._id?.slice(-8).toUpperCase()}
                            </div>
                            <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:st.dot, display:"block", flexShrink:0, animation:!isDelivered&&!isCancelled?"pulse-d 1.5s ease infinite":"none" }}/>
                              <span style={{ fontSize:12.5, fontWeight:800, color:st.color, background:st.bg, border:`1.5px solid ${st.border}`, borderRadius:99, padding:"3px 11px" }}>
                                {st.label}
                              </span>
                            </div>
                          </div>
                        </div>

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
                              {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                        <span style={{ fontSize:22, fontWeight:900, color:"#FF7A00" }}>₹{order.totalAmount}</span>
                        <button className="mo-expand" onClick={() => toggle(order._id)}>
                          <Package size={12}/>
                          {isOpen ? "Hide" : "View"} Details
                          {isOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                        </button>
                      </div>
                    </div>

                    {/* Stepper */}
                    {showStepper && (
                      <div style={{ padding:"0 22px 18px" }}>
                        <div style={{ display:"flex", alignItems:"center" }}>
                          {STEPS.map((step, i) => {
                            const done = i <= si;
                            const sc   = getStatus(step);
                            return (
                              <React.Fragment key={step}>
                                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:"0 0 auto" }}>
                                  <div style={{ width:30, height:30, borderRadius:"50%", background:done?sc.dot:"#F0ECE6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:done?"#fff":"#9CA3AF", transition:"background .3s", boxShadow:done?`0 2px 10px ${sc.dot}55`:"none" }}>
                                    {done ? "✓" : i+1}
                                  </div>
                                  <div style={{ fontSize:9.5, fontWeight:700, color:done?sc.color:"#9CA3AF", textTransform:"capitalize", whiteSpace:"nowrap", letterSpacing:".02em" }}>
                                    {step.replace(/_/g," ")}
                                  </div>
                                </div>
                                {i < STEPS.length-1 && (
                                  <div style={{ flex:1, height:2, background:i<si?"#2ECC71":"#F0ECE6", margin:"0 5px 14px", borderRadius:99, transition:"background .3s" }}/>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Cancelled ribbon */}
                    {isCancelled && (
                      <div style={{ margin:"0 22px 16px", background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{fontSize:14}}>❌</span>
                        <span style={{ fontSize:13, fontWeight:700, color:"#DC2626", fontFamily:"'Nunito',sans-serif" }}>This order was cancelled.</span>
                      </div>
                    )}

                    {/* Expanded panel */}
                    {isOpen && (
                      <div style={{ borderTop:"1.5px solid #F0ECE6", background:"#FFF9F2", padding:"18px 22px", animation:"fadeIn .2s ease" }}>

                        {/* Items */}
                        <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", letterSpacing:".07em", textTransform:"uppercase", marginBottom:12 }}>
                          Order Items ({order.items?.length || 0})
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
                          {order.items?.length > 0 ? order.items.map((item, i) => (
                            <div key={i} className="mo-item">
                              {item.food?.thumbnail && (
                                <img src={item.food.thumbnail} alt={item.food?.name||"Food"} style={{ width:52, height:52, borderRadius:12, objectFit:"cover", flexShrink:0 }}/>
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
                                ₹{(item.food?.price||0)*item.quantity}
                              </span>
                            </div>
                          )) : (
                            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>No item details available.</p>
                          )}
                        </div>

                        {/* Total */}
                        <div style={{ background:"#fff", border:"1.5px solid #F0ECE6", borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                          <span style={{ fontSize:14, fontWeight:800, color:"#2C2C2C" }}>Order Total</span>
                          <span style={{ fontSize:18, fontWeight:900, color:"#FF7A00" }}>₹{order.totalAmount}</span>
                        </div>

                        {/* Shipping */}
                        {order.shippingAddress && (
                          <div style={{ background:"#fff", border:"1.5px solid #F0ECE6", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
                            <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", letterSpacing:".06em", textTransform:"uppercase", marginBottom:10 }}>Shipping Details</div>
                            <div className="mo-ship-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                              {[
                                { label:"Name",    val:order.shippingAddress.fullName   },
                                { label:"Phone",   val:order.shippingAddress.phone      },
                                { label:"City",    val:order.shippingAddress.city       },
                                { label:"Pincode", val:order.shippingAddress.postalCode },
                              ].filter(f=>f.val).map((f,i)=>(
                                <div key={i}>
                                  <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>{f.label}</div>
                                  <div style={{ fontSize:13, fontWeight:700, color:"#2C2C2C" }}>{f.val}</div>
                                </div>
                              ))}
                            </div>
                            {order.shippingAddress.address && (
                              <div style={{ marginTop:10 }}>
                                <div style={{ fontSize:10, fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 }}>Address</div>
                                <div style={{ fontSize:13, fontWeight:600, color:"#5C5C6E", fontFamily:"'Nunito',sans-serif", lineHeight:1.6 }}>
                                  {order.shippingAddress.address}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>

                          {/* ── Download Invoice button — label changes based on status ── */}
                          <button
                            type="button"
                            className="inv-dl-btn"
                            onClick={() => generateOrderInvoice(order)}
                            style={{ background:invLabel.bg, color:invLabel.color, border:`1.5px solid ${invLabel.border}` }}>
                            <Download size={13}/>
                            <FileText size={13}/>
                            {invLabel.icon} {invLabel.label}
                          </button>

                          {isDelivered && (
                            <Link to="/foods" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", textDecoration:"none", borderRadius:10, padding:"9px 18px", fontWeight:800, fontSize:12, boxShadow:"0 4px 14px rgba(255,122,0,.26)" }}>
                              🔁 Reorder
                            </Link>
                          )}
                          <Link to="/contact" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FFF3E8", color:"#FF7A00", textDecoration:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, fontSize:12, border:"1.5px solid #FFD4A8" }}>
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

          {!loading && orders.length > 0 && (
            <p style={{ textAlign:"center", fontSize:12, color:"#9CA3AF", marginTop:28, fontFamily:"'Nunito',sans-serif" }}>
              Showing all {orders.length} order{orders.length!==1?"s":""}
            </p>
          )}
        </section>
      </div>
    </>
  );
}