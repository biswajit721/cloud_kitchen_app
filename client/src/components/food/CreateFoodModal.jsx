import { useState } from "react";
import { X, ImagePlus, Plus, Link as LinkIcon } from "lucide-react";
import api from "../../services/api";

const S = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
    @keyframes popIn    {0%{transform:scale(.90);opacity:0}70%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
    @keyframes spin-s   {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .cf-inp{
      width:100%;padding:11px 14px;
      background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Sora',sans-serif;
      font-size:13.5px;color:#2C2C2C;outline:none;
      transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .cf-inp:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
    .cf-inp::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;font-size:13px;}
    .cf-textarea{
      width:100%;padding:11px 14px;
      background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Nunito',sans-serif;
      font-size:13.5px;color:#2C2C2C;outline:none;
      resize:vertical;min-height:80px;
      transition:border-color .2s,background .2s,box-shadow .2s;
    }
    .cf-textarea:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
    .cf-textarea::placeholder{color:#9CA3AF;}
    .cf-select{
      width:100%;padding:11px 14px;
      background:#F8F6F3;border:1.5px solid #F0ECE6;
      border-radius:11px;font-family:'Sora',sans-serif;
      font-size:13.5px;color:#2C2C2C;outline:none;cursor:pointer;
      appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat:no-repeat;background-position:right 12px center;background-size:14px;padding-right:36px;
      transition:border-color .2s;
    }
    .cf-select:focus{border-color:#FF7A00;background-color:#fff;}
    .cf-label{display:block;font-size:11px;font-weight:700;color:#5C5C6E;marginBottom:6px;letterSpacing:.04em;textTransform:uppercase;}
  `}</style>
);

const CATEGORIES = ["Veg","Non-Veg","Dessert","Drinks","Snacks","Beverages"];

export default function CreateFoodModal({ closeModal, foodData }) {
  const [formData, setFormData] = useState({
    name:        foodData?.name        || "",
    price:       foodData?.price       || "",
    description: foodData?.description || "",
    category:    foodData?.category    || "Veg",
    thumbnail:   foodData?.thumbnail   || "",
  });
  const [images,   setImages]   = useState(foodData?.images || []);
  const [imageUrl, setImageUrl] = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const addImage = () => {
    if (imageUrl.trim()) { setImages(p => [...p, imageUrl.trim()]); setImageUrl(""); }
  };
  const handleAddImage = e => { if (e.key === "Enter") { e.preventDefault(); addImage(); } };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...formData, images };
      if (foodData) await api.put(`/food/${foodData._id}`, payload);
      else          await api.post("/food", payload);
      closeModal();
    } catch (err) { console.error("Save failed", err); }
    finally { setLoading(false); }
  };

  const isEdit = !!foodData;

  return (
    <>
      <S/>
      <div style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"rgba(0,0,0,0.58)", backdropFilter:"blur(10px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"16px", animation:"fadeIn .2s ease",
        fontFamily:"'Sora',sans-serif",
      }} onClick={closeModal}>
        <div style={{
          background:"#fff", width:"100%", maxWidth:540,
          borderRadius:26, overflow:"hidden",
          boxShadow:"0 40px 100px rgba(0,0,0,0.30)",
          maxHeight:"92vh", overflowY:"auto",
          position:"relative", animation:"popIn .3s ease both",
        }} onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", padding:"24px 26px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.10)", pointerEvents:"none" }}/>
            <button type="button" onClick={closeModal} style={{ position:"absolute", top:14, right:14, width:30, height:30, background:"rgba(255,255,255,0.20)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.32)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.20)"}
            >
              <X size={14} color="#fff"/>
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:40, height:40, background:"rgba(255,255,255,0.22)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {isEdit ? "✏️" : "🍔"}
              </div>
              <div>
                <h2 style={{ fontSize:18, fontWeight:900, color:"#fff", margin:0 }}>
                  {isEdit ? "Edit Food Item" : "Add New Food"}
                </h2>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.75)", fontFamily:"'Nunito',sans-serif", margin:0 }}>
                  {isEdit ? "Update the details below" : "Fill in the details to add to the menu"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding:"24px 26px 28px", display:"flex", flexDirection:"column", gap:18 }}>

            {/* Name */}
            <div>
              <label className="cf-label">Food Name *</label>
              <input type="text" name="name" required className="cf-inp" placeholder="e.g. Butter Chicken" value={formData.name} onChange={handleChange}/>
            </div>

            {/* Price + Category */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label className="cf-label">Price (₹) *</label>
                <input type="number" name="price" required min="0" className="cf-inp" placeholder="299" value={formData.price} onChange={handleChange}/>
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

            {/* Thumbnail URL */}
            <div>
              <label className="cf-label">Thumbnail Image URL *</label>
              <div style={{ position:"relative" }}>
                <LinkIcon size={14} color="#C4BAB1" style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>
                <input type="text" name="thumbnail" required className="cf-inp" placeholder="https://example.com/image.jpg" value={formData.thumbnail} onChange={handleChange} style={{ paddingLeft:36 }}/>
              </div>
              {/* Preview */}
              {formData.thumbnail && (
                <div style={{ marginTop:10, borderRadius:12, overflow:"hidden", height:120, border:"2px solid #F0ECE6" }}>
                  <img src={formData.thumbnail} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { e.target.style.display="none"; }}
                  />
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
                    onChange={e => setImageUrl(e.target.value)} onKeyDown={handleAddImage}
                    style={{ paddingLeft:34 }}
                  />
                </div>
                <button type="button" onClick={addImage} style={{ width:44, background:"#FF7A00", border:"none", borderRadius:11, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.background="#E06A00"}
                  onMouseLeave={e=>e.currentTarget.style.background="#FF7A00"}
                >
                  <Plus size={16} color="#fff"/>
                </button>
              </div>
              {images.length > 0 && (
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
                  {images.map((img, i) => (
                    <div key={i} style={{ position:"relative" }}>
                      <img src={img} alt="gallery" style={{ width:60, height:60, objectFit:"cover", borderRadius:10, border:"2px solid #F0ECE6", display:"block" }}/>
                      <button type="button" onClick={() => setImages(p => p.filter((_,j) => j !== i))}
                        style={{ position:"absolute", top:-6, right:-6, width:18, height:18, background:"#EF4444", border:"2px solid #fff", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:800, lineHeight:1 }}
                      >×</button>
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
              {loading ? (
                <svg style={{ animation:"spin-s .8s linear infinite" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/>
                </svg>
              ) : (isEdit ? "✓ Save Changes" : "🍔 Add to Menu")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}