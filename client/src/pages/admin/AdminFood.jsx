import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, Flame, Search, X, UtensilsCrossed } from "lucide-react";
import CreateFoodModal from "../../components/food/CreateFoodModal";
import ViewFoodModal   from "../../components/food/ViewFoodModal";
import api from "../../services/api";

const S = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#FF7A00;border-radius:99px}
    @keyframes fadeUp   {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer  {0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes spin-s   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .af-card {
      background:#fff;border-radius:20px;border:2px solid #F0ECE6;overflow:hidden;
      transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease,border-color .2s;
      animation:fadeUp .4s ease both;
    }
    .af-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(255,122,0,0.10); }
    .af-card.trending { border-color:#FFD4A8 !important; }
    .af-skel {
      background:linear-gradient(90deg,#f5f0ea 25%,#ede8e2 50%,#f5f0ea 75%);
      background-size:600px 100%;animation:shimmer 1.4s infinite;border-radius:10px;
    }
    .af-search {
      border:1.5px solid #F0ECE6;border-radius:12px;padding:10px 14px 10px 38px;
      background:#FFF9F2;font-family:'Sora',sans-serif;font-size:13px;
      color:#2C2C2C;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;
    }
    .af-search:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
    .af-search::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;}
    .af-action-btn {
      width:32px;height:32px;border-radius:9px;border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;transition:all .15s ease;
    }
    .af-page{font-family:'Sora',sans-serif;min-height:100vh;background:#FFF9F2;padding:28px 24px 64px;color:#2C2C2C;}
    @media(max-width:600px){.af-page{padding:20px 14px 48px;} .af-grid{grid-template-columns:1fr 1fr !important;gap:12px !important;}}
    @media(max-width:400px){.af-grid{grid-template-columns:1fr !important;}}
  `}</style>
);

export default function AdminFood() {
  const [openModal,    setOpenModal]    = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foods,        setFoods]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [viewFood,     setViewFood]     = useState(null);
  const [togglingId,   setTogglingId]   = useState(null);
  const [deletingId,   setDeletingId]   = useState(null);
  const [search,       setSearch]       = useState("");
  const [deleteConfirm,setDeleteConfirm]= useState(null);

  const fetchFoods = async () => {
    try { setLoading(true); const res = await api.get("/food"); setFoods(res.data.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/food/${id}`);
      setFoods(f => f.filter(x => x._id !== id));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); setDeleteConfirm(null); }
  };

  const handleToggleTrending = async (food) => {
    setFoods(p => p.map(f => f._id === food._id ? { ...f, isTrending: !f.isTrending } : f));
    setTogglingId(food._id);
    try {
      const res = await api.patch(`/food/${food._id}/trending`);
      const updated = res.data.data;
      setFoods(p => p.map(f => f._id === updated._id ? updated : f));
    } catch (e) {
      console.error(e);
      setFoods(p => p.map(f => f._id === food._id ? { ...f, isTrending: food.isTrending } : f));
    } finally { setTogglingId(null); }
  };

  const visible = foods.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  );
  const trendingCount = foods.filter(f => f.isTrending).length;

  return (
    <>
      <S/>
      <div className="af-page">

        {/* Header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:38, height:38, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <UtensilsCrossed size={18} color="#FF7A00"/>
              </div>
              <h1 style={{ fontSize:"clamp(1.3rem,2.5vw,1.7rem)", fontWeight:900, color:"#2C2C2C", margin:0 }}>Food Management</h1>
            </div>
            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:0, paddingLeft:48 }}>
              {foods.length} total items ·{" "}
              <span style={{ color:"#FF7A00", fontWeight:800 }}>🔥 {trendingCount} trending</span>
            </p>
          </div>

          <button type="button" onClick={() => { setSelectedFood(null); setOpenModal(true); }}
            style={{
              display:"flex", alignItems:"center", gap:7,
              background:"#FF7A00", color:"#fff", border:"none",
              borderRadius:13, padding:"11px 20px",
              fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800,
              cursor:"pointer", boxShadow:"0 5px 18px rgba(255,122,0,0.28)",
              transition:"background .15s, transform .13s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#E06A00"; e.currentTarget.style.transform="translateY(-1px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="#FF7A00"; e.currentTarget.style.transform="translateY(0)"; }}
          >
            <Plus size={16}/> Add Food
          </button>
        </div>

        {/* Trending tip */}
        <div style={{ display:"flex", alignItems:"center", gap:9, background:"#FFF3E8", border:"1.5px solid #FFD4A8", borderRadius:13, padding:"11px 16px", marginBottom:22 }}>
          <Flame size={14} color="#FF7A00" style={{flexShrink:0}}/>
          <p style={{ fontSize:12.5, color:"#92670A", fontFamily:"'Nunito',sans-serif", fontWeight:700, margin:0 }}>
            Click <strong>"Mark Trending"</strong> on any card to feature it in the Home page Trending strip.
          </p>
        </div>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:340, marginBottom:22 }}>
          <Search size={14} color="#9CA3AF" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
          <input className="af-search" placeholder="Search by name or category…" value={search} onChange={e => setSearch(e.target.value)}/>
          {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", display:"flex", padding:0 }}><X size={13}/></button>}
        </div>

        {/* Skeletons */}
        {loading && (
          <div className="af-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {Array.from({length:8}).map((_,i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:20, border:"2px solid #F0ECE6", overflow:"hidden" }}>
                <div className="af-skel" style={{ height:172 }}/>
                <div style={{ padding:14, display:"flex", flexDirection:"column", gap:10 }}>
                  <div className="af-skel" style={{ height:13, width:"70%" }}/>
                  <div className="af-skel" style={{ height:11, width:"45%" }}/>
                  <div className="af-skel" style={{ height:36, borderRadius:12 }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && foods.length === 0 && (
          <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff", borderRadius:22, border:"2px solid #F0ECE6" }}>
            <div style={{ fontSize:56, marginBottom:14 }}>🍽️</div>
            <h3 style={{ fontSize:18, fontWeight:800, color:"#2C2C2C", marginBottom:8 }}>No food items yet</h3>
            <p style={{ fontSize:13, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", marginBottom:20 }}>Click "Add Food" to create your first menu item.</p>
            <button type="button" onClick={() => { setSelectedFood(null); setOpenModal(true); }}
              style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#FF7A00", color:"#fff", border:"none", borderRadius:12, padding:"11px 24px", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>
              <Plus size={15}/> Add Food
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && visible.length > 0 && (
          <div className="af-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {visible.map((food, idx) => (
              <div key={food._id} className={`af-card${food.isTrending ? " trending" : ""}`} style={{ animationDelay:`${Math.min(idx*.05,.35)}s` }}>

                {/* Image */}
                <div style={{ height:164, overflow:"hidden", position:"relative" }}>
                  <img src={food.thumbnail} alt={food.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.07)"}
                    onMouseLeave={e=>e.target.style.transform="scale(1)"}
                  />
                  {/* Category pill */}
                  <div style={{ position:"absolute", top:9, left:9, background:"rgba(255,255,255,0.94)", backdropFilter:"blur(6px)", color:"#27AE60", fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:99, display:"flex", alignItems:"center", gap:3 }}>
                    🌿 {food.category}
                  </div>
                  {food.isTrending && (
                    <div style={{ position:"absolute", top:9, right:9, background:"#FF7A00", color:"#fff", fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:99, display:"flex", alignItems:"center", gap:3 }}>
                      <Flame size={8}/> Trending
                    </div>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding:"13px 14px 14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6, marginBottom:4 }}>
                    <h3 style={{ fontSize:13.5, fontWeight:800, color:"#2C2C2C", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{food.name}</h3>
                    <span style={{ fontSize:14, fontWeight:900, color:"#FF7A00", flexShrink:0 }}>₹{food.price}</span>
                  </div>

                  {food.description && (
                    <p style={{ fontSize:11.5, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif", margin:"0 0 10px", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", lineHeight:1.55 }}>
                      {food.description}
                    </p>
                  )}

                  {/* Trending toggle */}
                  <button type="button" onClick={() => handleToggleTrending(food)} disabled={togglingId === food._id}
                    style={{
                      width:"100%", padding:"8px 0",
                      background: food.isTrending ? "#FF7A00" : "#FFF3E8",
                      color: food.isTrending ? "#fff" : "#FF7A00",
                      border:`1.5px solid ${food.isTrending ? "#FF7A00" : "#FFD4A8"}`,
                      borderRadius:10, fontFamily:"'Sora',sans-serif",
                      fontSize:12, fontWeight:800, cursor: togglingId===food._id ? "not-allowed" : "pointer",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                      opacity: togglingId===food._id ? .6 : 1,
                      marginBottom:10, transition:"all .15s",
                    }}
                  >
                    <Flame size={12}/>
                    {togglingId===food._id ? "Saving…" : food.isTrending ? "Remove Trending" : "Mark Trending"}
                  </button>

                  {/* Action row */}
                  <div style={{ display:"flex", gap:8, paddingTop:10, borderTop:"1px solid #F0ECE6" }}>
                    {/* View */}
                    <button type="button" onClick={() => setViewFood(food)} className="af-action-btn"
                      style={{ background:"#EFF6FF", flex:1 }}
                      onMouseEnter={e=>e.currentTarget.style.background="#DBEAFE"}
                      onMouseLeave={e=>e.currentTarget.style.background="#EFF6FF"}
                      title="View"
                    >
                      <Eye size={14} color="#2563EB"/>
                    </button>
                    {/* Edit */}
                    <button type="button" onClick={() => { setSelectedFood(food); setOpenModal(true); }} className="af-action-btn"
                      style={{ background:"#E8FAF0", flex:1 }}
                      onMouseEnter={e=>e.currentTarget.style.background="#C2F0D4"}
                      onMouseLeave={e=>e.currentTarget.style.background="#E8FAF0"}
                      title="Edit"
                    >
                      <Pencil size={14} color="#27AE60"/>
                    </button>
                    {/* Delete */}
                    {deleteConfirm === food._id ? (
                      <div style={{ display:"flex", gap:5, flex:2 }}>
                        <button type="button" onClick={() => handleDelete(food._id)} disabled={deletingId===food._id}
                          style={{ flex:1, height:32, background:"#EF4444", border:"none", borderRadius:9, cursor:"pointer", color:"#fff", fontSize:11, fontWeight:800, fontFamily:"'Sora',sans-serif" }}
                        >
                          {deletingId===food._id ? "…" : "Yes"}
                        </button>
                        <button type="button" onClick={() => setDeleteConfirm(null)}
                          style={{ flex:1, height:32, background:"#F3F4F6", border:"none", borderRadius:9, cursor:"pointer", color:"#5C5C6E", fontSize:11, fontWeight:700, fontFamily:"'Sora',sans-serif" }}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setDeleteConfirm(food._id)} className="af-action-btn"
                        style={{ background:"#FEF2F2", flex:1 }}
                        onMouseEnter={e=>e.currentTarget.style.background="#FECACA"}
                        onMouseLeave={e=>e.currentTarget.style.background="#FEF2F2"}
                        title="Delete"
                      >
                        <Trash2 size={14} color="#EF4444"/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No search results */}
        {!loading && foods.length > 0 && visible.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 20px" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15, fontWeight:700, color:"#5C5C6E" }}>No results for "{search}"</p>
            <button onClick={() => setSearch("")} style={{ marginTop:14, background:"#FF7A00", color:"#fff", border:"none", borderRadius:10, padding:"9px 22px", fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer" }}>Clear Search</button>
          </div>
        )}
      </div>

      {openModal && <CreateFoodModal foodData={selectedFood} closeModal={() => { setOpenModal(false); fetchFoods(); }}/>}
      {viewFood  && <ViewFoodModal  food={viewFood}           closeModal={() => setViewFood(null)}/>}
    </>
  );
}