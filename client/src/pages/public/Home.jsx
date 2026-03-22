import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Search, Star, Clock,
  X, Flame, ArrowRight, ChevronRight,
  MapPin, Shield, Zap, Gift, ChefHat
} from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

/* ─── Google Font injected once ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .hero-card:hover  { transform: translateY(-6px) !important; box-shadow: 0 20px 48px rgba(0,0,0,0.22) !important; }
    .food-card:hover  { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.10) !important; border-color: #f97316 !important; }
    .offer-card:hover { transform: translateY(-4px); box-shadow: 0 20px 52px rgba(0,0,0,0.18) !important; }
    .cat-btn:hover    { background: #fff7ed !important; border-color: #f97316 !important; color: #f97316 !important; }
    .cat-btn.active   { background: #f97316 !important; border-color: #f97316 !important; color: #fff !important; }
    .add-btn:hover    { background: #ea580c !important; }
    .trend-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important; }
    .why-card:hover   { transform: translateY(-6px); box-shadow: 0 16px 44px rgba(0,0,0,0.08) !important; }
    .footer-link:hover { color: #f97316 !important; }
  `}</style>
);

const S = {
  font: "'Outfit', system-ui, sans-serif",
  orange: "#f97316",
  orangeDark: "#ea580c",
  orangeLight: "#fff7ed",
  navy: "#0c1420",
  navyMid: "#1a2744",
  text: "#111827",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  border: "#f0f0f0",
  bg: "#fafafa",
  white: "#ffffff",
  card: "#ffffff",
};

export default function Home() {
  const { user }                            = useAuth();
  const { addToCart, cartItems }            = useCart();

  const [foods,           setFoods]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [activeCategory,  setActiveCategory]  = useState("All");
  const [selectedFood,    setSelectedFood]    = useState(null);
  const [selectedImage,   setSelectedImage]   = useState(null);
  const [addedId,         setAddedId]         = useState(null);
  const [heroVisible,     setHeroVisible]     = useState(false);

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

  const handleAdd = (food, e) => {
    e?.stopPropagation();
    addToCart(food);
    setAddedId(food._id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const openModal  = food => { setSelectedFood(food); setSelectedImage(food.thumbnail); };
  const closeModal = ()   => { setSelectedFood(null); setSelectedImage(null); };

  const cartCount = cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
  const heroFoods = foods.slice(0, 5);

  /* ── inline style helpers ── */
  const css = (obj) => obj; // identity — just for clarity

  return (
    <>
      <FontLink />
      <div style={{ fontFamily: S.font, background: S.bg, width: "100%", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════════════
            HERO  — dark, immersive, full-viewport-width
        ══════════════════════════════════════════════════════ */}
        <section style={{
          width: "100%",
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${S.navy} 0%, ${S.navyMid} 60%, #1c3461 100%)`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}>

          {/* Background texture */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }} />

          {/* Glow orbs */}
          <div style={{ position:"absolute", top:-160, right:-160, width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)", zIndex:0 }} />
          <div style={{ position:"absolute", bottom:-200, left:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)", zIndex:0 }} />

          <div style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", position:"relative", zIndex:1 }}>

            {/* ── LEFT: copy ── */}
            <div style={{
              display:"flex", flexDirection:"column", justifyContent:"center",
              padding:"80px 48px 80px 6vw",
              animation: heroVisible ? "fadeUp 0.7s ease both" : "none",
            }}>
              {/* Live badge */}
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:32, width:"fit-content",
                background:"rgba(249,115,22,0.15)", border:"1px solid rgba(249,115,22,0.35)",
                borderRadius:99, padding:"8px 20px",
              }}>
                <span style={{ position:"relative", display:"inline-flex" }}>
                  <span style={{ width:8, height:8, background:"#4ade80", borderRadius:"50%", display:"block" }} />
                  <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade80", animation:"pulse-ring 1.5s ease-out infinite" }} />
                </span>
                <span style={{ color:"rgba(255,255,255,0.85)", fontSize:13, fontWeight:600, letterSpacing:"0.04em" }}>
                  Delivering in 500+ cities · Open now
                </span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize:"clamp(2.8rem, 4.8vw, 5.2rem)",
                fontWeight:900, lineHeight:1.04,
                letterSpacing:"-0.025em",
                color:"#fff", margin:"0 0 24px",
              }}>
                Hot food,<br />
                <span style={{
                  background:"linear-gradient(90deg, #f97316, #fb923c, #fdba74)",
                  backgroundClip:"text", WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                }}>
                  at your door.
                </span>
              </h1>

              <p style={{ color:"rgba(255,255,255,0.60)", fontSize:"clamp(1rem,1.4vw,1.18rem)", lineHeight:1.75, maxWidth:460, margin:"0 0 40px" }}>
                Order from hundreds of local restaurants and get fresh, hot meals delivered in under 30 minutes — guaranteed.
              </p>

              {/* Location bar */}
              <div style={{
                display:"flex", alignItems:"center", gap:12,
                background:"#fff", borderRadius:16,
                padding:"6px 6px 6px 20px",
                boxShadow:"0 24px 64px rgba(0,0,0,0.30)",
                maxWidth:500, marginBottom:28,
              }}>
                <MapPin size={18} color={S.orange} style={{flexShrink:0}} />
                <input
                  placeholder="Enter your delivery address…"
                  style={{ border:"none", outline:"none", fontSize:15, color:S.text, flex:1, background:"transparent", fontFamily:S.font }}
                />
                <button style={{
                  background:S.orange, color:"#fff", border:"none",
                  borderRadius:12, padding:"12px 24px",
                  fontSize:14, fontWeight:700, cursor:"pointer",
                  fontFamily:S.font, flexShrink:0,
                  transition:"background 0.2s",
                }}
                  onMouseEnter={e=>e.target.style.background=S.orangeDark}
                  onMouseLeave={e=>e.target.style.background=S.orange}
                >
                  Find Food
                </button>
              </div>

              {/* CTAs */}
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:52 }}>
                {user ? (
                  <>
                    <Link to="/foods" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:S.orange, color:"#fff",
                      fontWeight:800, fontSize:15, padding:"14px 28px",
                      borderRadius:13, textDecoration:"none",
                      boxShadow:"0 8px 28px rgba(249,115,22,0.45)",
                      fontFamily:S.font, transition:"transform 0.15s",
                    }}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                    >
                      Browse Menu <ArrowRight size={16}/>
                    </Link>
                    {user.role !== "admin" && (
                      <Link to="/my-orders" style={{
                        display:"inline-flex", alignItems:"center", gap:8,
                        background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.25)",
                        color:"#fff", fontWeight:700, fontSize:15, padding:"14px 26px",
                        borderRadius:13, textDecoration:"none", fontFamily:S.font,
                      }}>
                        My Orders
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link to="/admin" style={{
                        display:"inline-flex", alignItems:"center", gap:8,
                        background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.25)",
                        color:"#fff", fontWeight:700, fontSize:15, padding:"14px 26px",
                        borderRadius:13, textDecoration:"none", fontFamily:S.font,
                      }}>
                        Admin Panel
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:S.orange, color:"#fff",
                      fontWeight:800, fontSize:15, padding:"14px 28px",
                      borderRadius:13, textDecoration:"none",
                      boxShadow:"0 8px 28px rgba(249,115,22,0.45)",
                      fontFamily:S.font, transition:"transform 0.15s",
                    }}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                    >
                      Get Started Free <ArrowRight size={16}/>
                    </Link>
                    <Link to="/login" style={{
                      display:"inline-flex", alignItems:"center", gap:8,
                      background:"rgba(255,255,255,0.10)", border:"1.5px solid rgba(255,255,255,0.25)",
                      color:"#fff", fontWeight:700, fontSize:15, padding:"14px 26px",
                      borderRadius:13, textDecoration:"none", fontFamily:S.font,
                    }}>
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div style={{ display:"flex", gap:0, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.10)" }}>
                {[
                  { v:`${foods.length||"50"}+`, l:"Menu Items" },
                  { v:"30 min", l:"Avg Delivery" },
                  { v:"2M+",    l:"Customers"    },
                  { v:"4.8★",   l:"Rating"       },
                ].map((s,i)=>(
                  <div key={i} style={{
                    paddingRight:32, marginRight:32,
                    borderRight: i<3 ? "1px solid rgba(255,255,255,0.12)" : "none",
                  }}>
                    <div style={{ fontSize:"clamp(1.3rem,2vw,1.7rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:4, fontWeight:500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: food cards mosaic ── */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"80px 6vw 80px 20px", position:"relative",
              animation: heroVisible ? "fadeIn 0.9s 0.3s ease both" : "none",
              opacity: heroVisible ? 1 : 0,
            }}>

              {/* centre glow */}
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                transform:"translate(-50%,-50%)",
                width:380, height:380, borderRadius:"50%",
                background:"radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
                pointerEvents:"none",
              }} />

              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, width:"100%", maxWidth:440, position:"relative", zIndex:1 }}>
                {loading
                  ? Array.from({length:6}).map((_,i)=>(
                      <div key={i} className="hero-card" style={{
                        background:"rgba(255,255,255,0.07)", borderRadius:20, height:155,
                        transform:`translateY(${[0,-30,15,-15,30,-8][i]||0}px)`,
                        animation:"pulse-ring 2s ease infinite",
                      }}/>
                    ))
                  : heroFoods.slice(0,6).map((food,i)=>(
                      <div key={food._id} className="hero-card" onClick={()=>openModal(food)}
                        style={{
                          background:"rgba(255,255,255,0.10)",
                          backdropFilter:"blur(12px)",
                          border:"1px solid rgba(255,255,255,0.18)",
                          borderRadius:20, overflow:"hidden", cursor:"pointer",
                          transform:`translateY(${[0,-30,15,-15,30,-8][i]||0}px)`,
                          transition:"transform 0.25s, box-shadow 0.25s",
                          boxShadow:"0 8px 32px rgba(0,0,0,0.25)",
                        }}
                      >
                        <div style={{height:100, overflow:"hidden"}}>
                          <img src={food.thumbnail} alt={food.name}
                            style={{width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s"}}
                            onMouseEnter={e=>e.target.style.transform="scale(1.08)"}
                            onMouseLeave={e=>e.target.style.transform="scale(1)"}
                          />
                        </div>
                        <div style={{padding:"10px 12px"}}>
                          <p style={{color:"#fff",fontSize:12,fontWeight:700,margin:"0 0 3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{food.name}</p>
                          <p style={{color:"#fdba74",fontSize:12,fontWeight:800,margin:0}}>₹{food.price}</p>
                        </div>
                      </div>
                    ))
                }
              </div>

              {/* Floating badges */}
              {[
                { icon:"⚡", title:"Fast Delivery", sub:"Under 25 mins", top:60, left:-10, floatDelay:"0s" },
                { icon:"⭐", title:"Top Rated",     sub:"4.8 / 5.0",     bottom:80, right:-10, floatDelay:"1.2s" },
              ].map(b=>(
                <div key={b.title} style={{
                  position:"absolute",
                  top:b.top, bottom:b.bottom, left:b.left, right:b.right,
                  background:"#fff", borderRadius:16, padding:"12px 16px",
                  display:"flex", alignItems:"center", gap:10,
                  boxShadow:"0 12px 36px rgba(0,0,0,0.22)", zIndex:10,
                  animation:`float 4s ${b.floatDelay} ease-in-out infinite`,
                }}>
                  <div style={{width:36,height:36,background:"#fff7ed",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                    {b.icon}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:S.textMuted,fontWeight:600}}>{b.title}</div>
                    <div style={{fontSize:13,color:S.text,fontWeight:800}}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            MARQUEE STRIP
        ══════════════════════════════════════════════════════ */}
        <div style={{
          width:"100%", background:S.orange,
          overflow:"hidden", padding:"14px 0", userSelect:"none",
        }}>
          <div style={{
            display:"flex", gap:"0",
            animation:"marquee 22s linear infinite",
            width:"max-content",
          }}>
            {Array.from({length:4}).flatMap(()=>[
              "🎉 50% Off First Order — Use FIRST50",
              "🛵 Free Delivery This Week",
              "⚡ Under 30 Minutes Guaranteed",
              "🍔 500+ Restaurants Now Live",
              "🌟 Rated 4.8 by 2 Million Users",
            ]).map((t,i)=>(
              <span key={i} style={{
                color:"#fff", fontSize:13, fontWeight:700,
                paddingRight:56, whiteSpace:"nowrap",
                display:"inline-flex", alignItems:"center", gap:0,
              }}>
                {t} <span style={{marginLeft:56,color:"rgba(255,255,255,0.4)"}}>◆</span>
              </span>
            ))}
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════
            OFFER BANNERS
        ══════════════════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"#f9fafb", padding:"56px 5vw" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { code:"FIRST50",   desc:"50% off your first order",  sub:"New users only",   bg:"linear-gradient(135deg,#0c1420,#1a2744)", accent:"#f97316" },
              { code:"FREEDEL",   desc:"Free delivery all week",    sub:"No minimum order", bg:"linear-gradient(135deg,#7c2d12,#c2410c)", accent:"#fdba74" },
              { code:"WEEKEND30", desc:"30% off every weekend",     sub:"Sat & Sun only",   bg:"linear-gradient(135deg,#064e3b,#065f46)", accent:"#6ee7b7" },
            ].map(o=>(
              <div key={o.code} className="offer-card" style={{
                background:o.bg, borderRadius:22, padding:"32px 36px",
                cursor:"pointer", position:"relative", overflow:"hidden",
                transition:"transform 0.22s, box-shadow 0.22s",
              }}>
                {/* Decorative ring */}
                <div style={{
                  position:"absolute", right:-40, top:-40,
                  width:160, height:160, borderRadius:"50%",
                  border:`2px solid ${o.accent}22`,
                }}/>
                <div style={{
                  position:"absolute", right:-20, top:-20,
                  width:100, height:100, borderRadius:"50%",
                  background:`${o.accent}15`,
                }}/>
                <div style={{position:"relative", zIndex:1}}>
                  <div style={{
                    display:"inline-block",
                    background:`${o.accent}25`, border:`1px solid ${o.accent}50`,
                    color:o.accent, fontSize:10, fontWeight:800,
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    padding:"4px 12px", borderRadius:99, marginBottom:14,
                  }}>
                    Limited Offer
                  </div>
                  <div style={{color:"#fff", fontSize:"clamp(1.8rem,2.8vw,2.6rem)", fontWeight:900, letterSpacing:"-0.02em", lineHeight:1, marginBottom:10}}>
                    {o.code}
                  </div>
                  <div style={{color:"rgba(255,255,255,0.82)", fontSize:15, fontWeight:600, marginBottom:5}}>{o.desc}</div>
                  <div style={{color:"rgba(255,255,255,0.40)", fontSize:12}}>{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            SEARCH + CATEGORY FILTER  (sticky)
        ══════════════════════════════════════════════════════ */}
        <div style={{
          width:"100%", background:"#fff",
          borderBottom:"1px solid #f0f0f0",
          position:"sticky", top:64, zIndex:40,
          boxShadow:"0 2px 16px rgba(0,0,0,0.05)",
        }}>
          <div style={{ width:"100%", padding:"12px 5vw", display:"flex", alignItems:"center", gap:16 }}>
            {/* Search */}
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              background:"#f9fafb", border:"1.5px solid #e5e7eb",
              borderRadius:13, padding:"10px 16px", width:280, flexShrink:0,
              transition:"border-color 0.2s",
            }}
              onFocus={e=>e.currentTarget.style.borderColor=S.orange}
              onBlur={e=>e.currentTarget.style.borderColor="#e5e7eb"}
            >
              <Search size={15} color="#9ca3af" style={{flexShrink:0}}/>
              <input
                value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search dishes, restaurants…"
                style={{ border:"none", outline:"none", background:"transparent", fontSize:14, color:S.text, width:"100%", fontFamily:S.font }}
              />
              {searchQuery && (
                <button onClick={()=>setSearchQuery("")} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",display:"flex",padding:0}}>
                  <X size={13}/>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div style={{ display:"flex", gap:8, overflowX:"auto", flex:1, scrollbarWidth:"none", paddingBottom:2 }}>
              {categories.map(cat=>(
                <button key={cat} onClick={()=>setActiveCategory(cat)}
                  className={`cat-btn${activeCategory===cat?" active":""}`}
                  style={{
                    flexShrink:0, padding:"9px 20px", borderRadius:10,
                    fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:S.font,
                    border:`1.5px solid ${activeCategory===cat ? S.orange : "#e5e7eb"}`,
                    background: activeCategory===cat ? S.orange : "#fff",
                    color: activeCategory===cat ? "#fff" : "#374151",
                    transition:"all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════
            TRENDING STRIP
        ══════════════════════════════════════════════════════ */}
        {/* Only render trending strip if admin has marked at least one food as trending */}
        {!loading && foods.filter(f => f.isTrending).length > 0 && (
          <section style={{ width:"100%", background:"#fff", padding:"44px 5vw 32px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, background:"#fff7ed", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Flame size={18} color={S.orange}/>
                </div>
                <h2 style={{ fontSize:22, fontWeight:900, color:S.text, margin:0 }}>Trending Now</h2>
                <span style={{ fontSize:12, fontWeight:700, background:"#fff7ed", color:S.orange, border:"1px solid #fed7aa", borderRadius:99, padding:"3px 10px" }}>
                  {foods.filter(f => f.isTrending).length} items
                </span>
              </div>
              <Link to="/foods" style={{ display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:700, color:S.orange, textDecoration:"none" }}>
                See all <ChevronRight size={14}/>
              </Link>
            </div>

            {/* horizontal scroll — bleeds to edges */}
            <div style={{
              display:"flex", gap:16, overflowX:"auto",
              scrollbarWidth:"none", paddingBottom:4,
              margin:"0 -5vw", padding:"0 5vw 4px",
            }}>
              {foods.filter(f => f.isTrending).map(food=>(
                <div key={food._id} className="trend-card" onClick={()=>openModal(food)}
                  style={{
                    flexShrink:0, width:190, background:S.card,
                    border:`1px solid ${S.border}`, borderRadius:18,
                    overflow:"hidden", cursor:"pointer",
                    boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                    transition:"transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div style={{ height:128, overflow:"hidden", position:"relative" }}>
                    <img src={food.thumbnail} alt={food.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" }}
                      onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
                      onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    />
                    <div style={{
                      position:"absolute", top:8, left:8,
                      background:S.orange, color:"#fff",
                      fontSize:10, fontWeight:800,
                      padding:"3px 9px", borderRadius:99,
                      display:"flex", alignItems:"center", gap:4,
                    }}>
                      <Flame size={8}/> Trending
                    </div>
                  </div>
                  <div style={{ padding:"12px 14px" }}>
                    <p style={{ fontSize:13, fontWeight:700, color:S.text, margin:"0 0 4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{food.name}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:14, fontWeight:900, color:S.orange }}>₹{food.price}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:S.textLight }}>
                        <Star size={9} fill="#fbbf24" color="#fbbf24"/> 4.5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ══════════════════════════════════════════════════════
            MAIN FOOD GRID
        ══════════════════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"#f9fafb", padding:"44px 5vw 64px" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
            <div>
              <h2 style={{ fontSize:"clamp(1.4rem,2.2vw,1.9rem)", fontWeight:900, color:S.text, margin:"0 0 6px" }}>
                {activeCategory==="All" ? "All Menu Items" : activeCategory}
                <span style={{ fontSize:15, fontWeight:500, color:S.textLight, marginLeft:8 }}>({filtered.length})</span>
              </h2>
              {searchQuery && (
                <p style={{ fontSize:13, color:S.textMuted, margin:0 }}>
                  Showing results for <strong style={{color:S.orange}}>"{searchQuery}"</strong>
                </p>
              )}
            </div>
            <Link to="/foods" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:700, color:S.orange, textDecoration:"none" }}>
              Full Menu <ArrowRight size={14}/>
            </Link>
          </div>

          {/* Skeletons */}
          {loading && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
              {Array.from({length:12}).map((_,i)=>(
                <div key={i} style={{ background:"#fff", borderRadius:18, overflow:"hidden", border:`1px solid ${S.border}` }}>
                  <div style={{ height:160, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.4s infinite" }}/>
                  <div style={{ padding:14 }}>
                    <div style={{ height:13, background:"#f1f5f9", borderRadius:6, width:"72%", marginBottom:8 }}/>
                    <div style={{ height:11, background:"#f8fafc", borderRadius:6, width:"50%", marginBottom:14 }}/>
                    <div style={{ height:36, background:"#f8fafc", borderRadius:10 }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length===0 && (
            <div style={{ textAlign:"center", padding:"80px 0", background:"#fff", borderRadius:20, border:`1px solid ${S.border}` }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🍽️</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:S.text, marginBottom:8 }}>Nothing found</h3>
              <p style={{ color:S.textLight, fontSize:14, marginBottom:24 }}>
                {searchQuery ? `No results for "${searchQuery}"` : "No items in this category yet."}
              </p>
              <button onClick={()=>{setSearchQuery("");setActiveCategory("All");}}
                style={{ background:S.orange, color:"#fff", border:"none", borderRadius:10, padding:"10px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:S.font }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && filtered.length>0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
              {filtered.map(food=>(
                <div key={food._id} className="food-card"
                  style={{
                    background:S.card, borderRadius:18,
                    border:`1.5px solid ${S.border}`,
                    overflow:"hidden",
                    transition:"transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                  }}
                >
                  {/* Image */}
                  <div style={{ height:160, overflow:"hidden", cursor:"pointer", position:"relative" }}
                    onClick={()=>openModal(food)}
                  >
                    <img src={food.thumbnail} alt={food.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" }}
                      onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
                      onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    />
                    {/* category pill */}
                    <div style={{
                      position:"absolute", top:10, left:10,
                      background:"rgba(255,255,255,0.94)", backdropFilter:"blur(6px)",
                      color:S.orange, fontSize:10, fontWeight:800,
                      padding:"4px 10px", borderRadius:99,
                      boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
                    }}>
                      {food.category}
                    </div>
                  </div>

                  <div style={{ padding:"14px 16px 16px" }}>
                    {/* Name + Price */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                      <h3 style={{ fontSize:14, fontWeight:800, color:S.text, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                        {food.name}
                      </h3>
                      <span style={{ fontSize:15, fontWeight:900, color:S.orange, flexShrink:0 }}>₹{food.price}</span>
                    </div>

                    {/* Desc */}
                    <p style={{
                      fontSize:12, color:S.textLight, margin:"0 0 10px",
                      overflow:"hidden", display:"-webkit-box",
                      WebkitLineClamp:2, WebkitBoxOrient:"vertical", lineHeight:1.55,
                    }}>
                      {food.description}
                    </p>

                    {/* Meta */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:S.textMuted }}>
                        <Star size={10} fill="#fbbf24" color="#fbbf24"/> 4.5
                      </span>
                      <span style={{ width:1, height:12, background:"#e5e7eb" }}/>
                      <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:S.textMuted }}>
                        <Clock size={10}/> 25–35 min
                      </span>
                    </div>

                    {/* CTA */}
                    {user ? (
                      <button onClick={e=>handleAdd(food,e)} className={addedId===food._id ? "" : "add-btn"}
                        style={{
                          width:"100%", padding:"10px 0",
                          background: addedId===food._id ? "#16a34a" : S.orange,
                          color:"#fff", border:"none", borderRadius:10,
                          fontSize:13, fontWeight:700, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                          transition:"background 0.18s", fontFamily:S.font,
                        }}
                      >
                        {addedId===food._id ? <>✓ Added to Cart</> : <><ShoppingCart size={13}/> Add to Cart</>}
                      </button>
                    ) : (
                      <Link to="/login" style={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                        width:"100%", padding:"10px 0",
                        background:"#f9fafb", color:S.textMuted,
                        border:`1.5px solid #e5e7eb`, borderRadius:10,
                        fontSize:13, fontWeight:700, textDecoration:"none",
                        fontFamily:S.font, boxSizing:"border-box",
                        transition:"all 0.15s",
                      }}>
                        🔒 Login to Order
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* ══════════════════════════════════════════════════════
            WHY US
        ══════════════════════════════════════════════════════ */}
        <section style={{ width:"100%", background:"#fff", padding:"72px 5vw" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <span style={{
              display:"inline-block",
              background:"#fff7ed", border:"1px solid #fed7aa",
              color:S.orange, fontSize:11, fontWeight:800,
              letterSpacing:"0.08em", textTransform:"uppercase",
              padding:"6px 16px", borderRadius:99, marginBottom:16,
            }}>
              Why Choose Us
            </span>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:900, color:S.text, margin:"0 0 12px" }}>
              Built for food lovers
            </h2>
            <p style={{ color:S.textMuted, fontSize:16, maxWidth:440, margin:"0 auto" }}>
              Every feature designed around one promise — hot food, fast delivery, zero compromise.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[
              { Icon:Zap,     title:"Lightning Fast",  desc:"Average delivery under 25 minutes with live GPS tracking on every order.",    bg:"#fff7ed", border:"#fed7aa", iconBg:"#ffedd5", iconColor:S.orange    },
              { Icon:ChefHat, title:"Chef Verified",   desc:"Every restaurant is quality-checked and approved before going live.",          bg:"#f0fdf4", border:"#bbf7d0", iconBg:"#dcfce7", iconColor:"#16a34a"  },
              { Icon:Shield,  title:"Secure & Safe",   desc:"PCI-compliant encrypted checkout. UPI, cards, wallets — all accepted.",        bg:"#eff6ff", border:"#bfdbfe", iconBg:"#dbeafe", iconColor:"#2563eb"  },
              { Icon:Gift,    title:"Daily Deals",     desc:"Fresh offers every day — exclusive savings for new users and regulars alike.", bg:"#fdf4ff", border:"#e9d5ff", iconBg:"#f3e8ff", iconColor:"#9333ea"  },
            ].map(({Icon,...v},i)=>(
              <div key={i} className="why-card"
                style={{
                  background:v.bg, border:`2px solid ${v.border}`,
                  borderRadius:22, padding:"32px 26px",
                  transition:"transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div style={{ width:52, height:52, background:v.iconBg, border:`1.5px solid ${v.border}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <Icon size={24} color={v.iconColor}/>
                </div>
                <h3 style={{ fontSize:16, fontWeight:800, color:S.text, marginBottom:10 }}>{v.title}</h3>
                <p style={{ fontSize:13, color:S.textMuted, lineHeight:1.7, margin:0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            APP DOWNLOAD BANNER
        ══════════════════════════════════════════════════════ */}
        <section style={{
          width:"100%",
          background:`linear-gradient(135deg, ${S.navy} 0%, ${S.navyMid} 100%)`,
          padding:"72px 5vw", position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:48, position:"relative", zIndex:1, flexWrap:"wrap" }}>
            <div style={{ maxWidth:520 }}>
              <span style={{
                display:"inline-block",
                background:"rgba(249,115,22,0.20)", border:"1px solid rgba(249,115,22,0.40)",
                color:S.orange, fontSize:11, fontWeight:800,
                letterSpacing:"0.08em", textTransform:"uppercase",
                padding:"6px 16px", borderRadius:99, marginBottom:20,
              }}>
                📱 Mobile App
              </span>
              <h2 style={{ fontSize:"clamp(1.9rem,3.2vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.12, marginBottom:16 }}>
                Order faster.<br/>
                <span style={{ background:"linear-gradient(90deg,#f97316,#fb923c)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Get rewarded.
                </span>
              </h2>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:16, lineHeight:1.75, maxWidth:420 }}>
                Exclusive app deals, real-time tracking, and one-tap reorder. Available on iOS & Android.
              </p>
            </div>

            <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
              {[
                { icon:"🍎", store:"App Store",   sub:"Download on the" },
                { icon:"🤖", store:"Google Play", sub:"Get it on"       },
              ].map(app=>(
                <button key={app.store}
                  style={{
                    display:"flex", alignItems:"center", gap:14,
                    background:"rgba(255,255,255,0.08)",
                    border:"1.5px solid rgba(255,255,255,0.18)",
                    borderRadius:16, padding:"16px 24px",
                    cursor:"pointer", fontFamily:S.font,
                    transition:"background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)";}}
                >
                  <span style={{ fontSize:34 }}>{app.icon}</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:500 }}>{app.sub}</div>
                    <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>{app.store}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer style={{ width:"100%", background:"#0a0f1a", padding:"60px 5vw 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:40, marginBottom:52 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:900, color:S.orange, marginBottom:14 }}>MyApp</div>
              <p style={{ color:"#475569", fontSize:14, lineHeight:1.75, maxWidth:260, margin:"0 0 0" }}>
                Delivering happiness to your doorstep, one fresh meal at a time.
              </p>
            </div>
            {[
              { title:"Quick Links", links:[{l:"Home",to:"/"},{l:"Foods",to:"/foods"},{l:"About",to:"/about"},{l:"Contact",to:"/contact"}] },
              { title:"Account",     links:[{l:"Login",to:"/login"},{l:"Register",to:"/register"},{l:"My Orders",to:"/my-orders"},{l:"Admin",to:"/admin"}] },
              { title:"Support",     links:[{l:"Help Centre",to:"/"},{l:"Privacy Policy",to:"/"},{l:"Terms of Use",to:"/"},{l:"Contact Us",to:"/contact"}] },
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{ color:"#f1f5f9", fontSize:11, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:20 }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:11 }}>
                  {col.links.map(l=>(
                    <li key={l.l}>
                      <Link to={l.to} className="footer-link"
                        style={{ color:"#4b5563", fontSize:14, textDecoration:"none", transition:"color 0.15s" }}
                      >
                        {l.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid #1e293b", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"#2d3748", fontSize:13, margin:0 }}>© 2026 MyApp. All rights reserved.</p>
            <p style={{ color:"#2d3748", fontSize:13, margin:0 }}>Made with 🧡 for food lovers</p>
          </div>
        </footer>


        {/* ══════════════════════════════════════════════════════
            FOOD DETAIL MODAL
        ══════════════════════════════════════════════════════ */}
        {selectedFood && (
          <div style={{
            position:"fixed", inset:0, zIndex:9999,
            background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"0 16px", animation:"fadeIn 0.2s ease",
          }}>
            <div style={{
              background:"#fff", width:"100%", maxWidth:540,
              borderRadius:26, overflow:"hidden",
              boxShadow:"0 40px 100px rgba(0,0,0,0.35)",
              maxHeight:"90vh", overflowY:"auto",
              position:"relative",
            }}>
              <button onClick={closeModal} style={{
                position:"absolute", top:12, right:12, zIndex:10,
                width:32, height:32, background:"rgba(255,255,255,0.92)",
                border:"none", borderRadius:"50%", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,0.14)",
              }}>
                <X size={15} color={S.textMuted}/>
              </button>

              <img src={selectedImage} alt={selectedFood.name}
                style={{ width:"100%", height:260, objectFit:"cover", display:"block" }}
              />

              {/* Thumbnail strip */}
              {[selectedFood.thumbnail,...(selectedFood.images||[])].length > 1 && (
                <div style={{ display:"flex", gap:8, padding:"14px 20px 0", flexWrap:"wrap" }}>
                  {[selectedFood.thumbnail,...(selectedFood.images||[])].map((img,i)=>(
                    <img key={i} src={img} alt="" onClick={()=>setSelectedImage(img)}
                      style={{
                        width:52, height:52, objectFit:"cover", borderRadius:10, cursor:"pointer",
                        border: selectedImage===img ? `2.5px solid ${S.orange}` : "2px solid #e5e7eb",
                        transition:"border-color 0.15s",
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ padding:"20px 24px 28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <h2 style={{ fontSize:22, fontWeight:900, color:S.text, margin:0 }}>{selectedFood.name}</h2>
                  <span style={{ fontSize:22, fontWeight:900, color:S.orange }}> ₹{selectedFood.price}</span>
                </div>
                <span style={{
                  display:"inline-block", fontSize:11, fontWeight:700,
                  background:"#fff7ed", color:S.orange,
                  border:`1px solid #fed7aa`,
                  padding:"4px 12px", borderRadius:99, marginBottom:12,
                }}>
                  {selectedFood.category}
                </span>
                <p style={{ color:S.textMuted, fontSize:14, lineHeight:1.75, marginBottom:24 }}>{selectedFood.description}</p>

                {user ? (
                  <button
                    onClick={()=>{handleAdd(selectedFood);closeModal();}}
                    style={{
                      width:"100%", padding:"14px 0",
                      background:S.orange, color:"#fff",
                      border:"none", borderRadius:14,
                      fontSize:15, fontWeight:800, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      fontFamily:S.font, transition:"background 0.2s",
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background=S.orangeDark}
                    onMouseLeave={e=>e.currentTarget.style.background=S.orange}
                  >
                    <ShoppingCart size={18}/> Add to Cart
                  </button>
                ) : (
                  <Link to="/login" onClick={closeModal}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      width:"100%", padding:"14px 0",
                      background:S.orange, color:"#fff",
                      borderRadius:14, textDecoration:"none",
                      fontSize:15, fontWeight:800, fontFamily:S.font,
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