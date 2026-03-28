import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart, X, Trash2, Plus, Minus, Menu,
  Home, Info, Phone, UtensilsCrossed, ClipboardList, Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const NavStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');

    :root {
      --orange: #FF7A00; --orange-dark: #E06A00; --orange-light: #FFF3E8;
      --green: #2ECC71; --green-light: #E8FAF0;
      --yellow-light: #FFF8E1; --cream: #FFF9F2; --navy: #1A1A2E;
      --text: #2C2C2C; --text-mid: #5C5C6E; --text-light: #9CA3AF;
      --border: #F0ECE6; --white: #FFFFFF;
    }
    *, *::before, *::after { box-sizing: border-box; }

    .nb-root {
      font-family: 'Sora', sans-serif;
      position: fixed; top: 0; left: 0; right: 0; z-index: 900;
      transition: all 0.3s ease;
    }
    .nb-root.scrolled {
      background: rgba(255,255,255,0.97) !important;
      backdrop-filter: blur(16px);
      box-shadow: 0 2px 24px rgba(255,122,0,0.10);
    }
    .nb-root.top {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 var(--border);
    }

    .nb-link {
      position: relative; font-size: 13px; font-weight: 600;
      color: var(--text-mid); text-decoration: none;
      padding: 6px 2px; transition: color 0.18s ease; white-space: nowrap;
    }
    .nb-link::after {
      content: ''; position: absolute; left: 0; bottom: -2px; right: 0;
      height: 2px; background: var(--orange); border-radius: 99px;
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.22s cubic-bezier(.34,1.56,.64,1);
    }
    .nb-link:hover { color: var(--orange); }
    .nb-link:hover::after, .nb-link.active::after { transform: scaleX(1); }
    .nb-link.active { color: var(--orange); }

    .nb-cart-btn {
      position: relative; background: none; border: none; cursor: pointer;
      padding: 8px; border-radius: 12px;
      transition: background 0.18s ease;
      display: flex; align-items: center; justify-content: center;
    }
    .nb-cart-btn:hover { background: var(--orange-light); }

    .nb-cart-badge {
      position: absolute; top: 2px; right: 2px;
      min-width: 18px; height: 18px;
      background: var(--orange); color: #fff;
      font-size: 10px; font-weight: 800;
      border-radius: 99px; padding: 0 4px;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
      animation: badge-pop 0.3s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes badge-pop { from{transform:scale(0)} to{transform:scale(1)} }

    .nb-hamburger {
      background: none; border: none; cursor: pointer; padding: 8px;
      border-radius: 10px; display: none; align-items: center; justify-content: center;
      transition: background 0.18s;
    }
    .nb-hamburger:hover { background: var(--orange-light); }

    .nb-btn-ghost {
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
      color: var(--text-mid); background: none; border: 1.5px solid var(--border);
      border-radius: 10px; padding: 7px 16px; text-decoration: none; cursor: pointer;
      transition: all 0.18s ease; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
    }
    .nb-btn-ghost:hover { border-color: var(--orange); color: var(--orange); background: var(--orange-light); }

    .nb-btn-solid {
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 800;
      color: #fff; background: var(--orange); border: 1.5px solid var(--orange);
      border-radius: 10px; padding: 7px 18px; text-decoration: none; cursor: pointer;
      transition: all 0.18s ease; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px;
      box-shadow: 0 4px 14px rgba(255,122,0,0.28);
    }
    .nb-btn-solid:hover { background: var(--orange-dark); border-color: var(--orange-dark); transform: translateY(-1px); }

    .nb-btn-logout {
      font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700;
      color: #EF4444; background: #FEF2F2; border: 1.5px solid #FECACA;
      border-radius: 10px; padding: 7px 14px; cursor: pointer;
      transition: all 0.18s ease; white-space: nowrap;
    }
    .nb-btn-logout:hover { background: #EF4444; color: #fff; border-color: #EF4444; }

    .nb-user-chip {
      display: flex; align-items: center; gap: 8px;
      background: var(--green-light); border: 1.5px solid rgba(46,204,113,0.3);
      border-radius: 99px; padding: 5px 14px 5px 5px;
    }
    .nb-user-avatar {
      width: 26px; height: 26px; background: var(--green);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
    }
    .nb-user-name {
      font-size: 12px; font-weight: 700; color: var(--text);
      max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes slideInLeft  { from{transform:translateX(-100%)} to{transform:translateX(0)} }
    @keyframes slideInRight { from{transform:translateX(100%)}  to{transform:translateX(0)} }

    .nb-mobile-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 950; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease;
    }
    .nb-mobile-drawer {
      position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: #fff;
      z-index: 960; overflow-y: auto;
      animation: slideInLeft 0.28s cubic-bezier(.34,1.2,.64,1) both;
      box-shadow: 4px 0 40px rgba(0,0,0,0.15);
    }
    .nb-cart-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.50);
      z-index: 970; backdrop-filter: blur(6px); animation: fadeIn 0.2s ease;
    }
    .nb-cart-sidebar {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: min(400px, 100vw); background: #fff;
      z-index: 980; display: flex; flex-direction: column;
      animation: slideInRight 0.28s cubic-bezier(.34,1.2,.64,1) both;
      box-shadow: -4px 0 48px rgba(0,0,0,0.14);
    }

    .nb-drawer-link {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 20px; font-size: 14px; font-weight: 600;
      color: var(--text-mid); text-decoration: none;
      border-radius: 12px; margin: 2px 10px; transition: all 0.15s ease;
    }
    .nb-drawer-link:hover, .nb-drawer-link.active { background: var(--orange-light); color: var(--orange); }

    .cart-item-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0; border-bottom: 1px solid var(--border);
    }
    .cart-item-row:last-child { border-bottom: none; }

    /* ── qty buttons ── */
    .qty-btn {
      width: 28px; height: 28px;
      background: var(--cream); border: 1.5px solid var(--border);
      border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s ease; flex-shrink: 0;
      /* CRITICAL: always button type to prevent form submit */
    }
    .qty-btn:hover         { background: var(--orange-light); border-color: var(--orange); }
    .qty-btn.minus:hover   { background: #FEF2F2; border-color: #FECACA; }
    .qty-btn:active        { transform: scale(0.90); }

    .remove-btn {
      background: none; border: none; cursor: pointer;
      color: var(--text-light); padding: 6px;
      border-radius: 8px; display: flex; align-items: center;
      transition: all 0.15s ease; flex-shrink: 0;
    }
    .remove-btn:hover { background: #FEF2F2; color: #EF4444; }

    .checkout-btn {
      width: 100%; padding: 14px;
      background: var(--orange); color: #fff; border: none;
      border-radius: 14px; font-family: 'Sora', sans-serif;
      font-size: 15px; font-weight: 800; cursor: pointer;
      transition: all 0.18s ease;
      box-shadow: 0 6px 22px rgba(255,122,0,0.32);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .checkout-btn:hover { background: var(--orange-dark); transform: translateY(-1px); box-shadow: 0 10px 28px rgba(255,122,0,0.40); }

    .clear-btn {
      background: none; border: 1.5px solid var(--border);
      color: var(--text-light); font-family: 'Sora', sans-serif;
      font-size: 12px; font-weight: 600;
      border-radius: 8px; padding: 6px 14px; cursor: pointer;
      transition: all 0.15s ease;
    }
    .clear-btn:hover { border-color: #FECACA; color: #EF4444; background: #FEF2F2; }

    @keyframes float-empty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .empty-cart-icon { animation: float-empty 3s ease-in-out infinite; }

    @media (max-width: 768px) {
      .nb-desktop-links { display: none !important; }
      .nb-hamburger     { display: flex !important; }
    }
  `}</style>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  /* ── Use your CartContext's exact function names ── */
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCartOpen,   setIsCartOpen]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  const totalItems = cartItems.reduce((a, i) => a + i.quantity, 0);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const navLinks = [
    { to: "/",        label: "Home",    Icon: Home            },
    { to: "/foods",   label: "Foods",   Icon: UtensilsCrossed },
    { to: "/about",   label: "About",   Icon: Info            },
    { to: "/contact", label: "Contact", Icon: Phone           },
  ];

  /* ── Safe qty handlers — e.preventDefault + e.stopPropagation always ── */
  const onInc = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    increaseQty(id);
  };
  const onDec = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    decreaseQty(id);
  };
  const onRemove = (e, id) => {
    e.preventDefault(); e.stopPropagation();
    removeFromCart(id);
  };

  return (
    <>
      <NavStyles />

      {/* ══ NAVBAR ══ */}
      <nav className={`nb-root ${scrolled ? "scrolled" : "top"}`}>
        <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 20px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>

          {/* Logo */}
          <Link to="/" style={{ display:"flex", alignItems:"center", gap:8, textDecoration:"none", flexShrink:0 }}>
            <div style={{ width:34, height:34, background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(255,122,0,0.30)", fontSize:18 }}>🍔</div>
            <span style={{ fontFamily:"'Sora',sans-serif", fontSize:18, fontWeight:900, background:"linear-gradient(135deg,#FF7A00,#E06A00)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              MyApp
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nb-desktop-links" style={{ display:"flex", alignItems:"center", gap:28, flex:1, justifyContent:"center" }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`nb-link${isActive(to) ? " active" : ""}`}>{label}</Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>

            {/* Cart icon */}
            <button type="button" className="nb-cart-btn" onClick={() => setIsCartOpen(true)} title="Open cart">
              <ShoppingCart size={20} color={totalItems > 0 ? "var(--orange)" : "var(--text-mid)"}/>
              {totalItems > 0 && (
                <span className="nb-cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>
              )}
            </button>

            {/* Desktop auth */}
            <div className="nb-desktop-links" style={{ display:"flex", alignItems:"center", gap:10 }}>
              {user ? (
                <>
                  <div className="nb-user-chip">
                    <div className="nb-user-avatar">{initials}</div>
                    <span className="nb-user-name">{user.name}</span>
                  </div>
                  {user.role !== "admin" && (
                    <Link to="/my-orders" className="nb-btn-ghost"
                      style={isActive("/my-orders") ? { borderColor:"var(--orange)", color:"var(--orange)", background:"var(--orange-light)" } : {}}>
                      <ClipboardList size={13}/> Orders
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link to="/admin" className="nb-btn-ghost"
                      style={isActive("/admin") ? { borderColor:"var(--orange)", color:"var(--orange)", background:"var(--orange-light)" } : {}}>
                      <Settings size={13}/> Admin
                    </Link>
                  )}
                  <button type="button" className="nb-btn-logout" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login"    className="nb-btn-ghost">Login</Link>
                  <Link to="/register" className="nb-btn-solid">Get Started</Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button type="button" className="nb-hamburger" onClick={() => setIsMobileOpen(true)}>
              <Menu size={20} color="var(--text-mid)"/>
            </button>
          </div>
        </div>
      </nav>

      {/* ══ MOBILE DRAWER ══ */}
      {isMobileOpen && (
        <>
          <div className="nb-mobile-overlay" onClick={() => setIsMobileOpen(false)}/>
          <div className="nb-mobile-drawer">
            <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32, height:32, background:"linear-gradient(135deg,#FF7A00,#FF9A3C)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🍔</div>
                <span style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:900, background:"linear-gradient(135deg,#FF7A00,#E06A00)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>MyApp</span>
              </div>
              <button type="button" onClick={() => setIsMobileOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", padding:6, borderRadius:8, display:"flex" }}>
                <X size={18} color="var(--text-mid)"/>
              </button>
            </div>

            {user && (
              <div style={{ margin:"14px 10px", padding:"14px 16px", background:"var(--green-light)", borderRadius:14, border:"1px solid rgba(46,204,113,0.25)", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, background:"var(--green)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#fff", flexShrink:0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--text)" }}>{user.name}</div>
                  <div style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>{user.role === "admin" ? "🛡️ Administrator" : "✅ Active Member"}</div>
                </div>
              </div>
            )}

            <div style={{ padding:"8px 0" }}>
              <div style={{ padding:"6px 20px 8px", fontSize:10, fontWeight:800, color:"var(--text-light)", letterSpacing:"0.10em", textTransform:"uppercase" }}>Navigation</div>
              {navLinks.map(({ to, label, Icon }) => (
                <Link key={to} to={to} className={`nb-drawer-link${isActive(to) ? " active" : ""}`}>
                  <Icon size={16}/>{label}
                </Link>
              ))}
              {user?.role !== "admin" && (
                <Link to="/my-orders" className={`nb-drawer-link${isActive("/my-orders") ? " active" : ""}`}>
                  <ClipboardList size={16}/> My Orders
                </Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin" className={`nb-drawer-link${isActive("/admin") ? " active" : ""}`}>
                  <Settings size={16}/> Admin Panel
                </Link>
              )}
            </div>

            <div style={{ height:1, background:"var(--border)", margin:"8px 20px" }}/>

            <div style={{ padding:"8px 10px 20px", display:"flex", flexDirection:"column", gap:8 }}>
              {user ? (
                <button type="button" onClick={() => { logout(); setIsMobileOpen(false); }}
                  style={{ width:"100%", padding:"12px", background:"#FEF2F2", border:"1.5px solid #FECACA", color:"#EF4444", borderRadius:12, fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, cursor:"pointer" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="#EF4444"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#EF4444"; }}
                >Sign Out</button>
              ) : (
                <>
                  <Link to="/login" style={{ display:"block", textAlign:"center", padding:"12px", background:"var(--cream)", border:"1.5px solid var(--border)", color:"var(--text-mid)", borderRadius:12, fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, textDecoration:"none" }}>Login</Link>
                  <Link to="/register" style={{ display:"block", textAlign:"center", padding:"12px", background:"var(--orange)", color:"#fff", borderRadius:12, fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, textDecoration:"none", boxShadow:"0 4px 16px rgba(255,122,0,0.30)" }}>Get Started Free →</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══ CART SIDEBAR ══ */}
      {isCartOpen && (
        <>
          <div className="nb-cart-overlay" onClick={() => setIsCartOpen(false)}/>
          <div className="nb-cart-sidebar">

            {/* Header */}
            <div style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, background:"var(--orange-light)", borderRadius:11, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <ShoppingCart size={17} color="var(--orange)"/>
                </div>
                <div>
                  <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:16, fontWeight:900, color:"var(--text)", margin:0 }}>Your Cart</h2>
                  <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"var(--text-light)", margin:0 }}>{totalItems} {totalItems === 1 ? "item" : "items"}</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {cartItems.length > 0 && (
                  <button type="button" className="clear-btn" onClick={clearCart}>Clear all</button>
                )}
                <button type="button" onClick={() => setIsCartOpen(false)}
                  style={{ background:"none", border:"none", cursor:"pointer", padding:6, borderRadius:8, display:"flex", color:"var(--text-light)" }}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--cream)"}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}
                >
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Items */}
            <div style={{ flex:1, overflowY:"auto", padding:"0 20px" }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div className="empty-cart-icon" style={{ fontSize:64, marginBottom:16 }}>🛒</div>
                  <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:800, color:"var(--text)", marginBottom:8 }}>Your cart is empty</h3>
                  <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:"var(--text-light)", marginBottom:24 }}>Add some delicious food to get started!</p>
                  <button type="button" onClick={() => { setIsCartOpen(false); navigate("/foods"); }}
                    style={{ background:"var(--orange)", color:"#fff", border:"none", borderRadius:12, padding:"11px 28px", fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 16px rgba(255,122,0,0.28)" }}
                  >
                    Browse Menu →
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item._id} className="cart-item-row">
                    {/* Thumbnail */}
                    <img src={item.thumbnail} alt={item.name}
                      style={{ width:60, height:60, borderRadius:12, objectFit:"cover", flexShrink:0 }}
                    />
                    {/* Info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"var(--text)", margin:"0 0 3px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {item.name}
                      </h4>
                      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"var(--text-light)", margin:"0 0 8px" }}>
                        ₹{item.price} each
                      </p>
                      {/* ── QTY CONTROLS — type="button" is CRITICAL ── */}
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <button
                          type="button"
                          className="qty-btn minus"
                          onClick={e => onDec(e, item._id)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} color="var(--text-mid)"/>
                        </button>
                        <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:800, color:"var(--text)", minWidth:22, textAlign:"center", userSelect:"none" }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={e => onInc(e, item._id)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} color="var(--orange)"/>
                        </button>
                      </div>
                    </div>
                    {/* Subtotal + remove */}
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                      <span style={{ fontFamily:"'Sora',sans-serif", fontSize:14, fontWeight:900, color:"var(--orange)" }}>
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={e => onRemove(e, item._id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15}/>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding:"16px 20px 24px", borderTop:"1px solid var(--border)", background:"#fff", flexShrink:0 }}>
                <div style={{ background:"var(--cream)", borderRadius:14, padding:"14px 16px", marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"var(--text-mid)" }}>Subtotal</span>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"var(--text)" }}>₹{totalPrice}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"var(--text-mid)" }}>Delivery fee</span>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:700, color:"var(--green)" }}>FREE</span>
                  </div>
                  <div style={{ height:1, background:"var(--border)", margin:"10px 0" }}/>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:15, fontWeight:800, color:"var(--text)" }}>Total</span>
                    <span style={{ fontFamily:"'Sora',sans-serif", fontSize:17, fontWeight:900, color:"var(--orange)" }}>₹{totalPrice}</span>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--yellow-light)", border:"1px solid rgba(255,195,0,0.40)", borderRadius:10, padding:"8px 12px", marginBottom:14 }}>
                  <span style={{ fontSize:14 }}>🎉</span>
                  <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700, color:"#92670A" }}>Free delivery applied! Save ₹49</span>
                </div>
                <button type="button" className="checkout-btn" onClick={() => { setIsCartOpen(false); navigate("/checkout"); }}>
                  <ShoppingCart size={17}/> Proceed to Checkout · ₹{totalPrice}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}