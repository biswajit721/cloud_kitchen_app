import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Search, Star, Clock, Leaf, Flame, SlidersHorizontal, ChevronDown } from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

/* ─── Styles ─── */
const FoodStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');

    :root {
      --orange: #FF7A00;
      --orange-dark: #E06A00;
      --orange-light: #FFF3E8;
      --orange-mid: #FF9A3C;
      --green: #2ECC71;
      --green-light: #E8FAF0;
      --green-dark: #27AE60;
      --yellow: #FFC300;
      --yellow-light: #FFF8E1;
      --cream: #FFF9F2;
      --white: #FFFFFF;
      --text: #2C2C2C;
      --text-mid: #5C5C6E;
      --text-light: #9CA3AF;
      --border: #F0ECE6;
      --navy: #1A1A2E;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--orange); border-radius: 99px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn {
      0%   { transform: scale(0.88); opacity: 0; }
      70%  { transform: scale(1.03); }
      100% { transform: scale(1);   opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position:  600px 0; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pulse-dot {
      0%,100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.5); opacity: 0.6; }
    }

    /* Food card */
    .fd-card {
      background: var(--white);
      border: 2px solid var(--border);
      border-radius: 22px; overflow: hidden;
      transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.2s ease;
      animation: fadeUp 0.4s ease both;
    }
    .fd-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 48px rgba(255,122,0,0.13);
      border-color: #FFD4A8;
    }
    .fd-card-img { transition: transform 0.45s ease; }
    .fd-card:hover .fd-card-img { transform: scale(1.07); }

    /* Add button */
    .fd-add-btn {
      width: 100%; padding: 10px 0;
      background: var(--orange); color: #fff; border: none;
      border-radius: 12px; cursor: pointer;
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 800;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      box-shadow: 0 4px 14px rgba(255,122,0,0.26);
      transition: background 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease;
    }
    .fd-add-btn:hover { background: var(--orange-dark); transform: scale(1.02); box-shadow: 0 6px 20px rgba(255,122,0,0.34); }
    .fd-add-btn.added { background: var(--green) !important; box-shadow: 0 4px 14px rgba(46,204,113,0.30) !important; }
    .fd-login-btn {
      width: 100%; padding: 10px 0;
      background: var(--cream); color: var(--text-mid);
      border: 1.5px solid var(--border); border-radius: 12px;
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      text-decoration: none; transition: all 0.15s ease;
    }
    .fd-login-btn:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-light); }

    /* Category pill */
    .fd-cat-pill {
      flex-shrink: 0; padding: 9px 20px; border-radius: 99px;
      font-size: 12px; font-weight: 700; cursor: pointer;
      border: 1.5px solid var(--border);
      background: var(--white); color: var(--text-mid);
      font-family: 'Sora', sans-serif;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .fd-cat-pill:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-light); }
    .fd-cat-pill.active { background: var(--orange); color: #fff; border-color: var(--orange); }

    /* Sort select */
    .fd-sort {
      padding: 9px 14px; border-radius: 11px;
      border: 1.5px solid var(--border); background: var(--white);
      font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700;
      color: var(--text-mid); outline: none; cursor: pointer;
      transition: border-color 0.15s;
      appearance: none;
    }
    .fd-sort:focus { border-color: var(--orange); }

    /* Search */
    .fd-search {
      border: none; outline: none; background: transparent;
      font-family: 'Sora', sans-serif; font-size: 13px; color: var(--text);
      width: 100%;
    }
    .fd-search::placeholder { color: var(--text-light); font-family: 'Nunito', sans-serif; }

    /* Skeleton */
    .fd-skeleton {
      background: linear-gradient(90deg, #f5f0ea 25%, #ede8e2 50%, #f5f0ea 75%);
      background-size: 600px 100%;
      animation: shimmer 1.4s infinite;
    }

    /* Modal */
    .fd-modal-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.62); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center;
      padding: 16px; animation: fadeIn 0.2s ease;
    }
    .fd-modal {
      background: var(--white); width: 100%; max-width: 560px;
      border-radius: 28px; overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.32);
      max-height: 92vh; overflow-y: auto; position: relative;
      animation: popIn 0.3s ease both;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .fd-toolbar { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
      .fd-toolbar-right { flex-direction: column !important; gap: 10px !important; }
    }
    @media (max-width: 600px) {
      .fd-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
      .fd-hero-h1 { font-size: 1.8rem !important; }
    }
    @media (max-width: 380px) {
      .fd-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

export default function Food() {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();

  const [foods,        setFoods]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedImg,  setSelectedImg]  = useState(null);
  const [search,       setSearch]       = useState("");
  const [searchFocus,  setSearchFocus]  = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,       setSortBy]       = useState("default");
  const [addedId,      setAddedId]      = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/food");
        setFoods(res.data.data);
      } catch (e) { console.error("Failed to fetch foods", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const categories = ["All", ...new Set(foods.map(f => f.category).filter(Boolean))];

  /* Filter + sort */
  let visible = foods.filter(f => {
    const q = search.toLowerCase();
    const matchSearch = f.name?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
    const matchCat    = activeCategory === "All" || f.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });
  if (sortBy === "price-asc")  visible = [...visible].sort((a,b) => a.price - b.price);
  if (sortBy === "price-desc") visible = [...visible].sort((a,b) => b.price - a.price);
  if (sortBy === "name")       visible = [...visible].sort((a,b) => a.name.localeCompare(b.name));
  if (sortBy === "trending")   visible = [...visible].sort((a,b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));

  const handleAdd = (food, e) => {
    e?.stopPropagation();
    addToCart(food);
    setAddedId(food._id);
    setTimeout(() => setAddedId(null), 1600);
  };

  const openModal  = food => { setSelectedFood(food); setSelectedImg(food.thumbnail); };
  const closeModal = ()   => { setSelectedFood(null); setSelectedImg(null); };

  const cartCount = cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;
  const trendingCount = foods.filter(f => f.isTrending).length;

  return (
    <>
      <FoodStyles />
      <div style={{ fontFamily:"'Sora',sans-serif", background:"var(--cream)", minHeight:"100vh", color:"var(--text)" }}>

        {/* ══════════════ HERO HEADER ══════════════ */}
        <section style={{
          width:"100%",
          background:"linear-gradient(135deg, #FF7A00 0%, #FF9A3C 45%, #FFB347 100%)",
          padding:"72px 5vw 80px", position:"relative", overflow:"hidden",
        }}>
          {/* Dots */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
          {/* Orbs */}
          <div style={{ position:"absolute", top:-120, right:-120, width:440, height:440, borderRadius:"50%", background:"rgba(255,255,255,0.09)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }}/>
          {/* Spinning ring */}
          <div style={{ position:"absolute", bottom:"10%", right:"5%", width:180, height:180, borderRadius:"50%", border:"2px dashed rgba(255,255,255,0.22)", animation:"spin-slow 28s linear infinite", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1, maxWidth:700 }}>
            {/* Badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8, marginBottom:22,
              background:"rgba(255,255,255,0.20)", border:"1.5px solid rgba(255,255,255,0.35)",
              borderRadius:99, padding:"8px 18px", backdropFilter:"blur(8px)",
            }}>
              <span style={{ width:8, height:8, background:"#2ECC71", borderRadius:"50%", display:"block", animation:"pulse-dot 1.5s ease infinite" }}/>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700, letterSpacing:"0.04em" }}>
                {foods.length}+ dishes · Updated daily
              </span>
            </div>

            <h1 className="fd-hero-h1" style={{
              fontSize:"clamp(2rem,4.5vw,3.8rem)", fontWeight:900,
              lineHeight:1.08, letterSpacing:"-0.03em", color:"#fff", marginBottom:14,
            }}>
              Explore our full<br/>
              <span style={{ background:"linear-gradient(90deg,#fff 0%,rgba(255,255,255,0.75) 100%)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                menu 🍽️
              </span>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(0.9rem,1.3vw,1.05rem)", lineHeight:1.8, maxWidth:480, fontFamily:"'Nunito',sans-serif", fontWeight:500 }}>
              Freshly prepared, bursting with flavour. Add anything to your cart and get it delivered hot in under 30 minutes.
            </p>

            {/* Quick stats */}
            <div style={{ display:"flex", gap:24, marginTop:28, flexWrap:"wrap" }}>
              {[
                { val:`${foods.length}+`, label:"Menu Items" },
                { val:`${trendingCount}`,  label:"Trending Now" },
                { val:`${categories.length - 1}`, label:"Categories" },
              ].map((s,i) => (
                <div key={i} style={{ paddingRight:24, borderRight: i<2 ? "1px solid rgba(255,255,255,0.22)" : "none" }}>
                  <div style={{ fontSize:"clamp(1.2rem,2vw,1.5rem)", fontWeight:900, color:"#fff", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginTop:3, fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wave */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, lineHeight:0 }}>
            <svg viewBox="0 0 1440 64" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,64 C360,0 1080,64 1440,16 L1440,64 Z" fill="var(--cream)"/>
            </svg>
          </div>
        </section>


        {/* ══════════════ STICKY TOOLBAR ══════════════ */}
        <div style={{
          width:"100%", background:"var(--white)",
          borderBottom:"1px solid var(--border)",
          position:"sticky", top:64, zIndex:40,
          boxShadow:"0 2px 16px rgba(255,122,0,0.07)",
        }}>
          <div className="fd-toolbar" style={{ padding:"12px 5vw", display:"flex", alignItems:"center", gap:14 }}>

            {/* Search */}
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              background: searchFocus ? "var(--orange-light)" : "#F9F7F4",
              border:`1.5px solid ${searchFocus ? "var(--orange)" : "var(--border)"}`,
              borderRadius:14, padding:"10px 16px", width:260, flexShrink:0,
              transition:"all 0.2s",
            }}>
              <Search size={14} color={searchFocus ? "var(--orange)" : "var(--text-light)"} style={{flexShrink:0}}/>
              <input
                className="fd-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                placeholder="Search dishes, categories…"
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-light)", display:"flex", padding:0 }}>
                  <X size={13}/>
                </button>
              )}
            </div>

            {/* Category pills */}
            <div style={{ display:"flex", gap:8, overflowX:"auto", flex:1, scrollbarWidth:"none", paddingBottom:2 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`fd-cat-pill${activeCategory === cat ? " active" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <SlidersHorizontal size={13} color="var(--text-light)" style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
              <select className="fd-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ paddingLeft:30, paddingRight:28 }}
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="name">Name A–Z</option>
                <option value="trending">Trending First</option>
              </select>
              <ChevronDown size={12} color="var(--text-light)" style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
            </div>
          </div>
        </div>


        {/* ══════════════ FOOD GRID ══════════════ */}
        <section style={{ width:"100%", padding:"40px 5vw 72px" }}>

          {/* Result count */}
          {!loading && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:"var(--text)", margin:"0 0 4px" }}>
                  {activeCategory === "All" ? "All Items" : activeCategory}
                  <span style={{ fontSize:14, fontWeight:500, color:"var(--text-light)", marginLeft:8 }}>({visible.length})</span>
                </h2>
                {search && (
                  <p style={{ fontSize:13, color:"var(--text-mid)", margin:0, fontFamily:"'Nunito',sans-serif" }}>
                    Results for <strong style={{color:"var(--orange)"}}>"{search}"</strong>
                  </p>
                )}
              </div>
              {(search || activeCategory !== "All") && (
                <button onClick={() => { setSearch(""); setActiveCategory("All"); setSortBy("default"); }}
                  style={{ background:"var(--orange-light)", color:"var(--orange)", border:"1.5px solid #FFD4A8", borderRadius:10, padding:"7px 16px", fontFamily:"'Sora',sans-serif", fontSize:12, fontWeight:800, cursor:"pointer" }}
                >
                  Clear filters ×
                </button>
              )}
            </div>
          )}

          {/* Skeletons */}
          {loading && (
            <div className="fd-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:18 }}>
              {Array.from({length:12}).map((_,i) => (
                <div key={i} style={{ background:"var(--white)", borderRadius:22, border:"2px solid var(--border)", overflow:"hidden" }}>
                  <div className="fd-skeleton" style={{ height:168 }}/>
                  <div style={{ padding:16, display:"flex", flexDirection:"column", gap:10 }}>
                    <div className="fd-skeleton" style={{ height:14, width:"70%", borderRadius:6 }}/>
                    <div className="fd-skeleton" style={{ height:11, width:"45%", borderRadius:6 }}/>
                    <div className="fd-skeleton" style={{ height:40, borderRadius:12 }}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && visible.length === 0 && (
            <div style={{ textAlign:"center", padding:"72px 20px", background:"var(--white)", borderRadius:24, border:"2px solid var(--border)" }}>
              <div style={{ fontSize:60, marginBottom:16 }}>🍽️</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"var(--text)", marginBottom:8 }}>Nothing found</h3>
              <p style={{ color:"var(--text-light)", fontSize:14, marginBottom:24, fontFamily:"'Nunito',sans-serif" }}>
                {search ? `No results for "${search}"` : "No items in this category yet."}
              </p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); setSortBy("default"); }}
                style={{ background:"var(--orange)", color:"#fff", border:"none", borderRadius:12, padding:"11px 30px", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"'Sora',sans-serif" }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && visible.length > 0 && (
            <div className="fd-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:18 }}>
              {visible.map((food, idx) => (
                <div key={food._id} className="fd-card" style={{ animationDelay:`${Math.min(idx * 0.05, 0.4)}s` }}>

                  {/* Image */}
                  <div style={{ height:168, overflow:"hidden", cursor:"pointer", position:"relative" }}
                    onClick={() => openModal(food)}
                  >
                    <img src={food.thumbnail} alt={food.name} className="fd-card-img"
                      style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                    />
                    {/* Category chip */}
                    <div style={{
                      position:"absolute", top:10, left:10,
                      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(6px)",
                      color:"var(--green-dark)", fontSize:10, fontWeight:800,
                      padding:"4px 10px", borderRadius:99,
                      boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
                      display:"flex", alignItems:"center", gap:4,
                    }}>
                      <Leaf size={9} color="var(--green)"/> {food.category}
                    </div>
                    {/* Trending badge */}
                    {food.isTrending && (
                      <div style={{
                        position:"absolute", top:10, right:10,
                        background:"var(--orange)", color:"#fff",
                        fontSize:10, fontWeight:800, padding:"4px 9px",
                        borderRadius:99, display:"flex", alignItems:"center", gap:3,
                      }}>
                        <Flame size={9}/> Hot
                      </div>
                    )}
                    {/* Veg indicator */}
                    {food.isVeg && (
                      <div style={{
                        position:"absolute", bottom:10, right:10,
                        width:22, height:22, background:"#fff",
                        border:"2px solid var(--green)", borderRadius:4,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <div style={{ width:10, height:10, background:"var(--green)", borderRadius:"50%" }}/>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding:"14px 16px 16px" }}>
                    {/* Name + price */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                      <h3 style={{ fontSize:14, fontWeight:800, color:"var(--text)", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>
                        {food.name}
                      </h3>
                      <span style={{ fontSize:15, fontWeight:900, color:"var(--orange)", flexShrink:0 }}>₹{food.price}</span>
                    </div>

                    {/* Description */}
                    {food.description && (
                      <p style={{
                        fontSize:12, color:"var(--text-light)", margin:"0 0 10px",
                        overflow:"hidden", display:"-webkit-box",
                        WebkitLineClamp:2, WebkitBoxOrient:"vertical", lineHeight:1.6,
                        fontFamily:"'Nunito',sans-serif",
                      }}>
                        {food.description}
                      </p>
                    )}

                    {/* Meta row */}
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"var(--text-mid)" }}>
                        <Star size={10} fill="var(--yellow)" color="var(--yellow)"/> 4.5
                      </span>
                      <span style={{ width:1, height:11, background:"var(--border)" }}/>
                      <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"var(--text-mid)" }}>
                        <Clock size={10}/> 25–35 min
                      </span>
                      {food.isTrending && (
                        <>
                          <span style={{ width:1, height:11, background:"var(--border)" }}/>
                          <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:10, color:"var(--orange)", fontWeight:700 }}>
                            <Flame size={9}/> Trending
                          </span>
                        </>
                      )}
                    </div>

                    {/* CTA */}
                    {user ? (
                      <button
                        onClick={e => handleAdd(food, e)}
                        className={`fd-add-btn${addedId === food._id ? " added" : ""}`}
                      >
                        {addedId === food._id
                          ? <>✓ Added to Cart</>
                          : <><ShoppingCart size={13}/> Add to Cart</>
                        }
                      </button>
                    ) : (
                      <Link to="/login" className="fd-login-btn">
                        🔒 Login to Order
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* ══════════════ MODAL ══════════════ */}
        {selectedFood && (
          <div className="fd-modal-overlay" onClick={closeModal}>
            <div className="fd-modal" onClick={e => e.stopPropagation()}>

              {/* Close */}
              <button onClick={closeModal} style={{
                position:"absolute", top:14, right:14, zIndex:10,
                width:34, height:34, background:"rgba(255,255,255,0.95)",
                border:"none", borderRadius:"50%", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:"0 2px 10px rgba(0,0,0,0.15)", transition:"background 0.15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--orange-light)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.95)"}
              >
                <X size={15} color="var(--text-mid)"/>
              </button>

              {/* Main image */}
              <div style={{ height:270, overflow:"hidden", position:"relative" }}>
                <img src={selectedImg} alt={selectedFood.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform 0.4s" }}
                />
                {/* Gradient overlay */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to top, rgba(0,0,0,0.25), transparent)", pointerEvents:"none" }}/>
                {/* Trending badge */}
                {selectedFood.isTrending && (
                  <div style={{ position:"absolute", top:14, left:14, background:"var(--orange)", color:"#fff", fontSize:11, fontWeight:800, padding:"5px 12px", borderRadius:99, display:"flex", alignItems:"center", gap:4 }}>
                    <Flame size={10}/> Trending
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {[selectedFood.thumbnail, ...(selectedFood.images || [])].length > 1 && (
                <div style={{ display:"flex", gap:8, padding:"14px 20px 0", flexWrap:"wrap" }}>
                  {[selectedFood.thumbnail, ...(selectedFood.images || [])].map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setSelectedImg(img)}
                      style={{
                        width:52, height:52, objectFit:"cover", borderRadius:10, cursor:"pointer",
                        border: selectedImg === img ? "2.5px solid var(--orange)" : "2px solid var(--border)",
                        transition:"border-color 0.15s",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Info */}
              <div style={{ padding:"20px 24px 28px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <h2 style={{ fontSize:22, fontWeight:900, color:"var(--text)", margin:0, flex:1, paddingRight:12 }}>{selectedFood.name}</h2>
                  <span style={{ fontSize:22, fontWeight:900, color:"var(--orange)", flexShrink:0 }}>₹{selectedFood.price}</span>
                </div>

                {/* Tags row */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:800, background:"var(--green-light)", color:"var(--green-dark)", border:"1px solid #A8E6C2", padding:"4px 11px", borderRadius:99 }}>
                    <Leaf size={9}/> {selectedFood.category}
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"var(--text-mid)", padding:"4px 11px", background:"var(--yellow-light)", borderRadius:99, border:"1px solid var(--yellow)", fontWeight:700 }}>
                    <Star size={9} fill="var(--yellow)" color="var(--yellow)"/> 4.5 Rating
                  </span>
                  <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"var(--text-mid)", padding:"4px 11px", background:"var(--cream)", borderRadius:99, border:"1px solid var(--border)", fontWeight:700 }}>
                    <Clock size={9}/> 25–35 min
                  </span>
                </div>

                {selectedFood.description && (
                  <p style={{ color:"var(--text-mid)", fontSize:14, lineHeight:1.8, marginBottom:22, fontFamily:"'Nunito',sans-serif" }}>
                    {selectedFood.description}
                  </p>
                )}

                {user ? (
                  <button
                    onClick={() => { handleAdd(selectedFood); closeModal(); }}
                    style={{
                      width:"100%", padding:"14px 0",
                      background:"var(--orange)", color:"#fff", border:"none",
                      borderRadius:16, fontSize:15, fontWeight:800, cursor:"pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      fontFamily:"'Sora',sans-serif",
                      boxShadow:"0 8px 28px rgba(255,122,0,0.32)",
                      transition:"background 0.18s, transform 0.15s",
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="var(--orange-dark)"; e.currentTarget.style.transform="scale(1.01)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="var(--orange)"; e.currentTarget.style.transform="scale(1)"; }}
                  >
                    <ShoppingCart size={18}/> Add to Cart — ₹{selectedFood.price}
                  </button>
                ) : (
                  <Link to="/login" onClick={closeModal}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      width:"100%", padding:"14px 0",
                      background:"var(--orange)", color:"#fff",
                      borderRadius:16, textDecoration:"none",
                      fontSize:15, fontWeight:800, fontFamily:"'Sora',sans-serif",
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