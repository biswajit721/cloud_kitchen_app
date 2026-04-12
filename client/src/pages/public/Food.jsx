import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Search, Star, Clock, Leaf, Flame, SlidersHorizontal, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

/* ─── helper: is this food item vegetarian? ───────────────────────────────
   Old DB items may have isVeg = undefined (field didn't exist before).
   We treat undefined as TRUE (veg) since Indian menus default to veg.
   Only explicit false = Non-Vegetarian.
   ──────────────────────────────────────────────────────────────────────── */
const isVegItem     = f => f.isVeg !== false;          // true for true OR undefined
const isNonVegItem  = f => f.isVeg === false;          // only explicit false
const isPureVegItem = f => f.isPureVeg === true;       // only explicit true

const FoodStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    :root {
      --orange:#FF7A00; --orange-dark:#E06A00; --orange-light:#FFF3E8;
      --green:#2ECC71;  --green-light:#E8FAF0; --green-dark:#27AE60;
      --yellow:#FFC300; --yellow-light:#FFF8E1;
      --cream:#FFF9F2;  --white:#FFFFFF;
      --text:#2C2C2C;   --text-mid:#5C5C6E;   --text-light:#9CA3AF;
      --border:#F0ECE6; --navy:#1A1A2E;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{overflow-x:hidden}
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:var(--cream)} ::-webkit-scrollbar-thumb{background:var(--orange);border-radius:99px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{transform:scale(.88);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
    @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes pulse-dot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.6}}

    .fd-card{background:var(--white);border:2px solid var(--border);border-radius:22px;overflow:hidden;transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease,border-color .2s;animation:fadeUp .4s ease both}
    .fd-card:hover{transform:translateY(-8px);box-shadow:0 20px 48px rgba(255,122,0,.13);border-color:#FFD4A8}
    .fd-card-img{transition:transform .45s ease}
    .fd-card:hover .fd-card-img{transform:scale(1.07)}

    .fd-add-btn{width:100%;padding:10px 0;background:var(--orange);color:#fff;border:none;border-radius:12px;cursor:pointer;font-family:'Sora',sans-serif;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(255,122,0,.26);transition:background .18s,transform .15s,box-shadow .18s}
    .fd-add-btn:hover{background:var(--orange-dark);transform:scale(1.02);box-shadow:0 6px 20px rgba(255,122,0,.34)}
    .fd-add-btn.added{background:var(--green)!important;box-shadow:0 4px 14px rgba(46,204,113,.30)!important}
    .fd-login-btn{width:100%;padding:10px 0;background:var(--cream);color:var(--text-mid);border:1.5px solid var(--border);border-radius:12px;font-family:'Sora',sans-serif;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;transition:all .15s}
    .fd-login-btn:hover{border-color:var(--orange);color:var(--orange);background:var(--orange-light)}

    .fd-cat-pill{flex-shrink:0;padding:8px 15px;border-radius:99px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid var(--border);background:var(--white);color:var(--text-mid);font-family:'Sora',sans-serif;transition:all .15s;white-space:nowrap;display:flex;align-items:center;gap:5px}
    .fd-cat-pill:hover{border-color:var(--orange);color:var(--orange);background:var(--orange-light)}
    .fd-cat-pill.active-orange{background:var(--orange);color:#fff;border-color:var(--orange)}
    .fd-cat-pill.active-green{background:var(--green);color:#fff;border-color:var(--green)}

    .fd-sort{padding:9px 14px;border-radius:11px;border:1.5px solid var(--border);background:var(--white);font-family:'Sora',sans-serif;font-size:12px;font-weight:700;color:var(--text-mid);outline:none;cursor:pointer;transition:border-color .15s;appearance:none}
    .fd-sort:focus{border-color:var(--orange)}

    .fd-search{border:none;outline:none;background:transparent;font-family:'Sora',sans-serif;font-size:13px;color:var(--text);width:100%}
    .fd-search::placeholder{color:var(--text-light);font-family:'Nunito',sans-serif}

    .fd-skeleton{background:linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%);background-size:600px 100%;animation:shimmer 1.4s infinite}

    .fd-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.62);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease}
    .fd-modal{background:var(--white);width:100%;max-width:560px;border-radius:28px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.32);max-height:92vh;overflow-y:auto;position:relative;animation:popIn .3s ease both}

    /* Veg toggle button — active state */
    .veg-btn-active-veg    { background:#E8FAF0 !important; border-color:#2ECC71 !important; }
    .veg-btn-active-pure   { background:#F0FDF4 !important; border-color:#16A34A !important; }

    @media(max-width:900px){ .fd-toolbar{flex-direction:column!important;align-items:stretch!important;gap:12px!important} }
    @media(max-width:600px){ .fd-grid{grid-template-columns:repeat(2,1fr)!important;gap:12px!important} .fd-hero-h1{font-size:1.8rem!important} }
    @media(max-width:380px){ .fd-grid{grid-template-columns:1fr!important} }
  `}</style>
);

const ALL_CATS = ["All","Veg","Non-Veg","Dessert","Drinks","Snacks","Beverages"];
const CAT_EMOJI = {"Veg":"🥦","Non-Veg":"🍗","Dessert":"🍰","Drinks":"🥤","Snacks":"🥨","Beverages":"🧃"};

/* ── FSSAI dot component (always rendered, green=veg, red=non-veg) ── */
function FSSAIDot({ food, size = 22 }) {
  const isVeg = isVegItem(food);
  return (
    <div style={{
      width:size, height:size, background:"#fff",
      border:`2px solid ${isVeg ? "#2ECC71" : "#EF4444"}`,
      borderRadius:4,
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:"0 1px 4px rgba(0,0,0,.12)",
    }}>
      <div style={{ width:size-12, height:size-12, borderRadius:"50%", background:isVeg ? "#2ECC71" : "#EF4444" }}/>
    </div>
  );
}

/* ── Inline Veg/Non-Veg tag for modal ── */
function VegTag({ food }) {
  const isVeg = isVegItem(food);
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:700,
      background: isVeg ? "var(--green-light)" : "#FEF2F2",
      color:      isVeg ? "var(--green-dark)"  : "#EF4444",
      padding:"4px 11px", borderRadius:99,
      border:`1px solid ${isVeg ? "#A8E6C2" : "#FECACA"}`,
    }}>
      {/* mini FSSAI dot */}
      <div style={{ width:10, height:10, border:`2px solid ${isVeg?"var(--green-dark)":"#EF4444"}`, borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:5, height:5, borderRadius:"50%", background:isVeg?"var(--green-dark)":"#EF4444" }}/>
      </div>
      {isVeg ? "Vegetarian" : "Non-Vegetarian"}
    </span>
  );
}

export default function Food() {
  const { addToCart } = useCart();
  const { user }      = useAuth();

  const [foods,          setFoods]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedFood,   setSelectedFood]   = useState(null);
  const [selectedImg,    setSelectedImg]    = useState(null);
  const [search,         setSearch]         = useState("");
  const [searchFocus,    setSearchFocus]    = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,         setSortBy]         = useState("default");
  const [addedId,        setAddedId]        = useState(null);
  const [vegMode,        setVegMode]        = useState(false);
  const [pureVegMode,    setPureVegMode]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/food");
        setFoods(res.data.data || []);
      } catch (e) { console.error("Failed to fetch foods", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const dataCats   = new Set(foods.map(f => f.category).filter(Boolean));
  const categories = ALL_CATS.filter(c => c === "All" || dataCats.has(c));

  /* ──────────────────────────────────────────────────────────────────────
     FILTER LOGIC — handles undefined isVeg on old DB items correctly
     isVegItem(f)  → true when isVeg is true OR undefined (default = veg)
     isNonVegItem(f) → true only when isVeg is explicitly false
     isPureVegItem(f) → true only when isPureVeg is explicitly true
  ────────────────────────────────────────────────────────────────────── */
  let visible = foods.filter(f => {
    const q = search.toLowerCase();
    const matchSearch  = f.name?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
    const matchCat     = activeCategory === "All" || f.category === activeCategory;

    /* Veg filter: when vegMode ON, only show veg items (isVeg !== false) */
    const matchVeg     = !vegMode     || isVegItem(f);
    /* Pure veg filter: only items with isPureVeg === true */
    const matchPureVeg = !pureVegMode || isPureVegItem(f);

    return matchSearch && matchCat && matchVeg && matchPureVeg;
  });

  if (sortBy === "price-asc")  visible = [...visible].sort((a,b) => a.price - b.price);
  if (sortBy === "price-desc") visible = [...visible].sort((a,b) => b.price - a.price);
  if (sortBy === "name")       visible = [...visible].sort((a,b) => a.name.localeCompare(b.name));
  if (sortBy === "trending")   visible = [...visible].sort((a,b) => (b.isTrending?1:0)-(a.isTrending?1:0));
  if (sortBy === "veg-first")  visible = [...visible].sort((a,b) => (isVegItem(b)?1:0)-(isVegItem(a)?1:0));

  const handleAdd = (food, e) => {
    e?.stopPropagation();
    addToCart(food);
    setAddedId(food._id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const openModal  = food => { setSelectedFood(food); setSelectedImg(food.thumbnail); };
  const closeModal = ()   => { setSelectedFood(null); setSelectedImg(null); };

  const trendingCount = foods.filter(f => f.isTrending).length;
  const vegCount      = foods.filter(isVegItem).length;
  const pureVegCount  = foods.filter(isPureVegItem).length;

  const toggleVeg = () => {
    if (vegMode) { setVegMode(false); setPureVegMode(false); }
    else         { setVegMode(true); }
  };
  const togglePureVeg = () => {
    if (pureVegMode) { setPureVegMode(false); }
    else             { setPureVegMode(true); setVegMode(true); }
  };
  const clearAll  = () => { setVegMode(false); setPureVegMode(false); setSearch(""); setActiveCategory("All"); setSortBy("default"); };
  const anyFilter = vegMode || pureVegMode || search || activeCategory !== "All";

  return (
    <>
      <FoodStyles />
      <div style={{ fontFamily:"'Sora',sans-serif", background:"var(--cream)", minHeight:"100vh", color:"var(--text)" }}>

        {/* ══ HERO ══ */}
        <section style={{ width:"100%", background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 45%,#FFB347 100%)", padding:"72px 5vw 80px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.14) 1px,transparent 0)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", top:-120, right:-120, width:440, height:440, borderRadius:"50%", background:"rgba(255,255,255,.09)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"10%", right:"5%", width:180, height:180, borderRadius:"50%", border:"2px dashed rgba(255,255,255,.22)", animation:"spin-slow 28s linear infinite", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1, maxWidth:700 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:22, background:"rgba(255,255,255,.20)", border:"1.5px solid rgba(255,255,255,.35)", borderRadius:99, padding:"8px 18px", backdropFilter:"blur(8px)" }}>
              <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-dot 1.5s ease infinite" }}/>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:".04em" }}>{foods.length}+ dishes · Updated daily</span>
            </div>
            <h1 className="fd-hero-h1" style={{ fontSize:"clamp(2rem,4.5vw,3.8rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-.03em", color:"#fff", marginBottom:14 }}>
              Explore our full<br/>
              <span style={{ background:"linear-gradient(90deg,#fff 0%,rgba(255,255,255,.75) 100%)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>menu 🍽️</span>
            </h1>
            <p style={{ color:"rgba(255,255,255,.85)", fontSize:"clamp(.9rem,1.3vw,1.05rem)", lineHeight:1.8, maxWidth:480, fontFamily:"'Nunito',sans-serif", fontWeight:500 }}>
              Freshly prepared, bursting with flavour. Delivered hot in under 30 minutes.
            </p>
            <div style={{ display:"flex", gap:24, marginTop:28, flexWrap:"wrap" }}>
              {[
                { val:`${foods.length}+`, label:"Menu Items" },
                { val:`${trendingCount}`, label:"Trending"   },
                { val:`${vegCount}`,      label:"Veg Items"  },
                { val:`${pureVegCount}`,  label:"Pure Veg"   },
              ].map((s,i) => (
                <div key={i} style={{ paddingRight:24, borderRight:i<3?"1px solid rgba(255,255,255,.22)":"none" }}>
                  <div style={{ fontSize:"clamp(1.2rem,2vw,1.5rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", marginTop:3, fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,64 C360,0 1080,64 1440,16 L1440,64 Z" fill="var(--cream)"/>
            </svg>
          </div>
        </section>


        {/* ══ STICKY TOOLBAR ══ */}
        <div style={{ width:"100%", background:"var(--white)", borderBottom:"1px solid var(--border)", position:"sticky", top:64, zIndex:40, boxShadow:"0 2px 16px rgba(255,122,0,.07)" }}>

          {/* Row 1: search + veg toggles + sort */}
          <div className="fd-toolbar" style={{ padding:"10px 5vw 0", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>

            {/* Search */}
            <div style={{ display:"flex", alignItems:"center", gap:10, background:searchFocus?"var(--orange-light)":"#F9F7F4", border:`1.5px solid ${searchFocus?"var(--orange)":"var(--border)"}`, borderRadius:13, padding:"9px 14px", width:240, flexShrink:0, transition:"all .2s" }}>
              <Search size={13} color={searchFocus?"var(--orange)":"var(--text-light)"} style={{flexShrink:0}}/>
              <input className="fd-search" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)} placeholder="Search dishes, categories…"/>
              {search && <button type="button" onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-light)",display:"flex",padding:0}}><X size={13}/></button>}
            </div>

            {/* ── Veg Only toggle ── outer=button, inner switch=DIV (no nested buttons) ── */}
            <button type="button" onClick={toggleVeg}
              style={{ display:"flex", alignItems:"center", gap:7, background:vegMode?"#E8FAF0":"var(--white)", border:`1.5px solid ${vegMode?"#2ECC71":"var(--border)"}`, borderRadius:11, padding:"7px 12px", cursor:"pointer", flexShrink:0, transition:"all .2s" }}
              onMouseEnter={e=>{ if(!vegMode){e.currentTarget.style.borderColor="#2ECC71";e.currentTarget.style.background="#F0FDF4";} }}
              onMouseLeave={e=>{ if(!vegMode){e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--white)";} }}>
              {/* FSSAI veg indicator */}
              <div style={{ width:16,height:16,border:`2px solid ${vegMode?"#2ECC71":"#9CA3AF"}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <div style={{ width:7,height:7,borderRadius:"50%",background:vegMode?"#2ECC71":"#9CA3AF" }}/>
              </div>
              {/* DIV toggle switch — NOT a button element */}
              <div style={{ width:34,height:19,borderRadius:99,position:"relative",flexShrink:0,background:vegMode?"#2ECC71":"#D1D5DB",transition:"background .22s" }}>
                <div style={{ position:"absolute",top:2,left:vegMode?17:2,width:15,height:15,background:"#fff",borderRadius:"50%",transition:"left .22s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 1px 4px rgba(0,0,0,.18)" }}/>
              </div>
              <span style={{ fontSize:12,fontWeight:800,color:vegMode?"#27AE60":"var(--text-mid)",whiteSpace:"nowrap" }}>Veg Only</span>
              {vegMode && <span style={{ fontSize:9,fontWeight:800,background:"#2ECC71",color:"#fff",borderRadius:99,padding:"1px 6px" }}>ON</span>}
            </button>

            {/* ── Pure Veg toggle ── */}
            <button type="button" onClick={togglePureVeg}
              style={{ display:"flex", alignItems:"center", gap:7, background:pureVegMode?"#F0FDF4":"var(--white)", border:`1.5px solid ${pureVegMode?"#16A34A":"var(--border)"}`, borderRadius:11, padding:"7px 12px", cursor:"pointer", flexShrink:0, transition:"all .2s" }}
              onMouseEnter={e=>{ if(!pureVegMode){e.currentTarget.style.borderColor="#16A34A";e.currentTarget.style.background="#F0FDF4";} }}
              onMouseLeave={e=>{ if(!pureVegMode){e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.background="var(--white)";} }}>
              <span style={{fontSize:13}}>🌱</span>
              <span style={{ fontSize:12,fontWeight:800,color:pureVegMode?"#15803D":"var(--text-mid)",whiteSpace:"nowrap" }}>Pure Veg</span>
              <span style={{ fontSize:10,color:pureVegMode?"#15803D":"var(--text-light)",fontFamily:"'Nunito',sans-serif",fontWeight:600,whiteSpace:"nowrap" }}>No Onion/Garlic</span>
              {pureVegMode && <span style={{ fontSize:9,fontWeight:800,background:"#16A34A",color:"#fff",borderRadius:99,padding:"1px 6px" }}>ON</span>}
            </button>

            {/* Sort */}
            <div style={{ position:"relative", flexShrink:0, marginLeft:"auto" }}>
              <SlidersHorizontal size={13} color="var(--text-light)" style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
              <select className="fd-sort" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ paddingLeft:30, paddingRight:28 }}>
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
                <option value="trending">Trending First</option>
                <option value="veg-first">Veg First</option>
              </select>
              <ChevronDown size={12} color="var(--text-light)" style={{ position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}/>
            </div>

            {anyFilter && (
              <button type="button" onClick={clearAll} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11.5,fontWeight:700,color:"#EF4444",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:99,padding:"5px 11px",cursor:"pointer",flexShrink:0 }}>
                <X size={10}/> Clear
              </button>
            )}
          </div>

          {/* Row 2: category pills */}
          <div style={{ padding:"8px 5vw 10px", display:"flex", gap:7, overflowX:"auto", scrollbarWidth:"none" }}>
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              const isVegCat = cat === "Veg";
              const cls = isActive ? (isVegCat ? "fd-cat-pill active-green" : "fd-cat-pill active-orange") : "fd-cat-pill";
              return (
                <button key={cat} type="button" onClick={()=>setActiveCategory(cat)} className={cls}
                  style={{ border:`1.5px solid ${isActive?(isVegCat?"#2ECC71":"var(--orange)"):"var(--border)"}`, background:isActive?(isVegCat?"#2ECC71":"var(--orange)"):"var(--white)", color:isActive?"#fff":"var(--text-mid)" }}>
                  {CAT_EMOJI[cat] && <span style={{fontSize:11}}>{CAT_EMOJI[cat]}</span>}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active veg mode banner */}
          {(vegMode || pureVegMode) && (
            <div style={{ background:pureVegMode?"#F0FDF4":"#E8FAF0", borderTop:`1px solid ${pureVegMode?"#A7F3D0":"#2ECC71"}`, padding:"7px 5vw", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{fontSize:14}}>{pureVegMode?"🌱":"🥦"}</span>
              <span style={{ fontSize:12,fontWeight:700,color:pureVegMode?"#15803D":"#27AE60",fontFamily:"'Nunito',sans-serif" }}>
                {pureVegMode
                  ? <><strong>Pure Veg Mode ON</strong> — No Onion / No Garlic items only ({visible.length} items)</>
                  : <><strong>Veg Only Mode ON</strong> — vegetarian items only ({visible.length} items)</>
                }
              </span>
              <button type="button" onClick={clearAll} style={{ marginLeft:"auto",fontSize:11,fontWeight:700,color:pureVegMode?"#15803D":"#27AE60",background:"none",border:"none",cursor:"pointer",textDecoration:"underline" }}>Turn off</button>
            </div>
          )}
        </div>


        {/* ══ FOOD GRID ══ */}
        <section style={{ width:"100%", padding:"40px 5vw 72px" }}>

          {/* Result count */}
          {!loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:"var(--text)", margin:"0 0 4px" }}>
                  {pureVegMode && <span style={{color:"#15803D"}}>🌱 </span>}
                  {vegMode && !pureVegMode && <span style={{color:"#2ECC71"}}>🥦 </span>}
                  {activeCategory==="All" ? (pureVegMode?"Pure Veg Items":vegMode?"Veg Items":"All Items") : activeCategory}
                  <span style={{ fontSize:14,fontWeight:500,color:"var(--text-light)",marginLeft:8 }}>({visible.length})</span>
                </h2>
                {search && <p style={{ fontSize:13,color:"var(--text-mid)",margin:0,fontFamily:"'Nunito',sans-serif" }}>Results for <strong style={{color:"var(--orange)"}}>"{search}"</strong></p>}
              </div>
              {anyFilter && (
                <button type="button" onClick={clearAll} style={{ background:"var(--orange-light)",color:"var(--orange)",border:"1.5px solid #FFD4A8",borderRadius:10,padding:"7px 16px",fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:800,cursor:"pointer" }}>
                  Clear filters ×
                </button>
              )}
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="fd-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18 }}>
              {Array.from({length:12}).map((_,i) => (
                <div key={i} style={{ background:"var(--white)",borderRadius:22,border:"2px solid var(--border)",overflow:"hidden" }}>
                  <div className="fd-skeleton" style={{height:168}}/>
                  <div style={{ padding:16,display:"flex",flexDirection:"column",gap:10 }}>
                    <div className="fd-skeleton" style={{height:14,width:"70%",borderRadius:6}}/>
                    <div className="fd-skeleton" style={{height:11,width:"45%",borderRadius:6}}/>
                    <div className="fd-skeleton" style={{height:40,borderRadius:12}}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && visible.length === 0 && (
            <div style={{ textAlign:"center",padding:"72px 20px",background:"var(--white)",borderRadius:24,border:"2px solid var(--border)" }}>
              <div style={{fontSize:60,marginBottom:16}}>{pureVegMode?"🌱":vegMode?"🥦":"🍽️"}</div>
              <h3 style={{ fontSize:20,fontWeight:800,color:"var(--text)",marginBottom:8 }}>Nothing found</h3>
              <p style={{ color:"var(--text-light)",fontSize:14,marginBottom:24,fontFamily:"'Nunito',sans-serif" }}>
                {pureVegMode?"No Pure Veg items match your filters.":vegMode?"No Veg items in this category.":search?`No results for "${search}"`:"No items in this category yet."}
              </p>
              <button type="button" onClick={clearAll} style={{ background:"var(--orange)",color:"#fff",border:"none",borderRadius:12,padding:"11px 30px",fontWeight:800,fontSize:14,cursor:"pointer",fontFamily:"'Sora',sans-serif" }}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && visible.length > 0 && (
            <div className="fd-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18 }}>
              {visible.map((food, idx) => (
                <div key={food._id} className="fd-card" style={{animationDelay:`${Math.min(idx*.05,.4)}s`}}>
                  <div style={{ height:168,overflow:"hidden",cursor:"pointer",position:"relative" }} onClick={()=>openModal(food)}>
                    <img src={food.thumbnail} alt={food.name} className="fd-card-img" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>

                    {/* Category chip */}
                    <div style={{ position:"absolute",top:10,left:10,background:"rgba(255,255,255,.95)",backdropFilter:"blur(6px)",color:"var(--green-dark)",fontSize:10,fontWeight:800,padding:"4px 10px",borderRadius:99,boxShadow:"0 2px 8px rgba(0,0,0,.10)",display:"flex",alignItems:"center",gap:4 }}>
                      <Leaf size={9} color="var(--green)"/> {food.category}
                    </div>

                    {/* Trending badge */}
                    {food.isTrending && (
                      <div style={{ position:"absolute",top:10,right:34,background:"var(--orange)",color:"#fff",fontSize:10,fontWeight:800,padding:"4px 9px",borderRadius:99,display:"flex",alignItems:"center",gap:3 }}>
                        <Flame size={9}/> Hot
                      </div>
                    )}

                    {/* Pure Veg badge */}
                    {isPureVegItem(food) && (
                      <div style={{ position:"absolute",bottom:9,left:9,background:"#15803D",color:"#fff",fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99 }}>🌱 Pure Veg</div>
                    )}

                    {/* FSSAI dot — ALWAYS shown, green=veg, red=non-veg */}
                    <div style={{ position:"absolute", top:10, right:10 }}>
                      <FSSAIDot food={food} size={22}/>
                    </div>
                  </div>

                  <div style={{ padding:"14px 16px 16px" }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:5 }}>
                      <h3 style={{ fontSize:14,fontWeight:800,color:"var(--text)",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>{food.name}</h3>
                      <span style={{ fontSize:15,fontWeight:900,color:"var(--orange)",flexShrink:0 }}>₹{food.price}</span>
                    </div>
                    {food.description && (
                      <p style={{ fontSize:12,color:"var(--text-light)",margin:"0 0 10px",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",lineHeight:1.6,fontFamily:"'Nunito',sans-serif" }}>
                        {food.description}
                      </p>
                    )}
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                      <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:11,color:"var(--text-mid)" }}>
                        <Star size={10} fill="var(--yellow)" color="var(--yellow)"/> 4.5
                      </span>
                      <span style={{ width:1,height:11,background:"var(--border)" }}/>
                      <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:11,color:"var(--text-mid)" }}>
                        <Clock size={10}/> 25–35 min
                      </span>
                      {food.isTrending && (
                        <>
                          <span style={{width:1,height:11,background:"var(--border)"}}/>
                          <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:10,color:"var(--orange)",fontWeight:700 }}>
                            <Flame size={9}/> Trending
                          </span>
                        </>
                      )}
                    </div>
                    {user ? (
                      <button type="button" onClick={e=>handleAdd(food,e)} className={`fd-add-btn${addedId===food._id?" added":""}`}>
                        {addedId===food._id?<>✓ Added to Cart</>:<><ShoppingCart size={13}/> Add to Cart</>}
                      </button>
                    ) : (
                      <Link to="/login" className="fd-login-btn">🔒 Login to Order</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* ══ MODAL ══ */}
        {selectedFood && (
          <div className="fd-modal-overlay" onClick={closeModal}>
            <div className="fd-modal" onClick={e=>e.stopPropagation()}>
              <button type="button" onClick={closeModal} style={{ position:"absolute",top:14,right:14,zIndex:10,width:34,height:34,background:"rgba(255,255,255,.95)",border:"none",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(0,0,0,.15)" }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--orange-light)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.95)"}>
                <X size={15} color="var(--text-mid)"/>
              </button>

              <div style={{ height:270,overflow:"hidden",position:"relative" }}>
                <img src={selectedImg} alt={selectedFood.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(to top,rgba(0,0,0,.25),transparent)",pointerEvents:"none" }}/>
                {selectedFood.isTrending && (
                  <div style={{ position:"absolute",top:14,left:14,background:"var(--orange)",color:"#fff",fontSize:11,fontWeight:800,padding:"5px 12px",borderRadius:99,display:"flex",alignItems:"center",gap:4 }}>
                    <Flame size={10}/> Trending
                  </div>
                )}
              </div>

              {[selectedFood.thumbnail,...(selectedFood.images||[])].length > 1 && (
                <div style={{ display:"flex",gap:8,padding:"14px 20px 0",flexWrap:"wrap" }}>
                  {[selectedFood.thumbnail,...(selectedFood.images||[])].map((img,i) => (
                    <img key={i} src={img} alt="" onClick={()=>setSelectedImg(img)}
                      style={{ width:52,height:52,objectFit:"cover",borderRadius:10,cursor:"pointer",border:selectedImg===img?"2.5px solid var(--orange)":"2px solid var(--border)",transition:"border-color .15s" }}/>
                  ))}
                </div>
              )}

              <div style={{ padding:"20px 24px 28px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                  <h2 style={{ fontSize:22,fontWeight:900,color:"var(--text)",margin:0,flex:1,paddingRight:12 }}>{selectedFood.name}</h2>
                  <span style={{ fontSize:22,fontWeight:900,color:"var(--orange)",flexShrink:0 }}>₹{selectedFood.price}</span>
                </div>

                <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
                  {/* Category */}
                  <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:800,background:"var(--green-light)",color:"var(--green-dark)",border:"1px solid #A8E6C2",padding:"4px 11px",borderRadius:99 }}>
                    <Leaf size={9}/> {selectedFood.category}
                  </span>

                  {/* ── Veg/Non-Veg tag with FSSAI dot ──
                      Uses VegTag component which correctly handles undefined isVeg
                      (undefined → treated as Vegetarian, the default) */}
                  <VegTag food={selectedFood}/>

                  {/* Pure Veg */}
                  {isPureVegItem(selectedFood) && (
                    <span style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:800,background:"#F0FDF4",color:"#15803D",padding:"4px 11px",borderRadius:99,border:"1px solid #A7F3D0" }}>
                      🌱 Pure Veg · No Onion/Garlic
                    </span>
                  )}

                  <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:11,color:"var(--text-mid)",padding:"4px 11px",background:"var(--yellow-light)",borderRadius:99,border:"1px solid var(--yellow)",fontWeight:700 }}>
                    <Star size={9} fill="var(--yellow)" color="var(--yellow)"/> 4.5 Rating
                  </span>
                  <span style={{ display:"flex",alignItems:"center",gap:3,fontSize:11,color:"var(--text-mid)",padding:"4px 11px",background:"var(--cream)",borderRadius:99,border:"1px solid var(--border)",fontWeight:700 }}>
                    <Clock size={9}/> 25–35 min
                  </span>
                </div>

                {selectedFood.description && (
                  <p style={{ color:"var(--text-mid)",fontSize:14,lineHeight:1.8,marginBottom:22,fontFamily:"'Nunito',sans-serif" }}>
                    {selectedFood.description}
                  </p>
                )}

                {user ? (
                  <button type="button" onClick={()=>{handleAdd(selectedFood);closeModal();}}
                    style={{ width:"100%",padding:"14px 0",background:"var(--orange)",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'Sora',sans-serif",boxShadow:"0 8px 28px rgba(255,122,0,.32)" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--orange-dark)";e.currentTarget.style.transform="scale(1.01)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--orange)";e.currentTarget.style.transform="scale(1)";}}>
                    <ShoppingCart size={18}/> Add to Cart — ₹{selectedFood.price}
                  </button>
                ) : (
                  <Link to="/login" onClick={closeModal} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"14px 0",background:"var(--orange)",color:"#fff",borderRadius:16,textDecoration:"none",fontSize:15,fontWeight:800,fontFamily:"'Sora',sans-serif",boxSizing:"border-box" }}>
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