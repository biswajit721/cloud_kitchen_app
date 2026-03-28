import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, Star, Clock,
  X, Flame, ArrowRight, ChevronRight,
  MapPin, Shield, Zap, Gift, ChefHat, Leaf
} from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

/* ─── Styles ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #FFF9F2; }
    ::-webkit-scrollbar-thumb { background: #FF7A00; border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-12px) rotate(1deg); }
    }
    @keyframes floatR {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50%       { transform: translateY(-8px) rotate(-1deg); }
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.4); opacity: 0.6; }
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes popIn {
      0%   { transform: scale(0.85); opacity: 0; }
      70%  { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* Hover states */
    .food-card { transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease !important; }
    .food-card:hover { transform: translateY(-7px) !important; box-shadow: 0 20px 48px rgba(255,122,0,0.13) !important; }
    .offer-card { transition: transform 0.2s ease, box-shadow 0.2s ease !important; }
    .offer-card:hover { transform: translateY(-5px) !important; box-shadow: 0 24px 56px rgba(0,0,0,0.15) !important; }
    .cat-pill { transition: all 0.18s ease; }
    .cat-pill:hover { border-color: #FF7A00 !important; color: #FF7A00 !important; background: #FFF3E8 !important; }
    .cat-pill.active { background: #FF7A00 !important; color: #fff !important; border-color: #FF7A00 !important; }
    .add-btn { transition: all 0.18s ease; }
    .add-btn:hover { background: #E06A00 !important; transform: scale(1.02); }
    .hero-food-card { transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease; }
    .hero-food-card:hover { transform: translateY(-8px) scale(1.03) !important; box-shadow: 0 24px 56px rgba(0,0,0,0.28) !important; }
    .why-card { transition: transform 0.22s ease, box-shadow 0.22s ease !important; }
    .why-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.09) !important; }
    .footer-link:hover { color: #FF7A00 !important; }
    .app-btn:hover { background: rgba(255,255,255,0.14) !important; transform: translateY(-3px); }

    /* Mobile responsive */
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .hero-right { display: none !important; }
      .hero-left { padding: 60px 5vw 52px !important; }
      .offer-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
      .why-grid { grid-template-columns: 1fr 1fr !important; }
      .footer-grid { grid-template-columns: 1fr 1fr !important; }
      .app-btns { flex-direction: column !important; }
      .app-banner-inner { flex-direction: column !important; gap: 28px !important; }
      .stats-row { flex-wrap: wrap; gap: 16px !important; }
      .stats-item { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; }
    }
    @media (max-width: 600px) {
      .why-grid { grid-template-columns: 1fr !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .hero-h1 { font-size: 2.4rem !important; }
      .section-title { font-size: 1.5rem !important; }
      .food-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
    }
    @media (max-width: 480px) {
      .offer-grid { grid-template-columns: 1fr !important; }
      .food-grid { grid-template-columns: 1fr 1fr !important; }
      .filter-row { flex-direction: column !important; align-items: stretch !important; }
      .search-box { width: 100% !important; }
    }
  `}</style>
);

/* Color tokens */
const C = {
  orange: "#FF7A00",
  orangeDark: "#E06A00",
  orangeLight: "#FFF3E8",
  orangeMid: "#FF9A3C",
  green: "#2ECC71",
  greenLight: "#E8FAF0",
  greenDark: "#27AE60",
  yellow: "#FFC300",
  yellowLight: "#FFF8E1",
  cream: "#FFF9F2",
  white: "#FFFFFF",
  textDark: "#2C2C2C",
  textMid: "#5C5C6E",
  textLight: "#9CA3AF",
  border: "#F0ECE6",
  navy: "#1A1A2E",
  navyMid: "#16213E",
};

export default function Home() {
  const { user }                        = useAuth();
  const { addToCart, cartItems }        = useCart();

  const [foods,          setFoods]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedFood,   setSelectedFood]   = useState(null);
  const [selectedImage,  setSelectedImage]  = useState(null);
  const [addedId,        setAddedId]        = useState(null);
  const [heroVisible,    setHeroVisible]    = useState(false);
  const [searchFocused,  setSearchFocused]  = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/food");
        setFoods(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
    setTimeout(() => setHeroVisible(true), 80);
  }, []);

  const categories = ["All", ...new Set(foods.map(f => f.category).filter(Boolean))];
  const filtered = foods.filter(f => {
    const q = searchQuery.toLowerCase();
    return (
      (f.name.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q)) &&
      (activeCategory === "All" || f.category?.toLowerCase() === activeCategory.toLowerCase())
    );
  });

  /* ── Show only first 8 on Home; Full Menu shows everything ── */
  const PREVIEW_COUNT = 8;
  const previewFoods  = filtered.slice(0, PREVIEW_COUNT);
  const hasMore       = filtered.length > PREVIEW_COUNT;

  const handleAdd = (food, e) => {
    e?.stopPropagation();
    addToCart(food);
    setAddedId(food._id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const openModal  = food => { setSelectedFood(food); setSelectedImage(food.thumbnail); };
  const closeModal = ()   => { setSelectedFood(null); setSelectedImage(null); };

  const cartCount = cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
  const heroFoods = foods.slice(0, 6);
  const trendingFoods = foods.filter(f => f.isTrending);

  return (
    <>
      <FontLink />
      <div style={{ fontFamily: "'Sora', sans-serif", background: C.cream, width: "100%", overflowX: "hidden", color: C.textDark }}>

        {/* ══════════════ HERO ══════════════ */}
        <section style={{
          width: "100%",
          minHeight: "100vh",
          background: `linear-gradient(135deg, #FF7A00 0%, #FF9A3C 40%, #FFB347 100%)`,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute", top:-120, right:-120, width:500, height:500, borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-160, left:-80, width:400, height:400, borderRadius:"50%", background:"rgba(255,255,255,0.06)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:"30%", left:"38%", width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>

          {/* Dot pattern */}
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
            backgroundSize:"28px 28px",
            pointerEvents:"none",
          }}/>

          <div className="hero-grid" style={{
            display:"grid", gridTemplateColumns:"1fr 1fr",
            width:"100%", minHeight:"100vh",
            position:"relative", zIndex:1,
          }}>
            {/* LEFT */}
            <div className="hero-left" style={{
              display:"flex", flexDirection:"column", justifyContent:"center",
              padding:"80px 48px 80px 5vw",
              animation: heroVisible ? "fadeUp 0.7s ease both" : "none",
            }}>
              {/* Live badge */}
              <div style={{
                display:"inline-flex", alignItems:"center", gap:8, marginBottom:28,
                background:"rgba(255,255,255,0.22)", border:"1.5px solid rgba(255,255,255,0.38)",
                borderRadius:99, padding:"8px 18px", width:"fit-content",
                backdropFilter:"blur(8px)",
              }}>
                <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-dot 1.5s ease infinite", flexShrink:0 }}/>
                <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:"0.03em" }}>
                  Live · Delivering in 500+ cities
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-h1" style={{
                fontSize:"clamp(2.8rem, 5vw, 5rem)", fontWeight:900,
                lineHeight:1.06, letterSpacing:"-0.03em",
                color:"#fff", marginBottom:20,
              }}>
                Crave it.<br/>
                <span style={{
                  background:"linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                  backgroundClip:"text", WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                }}>
                  Order it.
                </span><br/>
                Love it. 🍔
              </h1>

              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(0.95rem,1.3vw,1.1rem)", lineHeight:1.8, maxWidth:440, marginBottom:36, fontFamily:"'Nunito', sans-serif", fontWeight:500 }}>
                Fresh, hot meals from hundreds of local restaurants — delivered to your door in under 30 minutes.
              </p>

              {/* Location bar */}
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                background:"#fff", borderRadius:18,
                padding:"6px 6px 6px 18px",
                boxShadow:"0 20px 60px rgba(0,0,0,0.18)",
                maxWidth:480, marginBottom:24,
              }}>
                <MapPin size={17} color={C.orange} style={{flexShrink:0}}/>
                <input placeholder="Enter delivery address…"
                  style={{ border:"none", outline:"none", fontSize:14, color:C.textDark, flex:1, background:"transparent", fontFamily:"'Sora', sans-serif" }}
                />
                <button style={{
                  background: C.orange, color:"#fff", border:"none",
                  borderRadius:13, padding:"11px 22px",
                  fontSize:13, fontWeight:800, cursor:"pointer",
                  fontFamily:"'Sora', sans-serif", flexShrink:0,
                  transition:"background 0.2s",
                }}
                  onMouseEnter={e=>e.target.style.background=C.orangeDark}
                  onMouseLeave={e=>e.target.style.background=C.orange}
                >
                  Find Food →
                </button>
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:44 }}>
                {user ? (
                  <>
                    <Link to="/foods" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:"#fff", color:C.orange,
                      fontWeight:800, fontSize:14, padding:"13px 26px",
                      borderRadius:14, textDecoration:"none",
                      boxShadow:"0 8px 28px rgba(0,0,0,0.14)",
                      fontFamily:"'Sora', sans-serif",
                      transition:"transform 0.15s, box-shadow 0.15s",
                    }}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.18)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.14)";}}
                    >
                      <ShoppingCart size={15}/> Browse Menu
                    </Link>
                    {user.role !== "admin" && (
                      <Link to="/my-orders" style={{
                        display:"inline-flex", alignItems:"center", gap:8,
                        background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.45)",
                        color:"#fff", fontWeight:700, fontSize:14, padding:"13px 24px",
                        borderRadius:14, textDecoration:"none", fontFamily:"'Sora', sans-serif",
                        transition:"background 0.15s",
                      }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.26)"}
                        onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.18)"}
                      >
                        My Orders
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link to="/admin" style={{
                        display:"inline-flex", alignItems:"center", gap:8,
                        background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.45)",
                        color:"#fff", fontWeight:700, fontSize:14, padding:"13px 24px",
                        borderRadius:14, textDecoration:"none", fontFamily:"'Sora', sans-serif",
                      }}>
                        Admin Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:"#fff", color:C.orange,
                      fontWeight:800, fontSize:14, padding:"13px 26px",
                      borderRadius:14, textDecoration:"none",
                      boxShadow:"0 8px 28px rgba(0,0,0,0.14)",
                      fontFamily:"'Sora', sans-serif",
                    }}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                    >
                      Get Started Free <ArrowRight size={14}/>
                    </Link>
                    <Link to="/login" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.45)",
                      color:"#fff", fontWeight:700, fontSize:14, padding:"13px 24px",
                      borderRadius:14, textDecoration:"none", fontFamily:"'Sora', sans-serif",
                    }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="stats-row" style={{ display:"flex", gap:0, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.22)" }}>
                {[
                  { v:`${foods.length||"50"}+`, l:"Menu Items" },
                  { v:"28 min",  l:"Avg Delivery" },
                  { v:"2M+",    l:"Happy Users"  },
                  { v:"4.9★",   l:"App Rating"   },
                ].map((s, i) => (
                  <div className="stats-item" key={i} style={{
                    paddingRight:28, marginRight:28,
                    borderRight: i < 3 ? "1px solid rgba(255,255,255,0.25)" : "none",
                  }}>
                    <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:4, fontWeight:600 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — food card mosaic */}
            <div className="hero-right" style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"80px 5vw 80px 20px", position:"relative",
              animation: heroVisible ? "fadeIn 0.9s 0.3s ease both" : "none",
              opacity: heroVisible ? 1 : 0,
            }}>
              {/* Spinning ring decoration */}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                transform:"translate(-50%,-50%)",
                width:360, height:360, borderRadius:"50%",
                border:"2px dashed rgba(255,255,255,0.20)",
                animation:"spin-slow 30s linear infinite",
                pointerEvents:"none",
              }}/>

              <div style={{
                display:"grid", gridTemplateColumns:"repeat(3,1fr)",
                gap:14, width:"100%", maxWidth:420, position:"relative", zIndex:1,
              }}>
                {loading
                  ? Array.from({length:6}).map((_, i) => (
                      <div key={i} style={{
                        background:"rgba(255,255,255,0.15)", borderRadius:20, height:160,
                        transform:`translateY(${[0,-28,14,-14,28,-6][i]||0}px)`,
                      }}/>
                    ))
                  : heroFoods.map((food, i) => (
                      <div key={food._id} className="hero-food-card" onClick={() => openModal(food)}
                        style={{
                          background:"rgba(255,255,255,0.18)",
                          backdropFilter:"blur(16px)",
                          border:"1.5px solid rgba(255,255,255,0.30)",
                          borderRadius:20, overflow:"hidden", cursor:"pointer",
                          transform:`translateY(${[0,-28,14,-14,28,-6][i]||0}px)`,
                          boxShadow:"0 8px 32px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div style={{height:108, overflow:"hidden"}}>
                          <img src={food.thumbnail} alt={food.name}
                            style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}}
                            onMouseEnter={e=>e.target.style.transform="scale(1.1)"}
                            onMouseLeave={e=>e.target.style.transform="scale(1)"}
                          />
                        </div>
                        <div style={{padding:"10px 12px"}}>
                          <p style={{color:"#fff",fontSize:11,fontWeight:700,margin:"0 0 3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{food.name}</p>
                          <p style={{color:"rgba(255,255,255,0.85)",fontSize:12,fontWeight:900,margin:0}}>₹{food.price}</p>
                        </div>
                      </div>
                    ))
                }
              </div>

              {/* Floating badges */}
              <div style={{
                position:"absolute", top:72, left:0,
                background:"#fff", borderRadius:18, padding:"12px 16px",
                display:"flex", alignItems:"center", gap:10,
                boxShadow:"0 16px 48px rgba(0,0,0,0.16)", zIndex:10,
                animation:"float 4s ease-in-out infinite",
              }}>
                <div style={{width:38,height:38,background:C.greenLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⚡</div>
                <div>
                  <div style={{fontSize:10,color:C.textLight,fontWeight:600}}>Fast Delivery</div>
                  <div style={{fontSize:13,color:C.textDark,fontWeight:800}}>Under 28 mins</div>
                </div>
              </div>

              <div style={{
                position:"absolute", bottom:88, right:0,
                background:"#fff", borderRadius:18, padding:"12px 16px",
                display:"flex", alignItems:"center", gap:10,
                boxShadow:"0 16px 48px rgba(0,0,0,0.16)", zIndex:10,
                animation:"floatR 4s 1.4s ease-in-out infinite",
              }}>
                <div style={{width:38,height:38,background:C.yellowLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⭐</div>
                <div>
                  <div style={{fontSize:10,color:C.textLight,fontWeight:600}}>Top Rated</div>
                  <div style={{fontSize:13,color:C.textDark,fontWeight:800}}>4.9 / 5.0</div>
                </div>
              </div>

              <div style={{
                position:"absolute", bottom:160, left:12,
                background:"#fff", borderRadius:18, padding:"12px 16px",
                display:"flex", alignItems:"center", gap:10,
                boxShadow:"0 16px 48px rgba(0,0,0,0.12)", zIndex:10,
                animation:"float 5s 0.8s ease-in-out infinite",
              }}>
                <div style={{width:38,height:38,background:C.orangeLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌿</div>
                <div>
                  <div style={{fontSize:10,color:C.textLight,fontWeight:600}}>Fresh & Healthy</div>
                  <div style={{fontSize:13,color:C.textDark,fontWeight:800}}>Farm to Door</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,80 C360,0 1080,80 1440,20 L1440,80 Z" fill={C.cream}/>
            </svg>
          </div>
        </section>


        {/* ══════════════ MARQUEE ══════════════ */}
        <div style={{ width:"100%", background:C.navy, overflow:"hidden", padding:"13px 0", userSelect:"none" }}>
          <div style={{ display:"flex", animation:"marquee 24s linear infinite", width:"max-content" }}>
            {Array.from({length:4}).flatMap(() => [
              "🎉 50% Off First Order — FIRST50",
              "🛵 Free Delivery This Week",
              "⚡ Under 30 Minutes Guaranteed",
              "🍔 500+ Restaurants Now Live",
              "⭐ Rated 4.9 by 2 Million Users",
              "🌿 Fresh & Healthy Options Available",
            ]).map((t, i) => (
              <span key={i} style={{
                color:"rgba(255,255,255,0.80)", fontSize:12, fontWeight:600,
                paddingRight:52, whiteSpace:"nowrap",
                display:"inline-flex", alignItems:"center",
                fontFamily:"'Nunito', sans-serif",
              }}>
                {t}<span style={{marginLeft:52,color:C.orange}}>◆</span>
              </span>
            ))}
          </div>
        </div>


        {/* ══════════════ OFFER BANNERS ══════════════ */}
        <section style={{ width:"100%", background:C.cream, padding:"52px 5vw" }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <span style={{
              display:"inline-block", background:C.yellowLight, border:`1px solid ${C.yellow}`,
              color:"#B8860B", fontSize:11, fontWeight:800, letterSpacing:"0.08em",
              textTransform:"uppercase", padding:"5px 14px", borderRadius:99, marginBottom:12,
            }}>🔥 Hot Deals</span>
            <h2 className="section-title" style={{ fontSize:"clamp(1.6rem,2.5vw,2.2rem)", fontWeight:900, color:C.textDark }}>
              Today's Best Offers
            </h2>
          </div>

          <div className="offer-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {[
              {
                code:"FIRST50", desc:"50% off your very first order", sub:"New users only · Max ₹150",
                emoji:"🎊",
                bg:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 100%)",
                accent:"rgba(255,255,255,0.25)", textColor:"#fff",
              },
              {
                code:"FREEDEL", desc:"Free delivery on all orders this week", sub:"No minimum cart value",
                emoji:"🛵",
                bg:"linear-gradient(135deg, #FFC300 0%, #FFD740 100%)",
                accent:"rgba(255,255,255,0.30)", textColor:C.textDark,
              },
              {
                code:"WEEKEND30", desc:"30% off every Saturday & Sunday", sub:"Use before midnight Sunday",
                emoji:"🎉",
                bg:"linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
                accent:"rgba(255,255,255,0.25)", textColor:"#fff",
              },
            ].map(o => (
              <div key={o.code} className="offer-card" style={{
                background:o.bg, borderRadius:24, padding:"28px 30px",
                cursor:"pointer", position:"relative", overflow:"hidden",
                boxShadow:"0 6px 24px rgba(0,0,0,0.10)",
              }}>
                {/* Deco circle */}
                <div style={{position:"absolute",right:-50,top:-50,width:180,height:180,borderRadius:"50%",background:o.accent,pointerEvents:"none"}}/>
                <div style={{position:"absolute",right:20,top:14,fontSize:48,opacity:0.22,pointerEvents:"none"}}>{o.emoji}</div>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{
                    display:"inline-block",
                    background:"rgba(255,255,255,0.28)", backdropFilter:"blur(8px)",
                    color:o.textColor, fontSize:10, fontWeight:800,
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    padding:"4px 12px", borderRadius:99, marginBottom:12,
                  }}>
                    Limited Time
                  </div>
                  <div style={{fontSize:48,marginBottom:2}}>{o.emoji}</div>
                  <div style={{color:o.textColor, fontSize:"clamp(1.6rem,2.6vw,2.2rem)", fontWeight:900, letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:8}}>
                    {o.code}
                  </div>
                  <div style={{color:o.textColor, fontSize:14, fontWeight:600, opacity:0.9, marginBottom:4}}>{o.desc}</div>
                  <div style={{color:o.textColor, fontSize:11, opacity:0.65}}>{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════ SEARCH + FILTER (sticky) ══════════════ */}
        <div style={{
          width:"100%", background:"#fff",
          borderBottom:`1px solid ${C.border}`,
          position:"sticky", top:64, zIndex:40,
          boxShadow:"0 2px 20px rgba(255,122,0,0.07)",
        }}>
          <div className="filter-row" style={{ width:"100%", padding:"12px 5vw", display:"flex", alignItems:"center", gap:14 }}>
            {/* Search */}
            <div className="search-box" style={{
              display:"flex", alignItems:"center", gap:10,
              background:searchFocused ? C.orangeLight : "#F9F7F4",
              border:`1.5px solid ${searchFocused ? C.orange : C.border}`,
              borderRadius:14, padding:"10px 16px", width:270, flexShrink:0,
              transition:"all 0.2s",
            }}>
              <Search size={14} color={searchFocused ? C.orange : C.textLight} style={{flexShrink:0}}/>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search dishes, categories…"
                style={{ border:"none", outline:"none", background:"transparent", fontSize:13, color:C.textDark, width:"100%", fontFamily:"'Sora', sans-serif" }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{background:"none",border:"none",cursor:"pointer",color:C.textLight,display:"flex",padding:0}}>
                  <X size={12}/>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div style={{ display:"flex", gap:8, overflowX:"auto", flex:1, scrollbarWidth:"none", paddingBottom:2 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`cat-pill${activeCategory === cat ? " active" : ""}`}
                  style={{
                    flexShrink:0, padding:"8px 18px", borderRadius:99,
                    fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Sora', sans-serif",
                    border:`1.5px solid ${activeCategory === cat ? C.orange : C.border}`,
                    background: activeCategory === cat ? C.orange : "#fff",
                    color: activeCategory === cat ? "#fff" : C.textMid,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* ══════════════ TRENDING STRIP ══════════════ */}
        {!loading && trendingFoods.length > 0 && (
          <section style={{ width:"100%", background:"#fff", padding:"44px 0 32px" }}>
            <div style={{ padding:"0 5vw", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, background:"#FFF3E8", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Flame size={18} color={C.orange}/>
                </div>
                <h2 style={{ fontSize:20, fontWeight:900, color:C.textDark, margin:0 }}>Trending Now</h2>
                <span style={{
                  fontSize:11, fontWeight:800,
                  background:C.yellowLight, color:"#B8860B",
                  border:`1px solid ${C.yellow}`, borderRadius:99, padding:"3px 10px",
                }}>
                  {trendingFoods.length} items
                </span>
              </div>
              <Link to="/foods" style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:700, color:C.orange, textDecoration:"none" }}>
                See all <ChevronRight size={14}/>
              </Link>
            </div>

            <div style={{
              display:"flex", gap:16, overflowX:"auto",
              scrollbarWidth:"none", padding:"0 5vw 4px",
            }}>
              {trendingFoods.map(food => (
                <div key={food._id} onClick={() => openModal(food)}
                  style={{
                    flexShrink:0, width:185, background:"#fff",
                    border:`1.5px solid ${C.border}`, borderRadius:20,
                    overflow:"hidden", cursor:"pointer",
                    boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
                    transition:"transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 14px 36px rgba(255,122,0,0.12)"; e.currentTarget.style.borderColor=C.orange; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor=C.border; }}
                >
                  <div style={{ height:124, overflow:"hidden", position:"relative" }}>
                    <img src={food.thumbnail} alt={food.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" }}
                      onMouseEnter={e=>e.target.style.transform="scale(1.08)"}
                      onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    />
                    <div style={{
                      position:"absolute", top:8, left:8,
                      background:C.orange, color:"#fff",
                      fontSize:10, fontWeight:800,
                      padding:"3px 9px", borderRadius:99,
                      display:"flex", alignItems:"center", gap:3,
                    }}>
                      <Flame size={8}/> Trending
                    </div>
                  </div>
                  <div style={{ padding:"11px 13px" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:C.textDark, margin:"0 0 5px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{food.name}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:14, fontWeight:900, color:C.orange }}>₹{food.price}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.textLight }}>
                        <Star size={9} fill={C.yellow} color={C.yellow}/> 4.5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ══════════════ MAIN FOOD GRID ══════════════ */}
        <section style={{ width:"100%", background:C.cream, padding:"44px 5vw 72px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
            <div>
              <h2 className="section-title" style={{ fontSize:"clamp(1.4rem,2.2vw,1.9rem)", fontWeight:900, color:C.textDark, margin:"0 0 5px" }}>
                {activeCategory === "All" ? "All Menu Items" : activeCategory}
                <span style={{ fontSize:14, fontWeight:500, color:C.textLight, marginLeft:8 }}>
                  ({hasMore ? `Showing ${PREVIEW_COUNT} of ${filtered.length}` : filtered.length})
                </span>
              </h2>
              {searchQuery && (
                <p style={{ fontSize:13, color:C.textMid, margin:0, fontFamily:"'Nunito', sans-serif" }}>
                  Results for <strong style={{color:C.orange}}>"{searchQuery}"</strong>
                </p>
              )}
            </div>
            <Link to="/foods" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:C.orange, textDecoration:"none" }}>
              Full Menu <ArrowRight size={14}/>
            </Link>
          </div>

          {/* Skeletons */}
          {loading && (
            <div className="food-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
              {Array.from({length:12}).map((_, i) => (
                <div key={i} style={{ background:"#fff", borderRadius:20, overflow:"hidden", border:`1px solid ${C.border}` }}>
                  <div style={{ height:164, background:"linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%)", backgroundSize:"400px 100%", animation:"shimmer 1.4s infinite" }}/>
                  <div style={{ padding:14 }}>
                    <div style={{ height:13, background:"#f5f0ea", borderRadius:6, width:"72%", marginBottom:8 }}/>
                    <div style={{ height:11, background:"#f9f7f4", borderRadius:6, width:"50%", marginBottom:14 }}/>
                    <div style={{ height:38, background:"#f9f7f4", borderRadius:12 }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff", borderRadius:24, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:60, marginBottom:16 }}>🍽️</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:C.textDark, marginBottom:8 }}>Nothing found</h3>
              <p style={{ color:C.textLight, fontSize:14, marginBottom:24 }}>
                {searchQuery ? `No results for "${searchQuery}"` : "No items in this category yet."}
              </p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                style={{ background:C.orange, color:"#fff", border:"none", borderRadius:12, padding:"11px 30px", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Sora', sans-serif" }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.length > 0 && (
            <>
              <div className="food-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
                {previewFoods.map(food => (
                <div key={food._id} className="food-card"
                  style={{
                    background:"#fff", borderRadius:20,
                    border:`1.5px solid ${C.border}`, overflow:"hidden",
                    boxShadow:"0 2px 10px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Image */}
                  <div style={{ height:164, overflow:"hidden", cursor:"pointer", position:"relative" }}
                    onClick={() => openModal(food)}
                  >
                    <img src={food.thumbnail} alt={food.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" }}
                      onMouseEnter={e=>e.target.style.transform="scale(1.07)"}
                      onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    />
                    {/* Category pill */}
                    <div style={{
                      position:"absolute", top:10, left:10,
                      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(6px)",
                      color:C.green, fontSize:10, fontWeight:800,
                      padding:"4px 10px", borderRadius:99,
                      boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
                      display:"flex", alignItems:"center", gap:4,
                    }}>
                      <Leaf size={9} color={C.green}/> {food.category}
                    </div>
                    {/* Veg/Price badge */}
                    {food.isVeg && (
                      <div style={{
                        position:"absolute", top:10, right:10,
                        width:22, height:22,
                        background:"#fff", border:`2px solid ${C.green}`,
                        borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <div style={{ width:10, height:10, background:C.green, borderRadius:"50%" }}/>
                      </div>
                    )}
                  </div>

                  <div style={{ padding:"14px 16px 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                      <h3 style={{ fontSize:14, fontWeight:800, color:C.textDark, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                        {food.name}
                      </h3>
                      <span style={{ fontSize:15, fontWeight:900, color:C.orange, flexShrink:0 }}>₹{food.price}</span>
                    </div>

                    <p style={{
                      fontSize:12, color:C.textLight, margin:"0 0 10px",
                      overflow:"hidden", display:"-webkit-box",
                      WebkitLineClamp:2, WebkitBoxOrient:"vertical", lineHeight:1.6,
                      fontFamily:"'Nunito', sans-serif",
                    }}>
                      {food.description}
                    </p>

                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.textMid }}>
                        <Star size={10} fill={C.yellow} color={C.yellow}/> 4.5
                      </span>
                      <span style={{ width:1, height:11, background:C.border }}/>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.textMid }}>
                        <Clock size={10}/> 25–35 min
                      </span>
                      {food.isTrending && (
                        <>
                          <span style={{ width:1, height:11, background:C.border }}/>
                          <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:10, color:C.orange, fontWeight:700 }}>
                            <Flame size={9}/> Hot
                          </span>
                        </>
                      )}
                    </div>

                    {user ? (
                      <button onClick={e => handleAdd(food, e)} className={addedId === food._id ? "" : "add-btn"}
                        style={{
                          width:"100%", padding:"10px 0",
                          background: addedId === food._id ? C.green : C.orange,
                          color:"#fff", border:"none", borderRadius:12,
                          fontSize:13, fontWeight:700, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          fontFamily:"'Sora', sans-serif",
                          boxShadow: addedId === food._id ? `0 4px 16px rgba(46,204,113,0.35)` : `0 4px 16px rgba(255,122,0,0.28)`,
                          transition:"background 0.2s, box-shadow 0.2s",
                        }}
                      >
                        {addedId === food._id ? <>✓ Added to Cart</> : <><ShoppingCart size={13}/> Add to Cart</>}
                      </button>
                    ) : (
                      <Link to="/login" style={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        width:"100%", padding:"10px 0",
                        background:C.cream, color:C.textMid,
                        border:`1.5px solid ${C.border}`, borderRadius:12,
                        fontSize:13, fontWeight:700, textDecoration:"none",
                        fontFamily:"'Sora', sans-serif", boxSizing:"border-box",
                        transition:"all 0.15s",
                      }}
                        onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.orange; }}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMid; }}
                      >
                        🔒 Login to Order
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── View All CTA — only shown when there are more items ── */}
            {hasMore && (
              <div style={{ textAlign:"center", marginTop:36 }}>
                <p style={{ fontSize:13, color:C.textLight, fontFamily:"'Nunito',sans-serif", marginBottom:16 }}>
                  Showing <strong style={{color:C.textDark}}>{PREVIEW_COUNT}</strong> of <strong style={{color:C.textDark}}>{filtered.length}</strong> items
                </p>
                <Link to="/foods" style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:C.orange, color:"#fff", textDecoration:"none",
                  borderRadius:14, padding:"13px 32px",
                  fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:14,
                  boxShadow:"0 6px 20px rgba(255,122,0,0.30)",
                  transition:"background 0.18s, transform 0.15s",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=C.orangeDark; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=C.orange; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  View All {filtered.length} Items <ArrowRight size={15}/>
                </Link>
              </div>
            )}
            </>
          )}
        </section>


        {/* ══════════════ WHY US ══════════════ */}
        <section style={{ width:"100%", background:"#fff", padding:"72px 5vw" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={{
              display:"inline-block",
              background:C.greenLight, border:`1px solid ${C.green}`,
              color:C.greenDark, fontSize:11, fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
              padding:"5px 16px", borderRadius:99, marginBottom:14,
            }}>
              Why Choose Us
            </span>
            <h2 className="section-title" style={{ fontSize:"clamp(1.7rem,2.8vw,2.4rem)", fontWeight:900, color:C.textDark, margin:"0 0 12px" }}>
              Built for food lovers 🍕
            </h2>
            <p style={{ color:C.textMid, fontSize:15, maxWidth:420, margin:"0 auto", fontFamily:"'Nunito', sans-serif", lineHeight:1.75 }}>
              Every feature built around one promise — delicious food, lightning delivery, zero hassle.
            </p>
          </div>

          <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[
              { Icon:Zap,     title:"Lightning Fast",  desc:"Average delivery under 28 minutes with real-time GPS tracking on every single order.",
                bg:C.orangeLight, border:"#FFD4A8", iconBg:"#FFE0BC", iconColor:C.orange },
              { Icon:ChefHat, title:"Chef Verified",   desc:"Every restaurant is quality-checked and approved before joining our platform.",
                bg:C.greenLight, border:"#A8E6C2", iconBg:"#C2F0D4", iconColor:C.greenDark },
              { Icon:Shield,  title:"Safe Checkout",   desc:"PCI-compliant encrypted payments. UPI, cards, netbanking and wallets all accepted.",
                bg:"#EFF6FF", border:"#BFDBFE", iconBg:"#DBEAFE", iconColor:"#2563EB" },
              { Icon:Gift,    title:"Daily Deals",     desc:"Fresh exclusive offers every single day — huge savings for new users and loyal customers.",
                bg:C.yellowLight, border:"#FFE57A", iconBg:"#FFF3B0", iconColor:"#B8860B" },
            ].map(({ Icon, ...v }, i) => (
              <div key={i} className="why-card"
                style={{
                  background:v.bg, border:`2px solid ${v.border}`,
                  borderRadius:24, padding:"30px 24px",
                }}
              >
                <div style={{ width:52, height:52, background:v.iconBg, border:`1.5px solid ${v.border}`, borderRadius:15, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <Icon size={24} color={v.iconColor}/>
                </div>
                <h3 style={{ fontSize:16, fontWeight:800, color:C.textDark, marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:13, color:C.textMid, lineHeight:1.75, margin:0, fontFamily:"'Nunito', sans-serif" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════ APP BANNER ══════════════ */}
        <section style={{
          width:"100%",
          background:`linear-gradient(135deg, #FF7A00 0%, #FF9A3C 50%, #FFB347 100%)`,
          padding:"68px 5vw", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-60, left:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>

          <div className="app-banner-inner" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:40, position:"relative", zIndex:1, flexWrap:"wrap" }}>
            <div style={{ maxWidth:500 }}>
              <span style={{
                display:"inline-block",
                background:"rgba(255,255,255,0.22)", border:"1px solid rgba(255,255,255,0.40)",
                color:"#fff", fontSize:11, fontWeight:800,
                letterSpacing:"0.08em", textTransform:"uppercase",
                padding:"5px 14px", borderRadius:99, marginBottom:20,
              }}>
                📱 Mobile App
              </span>
              <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.8rem)", fontWeight:900, color:"#fff", lineHeight:1.12, marginBottom:14 }}>
                Order faster.<br/>
                <span style={{ color:"rgba(255,255,255,0.75)" }}>Get rewarded.</span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.80)", fontSize:15, lineHeight:1.8, maxWidth:400, fontFamily:"'Nunito', sans-serif" }}>
                Exclusive app deals, real-time tracking & one-tap reorder. Available on iOS & Android.
              </p>
            </div>

            <div className="app-btns" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[
                { icon:"🍎", store:"App Store",   sub:"Download on the" },
                { icon:"🤖", store:"Google Play", sub:"Get it on"       },
              ].map(app => (
                <button key={app.store} className="app-btn"
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    background:"rgba(255,255,255,0.18)",
                    border:"1.5px solid rgba(255,255,255,0.38)",
                    borderRadius:18, padding:"16px 24px",
                    cursor:"pointer", fontFamily:"'Sora', sans-serif",
                    transition:"background 0.2s, transform 0.15s",
                  }}
                >
                  <span style={{ fontSize:32 }}>{app.icon}</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.60)", fontWeight:500 }}>{app.sub}</div>
                    <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{app.store}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════ FOOTER ══════════════ */}
        <footer style={{ width:"100%", background:C.navy, padding:"60px 5vw 28px" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:36, marginBottom:48 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:36, height:36, background:C.orange, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🍔</div>
                <span style={{ fontSize:22, fontWeight:900, color:C.orange }}>MyApp</span>
              </div>
              <p style={{ color:"#475569", fontSize:14, lineHeight:1.8, maxWidth:240, fontFamily:"'Nunito', sans-serif" }}>
                Delivering happiness to your doorstep, one fresh meal at a time. 🧡
              </p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["📘","🐦","📸","▶️"].map((icon, i) => (
                  <div key={i} style={{
                    width:36, height:36, background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.10)",
                    borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, cursor:"pointer", transition:"background 0.15s",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,122,0,0.15)"}
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
                <h4 style={{ color:"rgba(255,255,255,0.50)", fontSize:10, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:20 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:12 }}>
                  {col.links.map(l => (
                    <li key={l.l}>
                      <Link to={l.to} className="footer-link"
                        style={{ color:"#4B5563", fontSize:14, textDecoration:"none", transition:"color 0.15s", fontFamily:"'Nunito', sans-serif" }}
                      >
                        {l.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop:"1px solid #1E293B", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito', sans-serif" }}>© 2026 MyApp. All rights reserved.</p>
            <p style={{ color:"#2D3748", fontSize:13, margin:0, fontFamily:"'Nunito', sans-serif" }}>Made with 🧡 for food lovers</p>
          </div>
        </footer>


        {/* ══════════════ FOOD DETAIL MODAL ══════════════ */}
        {selectedFood && (
          <div style={{
            position:"fixed", inset:0, zIndex:9999,
            background:"rgba(0,0,0,0.60)", backdropFilter:"blur(10px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"16px", animation:"fadeIn 0.2s ease",
          }} onClick={closeModal}>
            <div style={{
              background:"#fff", width:"100%", maxWidth:520,
              borderRadius:28, overflow:"hidden",
              boxShadow:"0 40px 100px rgba(0,0,0,0.35)",
              maxHeight:"92vh", overflowY:"auto",
              position:"relative", animation:"popIn 0.3s ease both",
            }} onClick={e => e.stopPropagation()}>

              <button onClick={closeModal} style={{
                position:"absolute", top:14, right:14, zIndex:10,
                width:34, height:34, background:"rgba(255,255,255,0.95)",
                border:"none", borderRadius:"50%", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 10px rgba(0,0,0,0.16)",
                transition:"background 0.15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="#FFF3E8"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.95)"}
              >
                <X size={14} color={C.textMid}/>
              </button>

              <img src={selectedImage} alt={selectedFood.name}
                style={{ width:"100%", height:260, objectFit:"cover", display:"block" }}
              />

              {/* Thumbnail strip */}
              {[selectedFood.thumbnail, ...(selectedFood.images || [])].length > 1 && (
                <div style={{ display:"flex", gap:8, padding:"14px 20px 0", flexWrap:"wrap" }}>
                  {[selectedFood.thumbnail, ...(selectedFood.images || [])].map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setSelectedImage(img)}
                      style={{
                        width:52, height:52, objectFit:"cover", borderRadius:10, cursor:"pointer",
                        border: selectedImage === img ? `2.5px solid ${C.orange}` : `2px solid ${C.border}`,
                        transition:"border-color 0.15s",
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ padding:"20px 24px 28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <h2 style={{ fontSize:22, fontWeight:900, color:C.textDark, margin:0 }}>{selectedFood.name}</h2>
                  <span style={{ fontSize:22, fontWeight:900, color:C.orange }}>₹{selectedFood.price}</span>
                </div>

                <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:4,
                    fontSize:11, fontWeight:700,
                    background:C.greenLight, color:C.greenDark,
                    border:`1px solid ${C.green}`,
                    padding:"4px 12px", borderRadius:99,
                  }}>
                    <Leaf size={9}/> {selectedFood.category}
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.textMid, padding:"4px 12px", background:C.yellowLight, borderRadius:99, border:`1px solid ${C.yellow}` }}>
                    <Star size={9} fill={C.yellow} color={C.yellow}/> 4.5 Rating
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:C.textMid, padding:"4px 12px", background:C.cream, borderRadius:99, border:`1px solid ${C.border}` }}>
                    <Clock size={9}/> 25–35 min
                  </span>
                </div>

                <p style={{ color:C.textMid, fontSize:14, lineHeight:1.8, marginBottom:24, fontFamily:"'Nunito', sans-serif" }}>{selectedFood.description}</p>

                {user ? (
                  <button
                    onClick={() => { handleAdd(selectedFood); closeModal(); }}
                    style={{
                      width:"100%", padding:"14px 0",
                      background:C.orange, color:"#fff",
                      border:"none", borderRadius:16,
                      fontSize:15, fontWeight:800, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      fontFamily:"'Sora', sans-serif",
                      boxShadow:`0 8px 28px rgba(255,122,0,0.35)`,
                      transition:"background 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=C.orangeDark; e.currentTarget.style.transform="scale(1.01)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background=C.orange; e.currentTarget.style.transform="scale(1)"; }}
                  >
                    <ShoppingCart size={18}/> Add to Cart
                  </button>
                ) : (
                  <Link to="/login" onClick={closeModal}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      width:"100%", padding:"14px 0",
                      background:C.orange, color:"#fff",
                      borderRadius:16, textDecoration:"none",
                      fontSize:15, fontWeight:800, fontFamily:"'Sora', sans-serif",
                      boxSizing:"border-box",
                    }}
                  >
                    🔒 Login to Order
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}