import { useState } from "react";
import { X, Star, Clock, Leaf, Flame } from "lucide-react";

const S = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    @keyframes fadeIn {from{opacity:0}to{opacity:1}}
    @keyframes popIn  {0%{transform:scale(.90);opacity:0}70%{transform:scale(1.02)}100%{transform:scale(1);opacity:1}}
  `}</style>
);

export default function ViewFoodModal({ food, closeModal }) {
  const [selImg, setSelImg] = useState(food?.thumbnail);
  if (!food) return null;

  const allImages = [food.thumbnail, ...(food.images || [])];

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
          background:"#fff", width:"100%", maxWidth:520,
          borderRadius:26, overflow:"hidden",
          boxShadow:"0 40px 100px rgba(0,0,0,0.30)",
          maxHeight:"92vh", overflowY:"auto",
          position:"relative", animation:"popIn .3s ease both",
        }} onClick={e => e.stopPropagation()}>

          {/* Main image */}
          <div style={{ height:260, overflow:"hidden", position:"relative" }}>
            <img src={selImg} alt={food.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transition:"transform .4s" }}/>
            {/* Gradient overlay */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80, background:"linear-gradient(to top,rgba(0,0,0,0.28),transparent)", pointerEvents:"none" }}/>
            {/* Trending badge */}
            {food.isTrending && (
              <div style={{ position:"absolute", top:14, left:14, background:"#FF7A00", color:"#fff", fontSize:11, fontWeight:800, padding:"5px 12px", borderRadius:99, display:"flex", alignItems:"center", gap:4 }}>
                <Flame size={10}/> Trending
              </div>
            )}
            {/* Close */}
            <button type="button" onClick={closeModal} style={{ position:"absolute", top:14, right:14, width:34, height:34, background:"rgba(255,255,255,0.92)", border:"none", borderRadius:"50%", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 10px rgba(0,0,0,0.16)", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#FFF3E8"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.92)"}
            >
              <X size={15} color="#5C5C6E"/>
            </button>
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div style={{ display:"flex", gap:8, padding:"12px 20px 0", flexWrap:"wrap" }}>
              {allImages.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setSelImg(img)}
                  style={{ width:52, height:52, objectFit:"cover", borderRadius:10, cursor:"pointer", border: selImg===img ? "2.5px solid #FF7A00" : "2px solid #F0ECE6", transition:"border-color .15s" }}
                />
              ))}
            </div>
          )}

          {/* Info */}
          <div style={{ padding:"18px 22px 26px" }}>
            {/* Name + price */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <h2 style={{ fontSize:22, fontWeight:900, color:"#2C2C2C", margin:0, flex:1, paddingRight:12 }}>{food.name}</h2>
              <span style={{ fontSize:22, fontWeight:900, color:"#FF7A00", flexShrink:0 }}>₹{food.price}</span>
            </div>

            {/* Tags */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
              <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:800, background:"#E8FAF0", color:"#27AE60", border:"1px solid #A8E6C2", padding:"4px 11px", borderRadius:99 }}>
                <Leaf size={9}/> {food.category}
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"#5C5C6E", padding:"4px 11px", background:"#FFF8E1", borderRadius:99, border:"1px solid #FFE57A", fontWeight:700 }}>
                <Star size={9} fill="#FFC300" color="#FFC300"/> 4.5 Rating
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:11, color:"#5C5C6E", padding:"4px 11px", background:"#FFF9F2", borderRadius:99, border:"1px solid #F0ECE6", fontWeight:700 }}>
                <Clock size={9}/> 25–35 min
              </span>
            </div>

            {/* Description */}
            {food.description && (
              <p style={{ color:"#5C5C6E", fontSize:14, lineHeight:1.8, fontFamily:"'Nunito',sans-serif", marginBottom:18 }}>{food.description}</p>
            )}

            {/* Gallery */}
            {food.images?.length > 0 && (
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>Gallery</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {food.images.map((img, i) => (
                    <img key={i} src={img} alt="gallery" onClick={() => setSelImg(img)}
                      style={{ width:72, height:72, objectFit:"cover", borderRadius:12, cursor:"pointer", border:"2px solid #F0ECE6", transition:"border-color .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.borderColor="#FF7A00"}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#F0ECE6"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Close button */}
            <button type="button" onClick={closeModal} style={{ width:"100%", marginTop:20, padding:"12px", background:"#FFF9F2", border:"1.5px solid #F0ECE6", borderRadius:13, fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"#5C5C6E", cursor:"pointer", transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#FF7A00"; e.currentTarget.style.color="#FF7A00"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="#F0ECE6"; e.currentTarget.style.color="#5C5C6E"; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}