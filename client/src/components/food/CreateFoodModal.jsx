import { useState } from "react";
import { X, Plus, Link as LinkIcon } from "lucide-react";
import api from "../../services/api";
import snapbiteLogo from "../../assets/snapbite-logo.png";

const S = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{transform:scale(.90);opacity:0}70%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
    @keyframes spin-s{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

    .cf-inp{
      width:100%;padding:11px 14px;background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Sora',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;
      transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .cf-inp:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
    .cf-inp::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;font-size:13px;}

    .cf-textarea{
      width:100%;padding:11px 14px;background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Nunito',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;
      resize:vertical;min-height:80px;transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .cf-textarea:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
    .cf-textarea::placeholder{color:#9CA3AF;}

    .cf-select{
      width:100%;padding:11px 14px;background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Sora',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;
      cursor:pointer;appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 12px center;background-size:14px;padding-right:36px;
      transition:border-color .2s;
    }
    .cf-select:focus{border-color:#FF7A00;background-color:#fff;}

    .cf-label{
      display:block;font-size:11px;font-weight:700;color:#5C5C6E;
      margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase;
    }

    .cf-toggle-row{
      display:flex;align-items:center;gap:12px;
      background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;padding:11px 14px;
      transition:border-color .2s,background .2s;cursor:pointer;
    }
    .cf-toggle-row.active-green  {border-color:#2ECC71;background:#E8FAF0;}
    .cf-toggle-row.active-pureveg{border-color:#16A34A;background:#F0FDF4;}
  `}} />
);

const CATEGORIES = ["Veg", "Non-Veg", "Dessert", "Drinks", "Snacks", "Beverages"];

export default function CreateFoodModal({ closeModal, foodData }) {
  const [formData, setFormData] = useState({
    name:        foodData?.name        || "",
    price:       foodData?.price       || "",
    description: foodData?.description || "",
    category:    foodData?.category    || "Veg",
    thumbnail:   foodData?.thumbnail   || "",
    isVeg:       foodData?.isVeg     !== undefined ? foodData.isVeg     : true,
    isPureVeg:   foodData?.isPureVeg !== undefined ? foodData.isPureVeg : false,
  });
  const [images,   setImages]   = useState(foodData?.images || []);
  const [imageUrl, setImageUrl] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const set = (key, val) => setFormData(p => {
    const next = { ...p, [key]: val };
    if (key === "isVeg" && !val) next.isPureVeg = false;
    return next;
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const addImage = () => {
    if (imageUrl.trim()) { setImages(p => [...p, imageUrl.trim()]); setImageUrl(""); }
  };
  const onImgKey = e => { if (e.key === "Enter") { e.preventDefault(); addImage(); } };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name:        formData.name,
        price:       Number(formData.price),
        description: formData.description,
        category:    formData.category,
        thumbnail:   formData.thumbnail,
        images:      images,
        isVeg:       formData.isVeg,
        isPureVeg:   formData.isPureVeg,
      };
      if (foodData) {
        await api.put(`/food/${foodData._id}`, payload);
      } else {
        await api.post("/food", payload);
      }
      closeModal();
    } catch (err) {
      console.error("Save failed", err);
      const msg = err?.response?.data?.message || err.message || "Failed to save food item.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!foodData;

  return (
    <>
      <S/>
      <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.58)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", animation:"fadeIn .2s ease", fontFamily:"'Sora',sans-serif" }}
        onClick={closeModal}>
        <div style={{ background:"#fff", width:"100%", maxWidth:540, borderRadius:26, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.30)", maxHeight:"92vh", overflowY:"auto", position:"relative", animation:"popIn .3s ease both" }}
          onClick={e => e.stopPropagation()}>

          {/* ── Header ── */}
          <div style={{ background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", padding:"24px 26px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
            <button type="button" onClick={closeModal}
              style={{ position:"absolute", top:14, right:14, width:30, height:30, background:"rgba(255,255,255,0.20)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.32)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.20)"}>
              <X size={14} color="#fff"/>
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:40, height:40, background:"rgba(255,255,255,0.22)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, overflow:"hidden" }}>
                {isEdit ? "✏️" : <img src={snapbiteLogo} alt="SnapBite" style={{width:"80%", height:"80%", objectFit:"contain"}}/>}
              </div>
              <div>
                <h2 style={{ fontSize:18, fontWeight:900, color:"#fff", margin:0 }}>{isEdit ? "Edit Food Item" : "Add New Food"}</h2>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontFamily:"'Nunito',sans-serif", margin:0 }}>
                  {isEdit ? "Update the details below" : "Fill in the details to add to the menu"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ padding:"24px 26px 28px", display:"flex", flexDirection:"column", gap:18 }}>

            {/* Error banner */}
            {error && (
              <div style={{ background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:11, padding:"10px 14px", fontSize:13, color:"#EF4444", fontFamily:"'Nunito',sans-serif", fontWeight:600 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="cf-label">Food Name *</label>
              <input type="text" name="name" required className="cf-inp" placeholder="e.g. Butter Chicken" value={formData.name} onChange={handleChange}/>
            </div>

            {/* Price + Category */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label className="cf-label">Price (₹) *</label>
                <input type="number" name="price" required min="0" step="1" className="cf-inp" placeholder="299" value={formData.price} onChange={handleChange}/>
              </div>
              <div>
                <label className="cf-label">Category *</label>
                <select name="category" className="cf-select" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="cf-label">Description</label>
              <textarea name="description" className="cf-textarea" placeholder="Describe the dish — ingredients, taste, etc." value={formData.description} onChange={handleChange}/>
            </div>

            {/* ── Dietary Info ── */}
            <div>
              <label className="cf-label">Dietary Info</label>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>

                {/* Veg toggle */}
                <label className={`cf-toggle-row${formData.isVeg ? " active-green" : ""}`}>
                  <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleChange} style={{ display:"none" }}/>
                  <div style={{ width:22, height:22, border:`2px solid ${formData.isVeg?"#2ECC71":"#D1D5DB"}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:formData.isVeg?"#2ECC71":"transparent", transition:"all .2s" }}>
                    {formData.isVeg && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:800, color:formData.isVeg?"#27AE60":"#5C5C6E" }}>🥦 Vegetarian</div>
                    <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>Shows green dot on menu cards (FSSAI standard)</div>
                  </div>
                  {/* Toggle switch — a DIV, not a button, to avoid nested-button HTML error */}
                  <div style={{ width:38, height:21, borderRadius:99, position:"relative", flexShrink:0, background:formData.isVeg?"#2ECC71":"#D1D5DB", transition:"background .22s" }}>
                    <div style={{ position:"absolute", top:3, left:formData.isVeg?20:3, width:15, height:15, background:"#fff", borderRadius:"50%", transition:"left .22s cubic-bezier(.34,1.56,.64,1)", boxShadow:"0 1px 4px rgba(0,0,0,.18)" }}/>
                  </div>
                </label>

                {/* Pure Veg toggle — only when Veg is ON */}
                {formData.isVeg && (
                  <label className={`cf-toggle-row${formData.isPureVeg ? " active-pureveg" : ""}`}>
                    <input type="checkbox" name="isPureVeg" checked={formData.isPureVeg} onChange={handleChange} style={{ display:"none" }}/>
                    <div style={{ width:22, height:22, border:`2px solid ${formData.isPureVeg?"#16A34A":"#D1D5DB"}`, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:formData.isPureVeg?"#16A34A":"transparent", transition:"all .2s" }}>
                      {formData.isPureVeg && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:800, color:formData.isPureVeg?"#15803D":"#5C5C6E" }}>
                        🌱 Pure Veg <span style={{ fontSize:11, fontWeight:600, color:"#6B7280" }}>(No Onion / No Garlic)</span>
                      </div>
                      <div style={{ fontSize:11, color:"#9CA3AF", fontFamily:"'Nunito',sans-serif" }}>Jain-friendly — appears in Pure Veg filter</div>
                    </div>
                    {formData.isPureVeg && <span style={{ fontSize:10, fontWeight:800, background:"#16A34A", color:"#fff", borderRadius:99, padding:"2px 8px", flexShrink:0 }}>ON</span>}
                  </label>
                )}
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="cf-label">Thumbnail Image URL *</label>
              <div style={{ position:"relative" }}>
                <LinkIcon size={14} color="#C4BAB1" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                <input type="text" name="thumbnail" required className="cf-inp" placeholder="https://example.com/image.jpg" value={formData.thumbnail} onChange={handleChange} style={{ paddingLeft:36 }}/>
              </div>
              {formData.thumbnail && (
                <div style={{ marginTop:10, borderRadius:12, overflow:"hidden", height:120, border:"2px solid #F0ECE6" }}>
                  <img src={formData.thumbnail} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="cf-label">Additional Images</label>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ position:"relative", flex:1 }}>
                  <LinkIcon size={13} color="#C4BAB1" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                  <input type="text" className="cf-inp" placeholder="Paste URL and press Enter or +" value={imageUrl}
                    onChange={e=>setImageUrl(e.target.value)} onKeyDown={onImgKey} style={{ paddingLeft:34 }}/>
                </div>
                <button type="button" onClick={addImage}
                  style={{ width:44, background:"#FF7A00", border:"none", borderRadius:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#E06A00"}
                  onMouseLeave={e=>e.currentTarget.style.background="#FF7A00"}>
                  <Plus size={16} color="#fff"/>
                </button>
              </div>
              {images.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position:"relative" }}>
                      <img src={img} alt="gallery" style={{ width:60, height:60, objectFit:"cover", borderRadius:10, border:"2px solid #F0ECE6", display:"block" }}/>
                      <button type="button" onClick={()=>setImages(p=>p.filter((_,j)=>j!==i))}
                        style={{ position:"absolute", top:-6, right:-6, width:18, height:18, background:"#EF4444", border:"2px solid #fff", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800, lineHeight:1 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"13px",
              background: loading ? "#FFC470" : "#FF7A00",
              color:"#fff", border:"none", borderRadius:14,
              fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:800,
              cursor: loading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: loading ? "none" : "0 6px 20px rgba(255,122,0,.30)",
              marginTop:4,
            }}>
              {loading
                ? <svg style={{ animation:"spin-s .8s linear infinite" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/></svg>
                : (isEdit ? "✓ Save Changes" : <><img src={snapbiteLogo} style={{height: 18}} alt=""/> Add to Menu</>)
              }
            </button>
          </form>
        </div>
      </div>
    </>
  );
}