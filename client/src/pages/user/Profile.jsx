import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  User, Mail, Shield, LogOut, ChevronRight, Edit3,
  MapPin, Phone as PhoneIcon, Lock, Camera, X, Check,
  Eye, EyeOff, AlertCircle, CheckCircle, Save, Home
} from "lucide-react";
import snapbiteLogo from "../../assets/snapbite-logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() { return localStorage.getItem("token"); }

/* ── Safe JSON fetch — converts HTML 404 pages to friendly errors ── */
async function apiFetch(url, options) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error(`API route not found (${res.status}). Make sure the backend is running and routes are registered.`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const fileRef = useRef(null);

  /* modal open states */
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen,   setPwOpen]   = useState(false);
  const [imgOpen,  setImgOpen]  = useState(false);

  /* edit profile */
  const [editForm, setEditForm] = useState({ name:"", phone:"", street:"", city:"", state:"", postalCode:"", country:"India" });
  const [editBusy, setEditBusy] = useState(false);
  const [editErr,  setEditErr]  = useState("");
  const [editOk,   setEditOk]   = useState(false);

  /* profile image */
  const [imgPreview, setImgPreview] = useState(user?.avatar || "");
  const [imgBusy,    setImgBusy]    = useState(false);
  const [imgErr,     setImgErr]     = useState("");

  /* change password */
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [showPw, setShowPw] = useState({ current:false, newPw:false, confirm:false });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwErr,  setPwErr]  = useState("");
  const [pwOk,   setPwOk]   = useState(false);

  if (!user) {
    return (
      <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:"#FFF9F2", display:"flex", alignItems:"center", justifyContent:"center", paddingTop:64 }}>
        <div style={{ textAlign:"center", background:"#fff", borderRadius:28, padding:"52px 40px", boxShadow:"0 16px 48px rgba(0,0,0,.07)", border:"2px solid #F0ECE6", maxWidth:380 }}>
          <div style={{fontSize:56,marginBottom:16}}>🔒</div>
          <h2 style={{fontSize:20,fontWeight:900,color:"#2C2C2C",marginBottom:8}}>Sign in required</h2>
          <p style={{fontSize:14,color:"#9CA3AF",marginBottom:24,fontFamily:"'Nunito',sans-serif",lineHeight:1.6}}>Please log in to view your SnapBite profile</p>
          <Link to="/login" style={{display:"inline-flex",alignItems:"center",gap:6,background:"#FF7A00",color:"#fff",textDecoration:"none",borderRadius:12,padding:"12px 28px",fontWeight:800,fontSize:14}}>Sign In →</Link>
        </div>
      </div>
    );
  }

  const initials = user.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "U";
  const isAdmin  = user.role === "admin";
  const addr     = user.address || {};

  /* ── Open edit modal pre-filled ── */
  const openEdit = () => {
    setEditForm({
      name:       user.name  || "",
      phone:      user.phone || "",
      street:     addr.street     || "",
      city:       addr.city       || "",
      state:      addr.state      || "",
      postalCode: addr.postalCode || "",
      country:    addr.country    || "India",
    });
    setEditErr(""); setEditOk(false);
    setEditOpen(true);
  };

  /* ── Submit edit profile ── */
  const submitEdit = async () => {
    if (!editForm.name.trim()) { setEditErr("Name is required."); return; }
    setEditBusy(true); setEditErr("");
    try {
      const data = await apiFetch(`${API}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify({
          name:  editForm.name.trim(),
          phone: editForm.phone.trim(),
          address: {
            street:     editForm.street.trim(),
            city:       editForm.city.trim(),
            state:      editForm.state.trim(),
            postalCode: editForm.postalCode.trim(),
            country:    editForm.country.trim() || "India",
          },
        }),
      });
      /* Update localStorage with fresh data */
      const stored  = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...stored, name: data.name, phone: data.phone, address: data.address };
      localStorage.setItem("user", JSON.stringify(updated));
      setEditOk(true);
      setTimeout(() => { setEditOpen(false); window.location.reload(); }, 900);
    } catch(e) {
      setEditErr(e.message);
    } finally {
      setEditBusy(false);
    }
  };

  /* ── Image pick ── */
  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setImgErr("Image must be under 2MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result);
    reader.readAsDataURL(file);
    setImgErr("");
  };

  /* ── Submit image ── */
  const submitImage = async () => {
    if (!imgPreview || imgPreview === user?.avatar) { setImgOpen(false); return; }
    setImgBusy(true); setImgErr("");
    try {
      const data = await apiFetch(`${API}/api/auth/update-avatar`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify({ avatar: imgPreview }),
      });
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, avatar: data.avatar || imgPreview }));
      setImgOpen(false);
      window.location.reload();
    } catch(e) {
      setImgErr(e.message);
    } finally {
      setImgBusy(false);
    }
  };

  /* ── Submit change password ── */
  const submitPassword = async () => {
    if (!pwForm.current)         { setPwErr("Enter your current password."); return; }
    if (pwForm.newPw.length < 6) { setPwErr("New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwErr("Passwords do not match."); return; }
    setPwBusy(true); setPwErr("");
    try {
      await apiFetch(`${API}/api/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      setPwOk(true);
      setTimeout(() => { setPwOpen(false); setPwForm({current:"",newPw:"",confirm:""}); setPwOk(false); }, 1400);
    } catch(e) {
      setPwErr(e.message);
    } finally {
      setPwBusy(false);
    }
  };

  const quickLinks = isAdmin
    ? [
        {icon:"⚙️",label:"Admin Panel",  sub:"Manage orders & foods",   to:"/admin",         color:"#FF7A00",bg:"#FFF3E8",border:"#FFD4A8"},
        {icon:"📩",label:"Contact Msgs", sub:"View user messages",      to:"/admin/contact", color:"#2ECC71",bg:"#E8FAF0",border:"#A8E6C2"},
        {icon:"🍔",label:"Manage Foods", sub:"Add, edit, delete items", to:"/admin/food",    color:"#FFC300",bg:"#FFF8E1",border:"#FFE57A"},
        {icon:"📦",label:"All Orders",   sub:"View & manage orders",    to:"/admin/orders",  color:"#9B59B6",bg:"#F5EEFF",border:"#D8B4FE"},
      ]
    : [
        {icon:"📦",label:"My Orders",   sub:"Track & view past orders", to:"/my-orders", color:"#FF7A00",bg:"#FFF3E8",border:"#FFD4A8"},
        {icon:"🍔",label:"Browse Menu", sub:"Discover new dishes",      to:"/foods",     color:"#2ECC71",bg:"#E8FAF0",border:"#A8E6C2"},
        {icon:"📞",label:"Contact Us",  sub:"Help & support",           to:"/contact",   color:"#FFC300",bg:"#FFF8E1",border:"#FFE57A"},
        {icon:"ℹ️",label:"About Us",    sub:"Our story & mission",      to:"/about",     color:"#9B59B6",bg:"#F5EEFF",border:"#D8B4FE"},
      ];

  const stats = isAdmin
    ? [{icon:"🛡️",val:"Admin", label:"Role"},{icon:"🏙️",val:"500+",label:"Cities"},{icon:"👥",val:"2M+",label:"Users"}]
    : [{icon:"⭐",val:"Member",label:"Status"},{icon:"⚡",val:"~28min",label:"Avg Delivery"},{icon:"🍔",val:"4.9★",label:"App Rating"}];

  const Spinner = () => (
    <svg style={{animation:"pf-spin .8s linear infinite",flexShrink:0}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity=".4"/>
    </svg>
  );

  const FieldLabel = ({children}) => (
    <label style={{display:"block",fontSize:11,fontWeight:700,color:"#5C5C6E",marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</label>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#FF7A00;border-radius:99px}
        @keyframes pf-fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pf-fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pf-spin  {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pf-pop   {0%{transform:scale(.9);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
        @keyframes pf-ring  {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        .pf-page{font-family:'Sora',sans-serif;min-height:100vh;background:#FFF9F2;color:#2C2C2C;padding-top:64px;}
        .pf-hero{width:100%;background:linear-gradient(135deg,#FF7A00 0%,#FF9A3C 45%,#FFB347 100%);padding:48px 5vw 88px;position:relative;overflow:hidden;}
        .pf-hero-dots{position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.11) 1px,transparent 0);background-size:26px 26px;pointer-events:none;}

        .pf-avatar-wrap{position:relative;flex-shrink:0;}
        .pf-avatar{width:100px;height:100px;border-radius:50%;border:3px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:900;color:#fff;background:rgba(255,255,255,.22);backdrop-filter:blur(8px);box-shadow:0 8px 32px rgba(0,0,0,.20);overflow:hidden;animation:pf-pop .5s ease both;}
        .pf-avatar img{width:100%;height:100%;object-fit:cover;}
        .pf-avatar-ring{position:absolute;inset:-7px;border-radius:50%;border:2px dashed rgba(255,255,255,.35);animation:pf-ring 20s linear infinite;pointer-events:none;}
        .pf-camera-btn{position:absolute;bottom:2px;right:2px;width:30px;height:30px;background:#FF7A00;border:2.5px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s;box-shadow:0 2px 8px rgba(0,0,0,.18);}
        .pf-camera-btn:hover{background:#E06A00;}

        .pf-stat-chip{display:flex;flex-direction:column;align-items:center;gap:3px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:12px 20px;backdrop-filter:blur(8px);flex:1;min-width:80px;cursor:default;transition:background .18s;}
        .pf-stat-chip:hover{background:rgba(255,255,255,.22);}

        .pf-card{background:#fff;border-radius:22px;border:2px solid #F0ECE6;box-shadow:0 4px 28px rgba(0,0,0,.06);animation:pf-fadeUp .5s ease both;overflow:hidden;}
        .pf-info-row{display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid #F0ECE6;transition:background .15s;}
        .pf-info-row:last-child{border-bottom:none;}
        .pf-info-row:hover{background:#FFF9F2;}

        .pf-link-card{display:flex;align-items:center;gap:13px;padding:16px 18px;background:#fff;border-radius:16px;border:2px solid #F0ECE6;text-decoration:none;color:inherit;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,border-color .2s;}
        .pf-link-card:hover{transform:translateY(-5px);box-shadow:0 12px 32px rgba(255,122,0,.12);border-color:#FFD4A8;}

        .pf-logout{width:100%;padding:13px;background:#FEF2F2;border:1.5px solid #FECACA;color:#EF4444;border-radius:13px;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s ease;}
        .pf-logout:hover{background:#EF4444;color:#fff;border-color:#EF4444;}
        .pf-edit-btn{display:flex;align-items:center;gap:5px;background:#FFF3E8;border:1.5px solid #FFD4A8;border-radius:10px;padding:7px 14px;font-size:12px;font-weight:700;color:#FF7A00;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;}
        .pf-edit-btn:hover{background:#FF7A00;color:#fff;}

        .pf-modal-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.60);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px;animation:pf-fadeIn .2s ease;}
        .pf-modal{background:#fff;width:100%;max-width:480px;border-radius:24px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.30);max-height:92vh;overflow-y:auto;animation:pf-pop .3s ease both;}

        .pf-inp{width:100%;padding:11px 14px 11px 40px;background:#F8F6F3;border:1.5px solid #F0ECE6;border-radius:11px;font-family:'Sora',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;}
        .pf-inp:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
        .pf-inp::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;font-size:13px;}
        .pf-inp.err{border-color:#EF4444;}
        .pf-inp-bare{width:100%;padding:11px 14px;background:#F8F6F3;border:1.5px solid #F0ECE6;border-radius:11px;font-family:'Sora',sans-serif;font-size:13.5px;color:#2C2C2C;outline:none;transition:border-color .2s,background .2s;}
        .pf-inp-bare:focus{border-color:#FF7A00;background:#fff;box-shadow:0 0 0 3px rgba(255,122,0,.09);}
        .pf-inp-bare::placeholder{color:#9CA3AF;font-family:'Nunito',sans-serif;font-size:13px;}

        .pf-modal-btn{width:100%;padding:13px;background:#FF7A00;color:#fff;border:none;border-radius:11px;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 5px 18px rgba(255,122,0,.28);transition:background .17s,transform .13s;}
        .pf-modal-btn:hover:not(:disabled){background:#E06A00;transform:translateY(-1px);}
        .pf-modal-btn:disabled{opacity:.55;cursor:not-allowed;}

        .pf-2col{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}

        @media(max-width:700px){
          .pf-hero{padding:36px 5vw 80px !important;}
          .pf-hero-inner{flex-direction:column !important;align-items:flex-start !important;}
          .pf-stats-row{flex-wrap:wrap !important;}
          .pf-content{padding:0 16px 48px !important;}
          .pf-2col{grid-template-columns:1fr !important;}
          .pf-row-2{grid-template-columns:1fr !important;}
        }
      `}</style>

      <div className="pf-page">

        {/* ══ HERO ══ */}
        <div className="pf-hero">
          <div className="pf-hero-dots"/>
          <div style={{position:"absolute",top:-100,right:-100,width:360,height:360,borderRadius:"50%",background:"rgba(255,255,255,.08)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-80,left:-80,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,.06)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"12%",right:"5%",width:150,height:150,borderRadius:"50%",border:"2px dashed rgba(255,255,255,.22)",animation:"pf-ring 28s linear infinite",pointerEvents:"none"}}/>

          {/* Breadcrumb */}
          <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:6,marginBottom:24}}>
            <Link to="/" style={{color:"rgba(255,255,255,.60)",fontSize:13,fontWeight:500,textDecoration:"none"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.90)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.60)"}>Home</Link>
            <ChevronRight size={13} color="rgba(255,255,255,.40)"/>
            <span style={{color:"#fff",fontSize:13,fontWeight:700}}>My Profile</span>
          </div>

          {/* User row */}
          <div className="pf-hero-inner" style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:22,marginBottom:28,flexWrap:"wrap"}}>
            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {imgPreview || user?.avatar
                  ? <img src={imgPreview || user.avatar} alt={user.name}/>
                  : initials
                }
              </div>
              <div className="pf-avatar-ring"/>
              <button type="button" className="pf-camera-btn" onClick={()=>{setImgErr("");setImgPreview(user?.avatar||"");setImgOpen(true);}}>
                <Camera size={13} color="#fff"/>
              </button>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                <h1 style={{fontSize:"clamp(1.4rem,3vw,2rem)",fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>{user.name}</h1>
                <span style={{fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.06em",padding:"4px 12px",borderRadius:99,background:isAdmin?"rgba(239,68,68,.22)":"rgba(46,204,113,.22)",border:`1px solid ${isAdmin?"rgba(239,68,68,.40)":"rgba(46,204,113,.40)"}`,color:"#fff"}}>
                  {isAdmin?"🛡️ Admin":"✅ Member"}
                </span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <Mail size={13} color="rgba(255,255,255,.65)"/>
                  <span style={{fontSize:13.5,color:"rgba(255,255,255,.82)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{user.email}</span>
                </div>
                {user.phone && (
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <PhoneIcon size={13} color="rgba(255,255,255,.65)"/>
                    <span style={{fontSize:13,color:"rgba(255,255,255,.75)",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>+91 {user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="pf-stats-row" style={{position:"relative",zIndex:1,display:"flex",gap:9}}>
            {stats.map((s,i) => (
              <div key={i} className="pf-stat-chip">
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:16,fontWeight:900,color:"#fff",lineHeight:1}}>{s.val}</span>
                <span style={{fontSize:10.5,color:"rgba(255,255,255,.58)",fontWeight:600}}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{position:"absolute",bottom:0,left:0,right:0,lineHeight:0}}>
            <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",display:"block"}}>
              <path d="M0,56 C360,0 1080,56 1440,14 L1440,56 Z" fill="#FFF9F2"/>
            </svg>
          </div>
        </div>

        {/* ══ CONTENT ══ */}
        <div className="pf-content" style={{maxWidth:860,margin:"0 auto",padding:"0 5vw 72px"}}>
          <div style={{marginTop:-28,position:"relative",zIndex:1,display:"flex",flexDirection:"column",gap:18}}>

            {/* ── Account Details ── */}
            <div className="pf-card">
              <div style={{padding:"18px 22px",borderBottom:"1.5px solid #F0ECE6",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,background:"#FFF3E8",border:"1.5px solid #FFD4A8",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><User size={18} color="#FF7A00"/></div>
                  <div>
                    <h2 style={{fontSize:15,fontWeight:900,color:"#2C2C2C",margin:0}}>Account Details</h2>
                    <p style={{fontSize:11.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",margin:0}}>Your personal information</p>
                  </div>
                </div>
                <button type="button" className="pf-edit-btn" onClick={openEdit}>
                  <Edit3 size={12}/> Edit Profile
                </button>
              </div>

              {[
                {icon:<User size={15} color="#FF7A00"/>,   label:"Full Name",     val:user.name,   bg:"#FFF3E8",border:"#FFD4A8"},
                {icon:<Mail size={15} color="#2ECC71"/>,   label:"Email Address", val:user.email,  bg:"#E8FAF0", border:"#A8E6C2"},
                ...(user.phone?[{icon:<PhoneIcon size={15} color="#FFC300"/>,label:"Phone Number",val:`+91 ${user.phone}`,bg:"#FFF8E1",border:"#FFE57A"}]:[]),
                {icon:<Shield size={15} color="#9B59B6"/>, label:"Account Role",  val:null,        bg:"#F5EEFF",border:"#D8B4FE",
                  custom:<span style={{fontSize:12,fontWeight:800,padding:"4px 12px",borderRadius:99,background:isAdmin?"#FEF2F2":"#E8FAF0",border:`1px solid ${isAdmin?"#FECACA":"#A8E6C2"}`,color:isAdmin?"#EF4444":"#27AE60"}}>{isAdmin?"🛡️ Administrator":"✅ Member"}</span>
                },
                {icon:<MapPin size={15} color="#FF7A00"/>, label:"Delivery Address",
                  val: (addr.street||addr.city||addr.state)
                    ? [addr.street,addr.city,addr.state,addr.postalCode].filter(Boolean).join(", ")
                    : "Not set — click Edit Profile to add",
                  bg:"#FFF3E8",border:"#FFD4A8"
                },
              ].map((row,i) => (
                <div key={i} className="pf-info-row">
                  <div style={{width:36,height:36,background:row.bg,border:`1.5px solid ${row.border}`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{row.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:10.5,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>{row.label}</div>
                    {row.custom
                      ? row.custom
                      : <div style={{fontSize:14,fontWeight:700,color:row.val?.startsWith("Not set")?"#C4BAB1":"#2C2C2C",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.val}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* ── Quick Links ── */}
            <div>
              <h3 style={{fontSize:13,fontWeight:800,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Quick Access</h3>
              <div className="pf-2col">
                {quickLinks.map((link,i) => (
                  <Link key={i} to={link.to} className="pf-link-card">
                    <div style={{width:44,height:44,background:link.bg,border:`2px solid ${link.border}`,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{link.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13.5,fontWeight:800,color:"#2C2C2C"}}>{link.label}</div>
                      <div style={{fontSize:11.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>{link.sub}</div>
                    </div>
                    <ChevronRight size={15} color="#C4BAB1"/>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Security ── */}
            <div className="pf-card">
              <div style={{padding:"18px 22px",borderBottom:"1.5px solid #F0ECE6",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><Lock size={18} color="#2563EB"/></div>
                <div>
                  <h2 style={{fontSize:15,fontWeight:900,color:"#2C2C2C",margin:0}}>Security</h2>
                  <p style={{fontSize:11.5,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",margin:0}}>Manage your account security</p>
                </div>
              </div>
              <div style={{padding:"16px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#2C2C2C",marginBottom:3}}>Password</div>
                  <div style={{fontSize:12,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>Keep your account secure with a strong password</div>
                </div>
                <button type="button"
                  style={{display:"inline-flex",alignItems:"center",gap:5,background:"#EFF6FF",border:"1.5px solid #BFDBFE",color:"#2563EB",borderRadius:10,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",transition:"all .15s"}}
                  onClick={()=>{setPwForm({current:"",newPw:"",confirm:""});setPwErr("");setPwOk(false);setPwOpen(true);}}
                  onMouseEnter={e=>{e.currentTarget.style.background="#2563EB";e.currentTarget.style.color="#fff";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="#EFF6FF";e.currentTarget.style.color="#2563EB";}}
                >
                  <Lock size={13}/> Change Password
                </button>
              </div>
            </div>

            {/* ── Promo ── */}
            {!isAdmin && (
              <div style={{background:"linear-gradient(135deg,#FF7A00 0%,#FF9A3C 50%,#FFB347 100%)",borderRadius:20,padding:"24px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px,rgba(255,255,255,.10) 1px,transparent 0)",backgroundSize:"22px 22px",pointerEvents:"none"}}/>
                <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.08)",pointerEvents:"none"}}/>
                <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
                  <div>
                    <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.65)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>🎉 SnapBite Member Offer</div>
                    <h3 style={{fontSize:"clamp(1.1rem,2vw,1.5rem)",fontWeight:900,color:"#fff",marginBottom:6,fontFamily:"'Sora',sans-serif"}}>50% off your next order</h3>
                    <p style={{fontSize:13,color:"rgba(255,255,255,.78)",fontFamily:"'Nunito',sans-serif",marginBottom:0}}>
                      Use code <strong style={{color:"#fff",background:"rgba(255,255,255,.22)",padding:"2px 8px",borderRadius:6}}>SAVE50</strong> at checkout
                    </p>
                  </div>
                  <Link to="/foods" style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff",color:"#FF7A00",textDecoration:"none",borderRadius:12,padding:"12px 24px",fontWeight:800,fontSize:13,boxShadow:"0 6px 20px rgba(0,0,0,.14)",flexShrink:0,transition:"transform .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                    Order Now →
                  </Link>
                </div>
              </div>
            )}

            {/* ── Logout ── */}
            <button className="pf-logout" onClick={logout}>
              <LogOut size={16}/> Sign Out of SnapBite
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          EDIT PROFILE MODAL
      ══════════════════════════════════════════ */}
      {editOpen && (
        <div className="pf-modal-overlay" onClick={()=>setEditOpen(false)}>
          <div className="pf-modal" onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#FF7A00,#FF9A3C)",padding:"22px 24px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.10)",pointerEvents:"none"}}/>
              <button type="button" onClick={()=>setEditOpen(false)} style={{position:"absolute",top:14,right:14,width:30,height:30,background:"rgba(255,255,255,.20)",border:"none",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.32)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.20)"}><X size={14} color="#fff"/></button>
              <div style={{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
                <div style={{width:40,height:40,background:"rgba(255,255,255,.22)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✏️</div>
                <div>
                  <h2 style={{fontSize:17,fontWeight:900,color:"#fff",margin:0}}>Edit Profile</h2>
                  <p style={{fontSize:12,color:"rgba(255,255,255,.75)",fontFamily:"'Nunito',sans-serif",margin:0}}>Update your personal details</p>
                </div>
              </div>
            </div>

            <div style={{padding:"22px 24px 28px",display:"flex",flexDirection:"column",gap:14}}>
              {editErr && (
                <div style={{display:"flex",alignItems:"flex-start",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"10px 13px"}}>
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0,marginTop:1}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600,lineHeight:1.5}}>{editErr}</span>
                </div>
              )}
              {editOk && (
                <div style={{display:"flex",alignItems:"center",gap:8,background:"#E8FAF0",border:"1.5px solid #A8E6C2",borderRadius:10,padding:"10px 13px"}}>
                  <CheckCircle size={14} color="#27AE60" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5,color:"#27AE60",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>Profile updated successfully!</span>
                </div>
              )}

              {/* Name */}
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <div style={{position:"relative"}}>
                  <User size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type="text" className={`pf-inp${editErr&&!editForm.name?" err":""}`} placeholder="Your full name" value={editForm.name} onChange={e=>setEditForm(p=>({...p,name:e.target.value}))}/>
                </div>
              </div>

              {/* Phone */}
              <div>
                <FieldLabel>Phone Number</FieldLabel>
                <div style={{position:"relative"}}>
                  <PhoneIcon size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                  <input type="tel" className="pf-inp" placeholder="98765 43210" value={editForm.phone} onChange={e=>setEditForm(p=>({...p,phone:e.target.value.replace(/[^\d\s]/g,"")}))} maxLength={11}/>
                </div>
              </div>

              {/* Address section */}
              <div style={{borderTop:"1px solid #F0ECE6",paddingTop:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:28,height:28,background:"#FFF3E8",border:"1.5px solid #FFD4A8",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Home size={13} color="#FF7A00"/>
                  </div>
                  <span style={{fontSize:12,fontWeight:800,color:"#5C5C6E",textTransform:"uppercase",letterSpacing:"0.06em"}}>Delivery Address</span>
                </div>

                {/* Street */}
                <div style={{marginBottom:10}}>
                  <FieldLabel>Street / Flat No.</FieldLabel>
                  <input type="text" className="pf-inp-bare" placeholder="Flat 4B, MG Road" value={editForm.street} onChange={e=>setEditForm(p=>({...p,street:e.target.value}))}/>
                </div>

                {/* City + State */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}} className="pf-row-2">
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <input type="text" className="pf-inp-bare" placeholder="Bangalore" value={editForm.city} onChange={e=>setEditForm(p=>({...p,city:e.target.value}))}/>
                  </div>
                  <div>
                    <FieldLabel>State</FieldLabel>
                    <input type="text" className="pf-inp-bare" placeholder="Karnataka" value={editForm.state} onChange={e=>setEditForm(p=>({...p,state:e.target.value}))}/>
                  </div>
                </div>

                {/* Postal + Country */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} className="pf-row-2">
                  <div>
                    <FieldLabel>Postal Code</FieldLabel>
                    <input type="text" className="pf-inp-bare" placeholder="560001" value={editForm.postalCode} onChange={e=>setEditForm(p=>({...p,postalCode:e.target.value.replace(/[^\d]/g,"")}))} maxLength={6}/>
                  </div>
                  <div>
                    <FieldLabel>Country</FieldLabel>
                    <input type="text" className="pf-inp-bare" placeholder="India" value={editForm.country} onChange={e=>setEditForm(p=>({...p,country:e.target.value}))}/>
                  </div>
                </div>
              </div>

              <p style={{fontSize:11,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",marginTop:-4}}>Email cannot be changed. Contact support if needed.</p>

              <button type="button" className="pf-modal-btn" disabled={editBusy||editOk} onClick={submitEdit}>
                {editBusy?<Spinner/>:editOk?<><Check size={15}/> Saved!</>:<><Save size={14}/> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PROFILE IMAGE MODAL
      ══════════════════════════════════════════ */}
      {imgOpen && (
        <div className="pf-modal-overlay" onClick={()=>setImgOpen(false)}>
          <div className="pf-modal" onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#2ECC71,#27AE60)",padding:"22px 24px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.10)",pointerEvents:"none"}}/>
              <button type="button" onClick={()=>setImgOpen(false)} style={{position:"absolute",top:14,right:14,width:30,height:30,background:"rgba(255,255,255,.20)",border:"none",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.32)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.20)"}><X size={14} color="#fff"/></button>
              <div style={{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
                <div style={{width:40,height:40,background:"rgba(255,255,255,.22)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📸</div>
                <div>
                  <h2 style={{fontSize:17,fontWeight:900,color:"#fff",margin:0}}>Profile Photo</h2>
                  <p style={{fontSize:12,color:"rgba(255,255,255,.75)",fontFamily:"'Nunito',sans-serif",margin:0}}>Upload a photo under 2MB</p>
                </div>
              </div>
            </div>
            <div style={{padding:"28px 24px",display:"flex",flexDirection:"column",gap:18,alignItems:"center"}}>
              {imgErr && (
                <div style={{width:"100%",display:"flex",alignItems:"flex-start",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"10px 13px"}}>
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0,marginTop:1}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600,lineHeight:1.5}}>{imgErr}</span>
                </div>
              )}
              <div style={{width:120,height:120,borderRadius:"50%",overflow:"hidden",border:"3px solid #F0ECE6",background:"#FFF9F2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,fontWeight:900,color:"#FF7A00"}}>
                {imgPreview?<img src={imgPreview} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:initials}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImagePick}/>
              <button type="button" onClick={()=>fileRef.current?.click()}
                style={{display:"flex",alignItems:"center",gap:7,background:"#FFF3E8",border:"1.5px solid #FFD4A8",color:"#FF7A00",borderRadius:11,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#FF7A00";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#FFF3E8";e.currentTarget.style.color="#FF7A00";}}
              >
                <Camera size={15}/> Choose Photo
              </button>
              <p style={{fontSize:12,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif",textAlign:"center",margin:0}}>JPG, PNG or WebP · Max 2MB</p>
              <button type="button" className="pf-modal-btn" style={{width:"100%"}} disabled={imgBusy||!imgPreview||imgPreview===user?.avatar} onClick={submitImage}>
                {imgBusy?<Spinner/>:<><Camera size={14}/> Save Photo</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          CHANGE PASSWORD MODAL
      ══════════════════════════════════════════ */}
      {pwOpen && (
        <div className="pf-modal-overlay" onClick={()=>setPwOpen(false)}>
          <div className="pf-modal" onClick={e=>e.stopPropagation()}>
            <div style={{background:"linear-gradient(135deg,#2563EB,#1D4ED8)",padding:"22px 24px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.10)",pointerEvents:"none"}}/>
              <button type="button" onClick={()=>setPwOpen(false)} style={{position:"absolute",top:14,right:14,width:30,height:30,background:"rgba(255,255,255,.20)",border:"none",borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.32)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.20)"}><X size={14} color="#fff"/></button>
              <div style={{display:"flex",alignItems:"center",gap:10,position:"relative",zIndex:1}}>
                <div style={{width:40,height:40,background:"rgba(255,255,255,.22)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><Lock size={20} color="#fff"/></div>
                <div>
                  <h2 style={{fontSize:17,fontWeight:900,color:"#fff",margin:0}}>Change Password</h2>
                  <p style={{fontSize:12,color:"rgba(255,255,255,.75)",fontFamily:"'Nunito',sans-serif",margin:0}}>Update your account password</p>
                </div>
              </div>
            </div>
            <div style={{padding:"24px 24px 28px",display:"flex",flexDirection:"column",gap:15}}>
              {pwErr && (
                <div style={{display:"flex",alignItems:"flex-start",gap:8,background:"#FEF2F2",border:"1.5px solid #FECACA",borderRadius:10,padding:"10px 13px"}}>
                  <AlertCircle size={14} color="#EF4444" style={{flexShrink:0,marginTop:1}}/>
                  <span style={{fontSize:12.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",fontWeight:600,lineHeight:1.5}}>{pwErr}</span>
                </div>
              )}
              {pwOk && (
                <div style={{display:"flex",alignItems:"center",gap:8,background:"#E8FAF0",border:"1.5px solid #A8E6C2",borderRadius:10,padding:"10px 13px"}}>
                  <CheckCircle size={14} color="#27AE60" style={{flexShrink:0}}/>
                  <span style={{fontSize:12.5,color:"#27AE60",fontFamily:"'Nunito',sans-serif",fontWeight:600}}>Password changed successfully!</span>
                </div>
              )}
              {[
                {key:"current", label:"Current Password",   placeholder:"Enter current password"},
                {key:"newPw",   label:"New Password",        placeholder:"Min. 6 characters"},
                {key:"confirm", label:"Confirm New Password",placeholder:"Repeat new password"},
              ].map(({key,label,placeholder}) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <div style={{position:"relative"}}>
                    <Lock size={14} color="#C4BAB1" style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                    <input type={showPw[key]?"text":"password"} className="pf-inp" placeholder={placeholder} value={pwForm[key]} onChange={e=>setPwForm(p=>({...p,[key]:e.target.value}))} style={{paddingRight:42}}/>
                    <button type="button" onClick={()=>setShowPw(p=>({...p,[key]:!p[key]}))} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#C4BAB1",display:"flex",padding:0}}>
                      {showPw[key]?<EyeOff size={14}/>:<Eye size={14}/>}
                    </button>
                  </div>
                </div>
              ))}
              {pwForm.newPw && pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                <p style={{fontSize:11.5,color:"#EF4444",fontFamily:"'Nunito',sans-serif",marginTop:-6}}>Passwords do not match</p>
              )}
              {pwForm.newPw && pwForm.confirm && pwForm.newPw === pwForm.confirm && (
                <p style={{fontSize:11.5,color:"#27AE60",fontFamily:"'Nunito',sans-serif",marginTop:-6,fontWeight:700}}>✓ Passwords match</p>
              )}
              <button type="button" className="pf-modal-btn" disabled={pwBusy||pwOk} onClick={submitPassword}>
                {pwBusy?<Spinner/>:pwOk?<><Check size={15}/> Changed!</>:<><Lock size={14}/> Update Password</>}
              </button>
              <p style={{textAlign:"center",fontSize:12,color:"#9CA3AF",fontFamily:"'Nunito',sans-serif"}}>
                Forgot your current password?{" "}
                <Link to="/forgot-password" style={{color:"#FF7A00",fontWeight:700,textDecoration:"none"}} onClick={()=>setPwOpen(false)}>Reset via email →</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}