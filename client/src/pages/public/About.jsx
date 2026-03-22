import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Star, Clock, MapPin, ChevronRight } from "lucide-react";

const team = [
  {
    name: "Aryan Mehta",
    role: "Co-Founder & CEO",
    emoji: "👨‍💼",
    bg: "#eff6ff",
    border: "#bfdbfe",
    bio: "Former chef turned tech founder. Started MyApp after waiting 90 minutes for cold biryani.",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & CTO",
    emoji: "👩‍💻",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    bio: "Ex-Google engineer. Built the routing algorithm that reduced delivery time by 40%.",
  },
  {
    name: "Kabir Nair",
    role: "Head of Operations",
    emoji: "🧑‍💼",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    bio: "Logistics expert managing 10,000+ delivery partners across the country.",
  },
  {
    name: "Zara Khan",
    role: "Head of Design",
    emoji: "👩‍🎨",
    bg: "#fff7ed",
    border: "#fed7aa",
    bio: "Passionate about every pixel. Redesigned the app that tripled user retention.",
  },
];

const milestones = [
  { year: "2019", title: "Founded",         desc: "Launched in Bangalore with 8 restaurants and 3 delivery partners.",              icon: "🌱" },
  { year: "2020", title: "Grew 400%",       desc: "Supported local restaurants through the pandemic. Demand surged 4x.",           icon: "📈" },
  { year: "2022", title: "1M Orders",       desc: "Hit our first million orders milestone. Celebrated with free food for a day.",  icon: "🎯" },
  { year: "2024", title: "500+ Cities",     desc: "Expanded pan-India with 50,000+ restaurants and 10,000+ delivery partners.",    icon: "🗺️" },
  { year: "2026", title: "What's Next",     desc: "AI-powered delivery, drone pilots launching, and global expansion begins.",     icon: "🚀" },
];

const values = [
  { icon: "⚡", title: "Speed First",      desc: "Every second matters when you're hungry. We obsess over delivery time.",       bg: "#fffbeb", border: "#fde68a" },
  { icon: "❤️", title: "Quality Always",   desc: "We partner only with restaurants that cook with passion and quality.",          bg: "#fdf2f8", border: "#f9a8d4" },
  { icon: "🌱", title: "Sustainable",      desc: "Eco-friendly packaging and a carbon-neutral fleet by 2027.",                    bg: "#f0fdf4", border: "#bbf7d0" },
  { icon: "🤝", title: "Community",        desc: "Empowering local restaurants and delivery partners with fair earnings.",        bg: "#eff6ff", border: "#bfdbfe" },
  { icon: "🔒", title: "Trust & Safety",   desc: "Every order tracked. Every partner verified. Your safety is non-negotiable.",  bg: "#f5f3ff", border: "#ddd6fe" },
  { icon: "🚀", title: "Always Innovating",desc: "Drone deliveries, AI recommendations — we stay ahead of the curve.",           bg: "#fff7ed", border: "#fed7aa" },
];

const stats = [
  { val: "50K+",   label: "Restaurant Partners", icon: "🍽️" },
  { val: "2M+",    label: "Happy Customers",      icon: "😊" },
  { val: "10K+",   label: "Delivery Heroes",      icon: "🛵" },
  { val: "500+",   label: "Cities Covered",        icon: "🏙️" },
];

const About = () => {
  return (
    <div
      className="w-full min-h-screen bg-white"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >

      {/* ─────────────────────────────────────────────────────
          HERO — full width, matches Home.jsx hero style
      ───────────────────────────────────────────────────── */}
      <section
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #1d4ed8 100%)",
          padding: "100px 5vw 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* background circles */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 360, height: 360, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Home</Link>
            <ChevronRight size={13} color="rgba(255,255,255,0.35)" />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>About Us</span>
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 100, padding: "8px 18px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 14 }}>🍽️</span>
            <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>
              Our Story
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900, color: "#fff",
            lineHeight: 1.08, letterSpacing: "-0.02em",
            marginBottom: 20,
          }}>
            We're not just<br />
            <span style={{ color: "#fbbf24" }}>delivering food.</span>
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.7)", fontSize: "clamp(1rem, 1.5vw, 1.18rem)",
            lineHeight: 1.75, maxWidth: 540, marginBottom: 36,
          }}>
            We're delivering moments — the joy of a hot meal, the comfort of your favourite dish,
            the magic of a family dinner you didn't have to cook.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              to="/foods"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fbbf24", color: "#1f2937",
                fontWeight: 800, fontSize: 15,
                padding: "14px 28px", borderRadius: 12,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(251,191,36,0.4)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Browse Menu <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                padding: "14px 28px", borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          STATS STRIP — full width
      ───────────────────────────────────────────────────── */}
      <section style={{
        width: "100%",
        background: "linear-gradient(90deg, #1d4ed8, #2563eb)",
        padding: "0 5vw",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "32px 20px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.12)" : "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          ORIGIN STORY — full width split
      ───────────────────────────────────────────────────── */}
      <section style={{ width: "100%", background: "#fff", padding: "80px 5vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left: Copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#eff6ff", border: "1px solid #bfdbfe",
              borderRadius: 100, padding: "6px 16px", marginBottom: 24,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>Our Origin</span>
            </div>

            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 24 }}>
              It started with<br />
              <span style={{ color: "#2563eb" }}>bad biryani. 🍛</span>
            </h2>

            {[
              "In 2019, our founder Aryan ordered biryani at 7 PM. It arrived at 9:30 PM — cold, soggy, and wrong. That night, instead of complaining, he started building.",
              "He called his college friend Priya, a software engineer at Google, and said: \"Food delivery in India is broken. Let's fix it.\"",
              "Six months later, MyApp went live in Bangalore with 8 restaurants, 3 delivery partners, and one very stubborn vision — food should arrive hot, fast, and exactly as ordered.",
            ].map((para, i) => (
              <p key={i} style={{ color: "#475569", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
                {para}
              </p>
            ))}

            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              {[
                { label: "That first wait", val: "90 min", bad: true },
                { label: "Our average today", val: "18 min", bad: false },
              ].map((s) => (
                <div key={s.label} style={{
                  flex: 1, minWidth: 140,
                  background: s.bad ? "#fff1f2" : "#f0fdf4",
                  border: `2px solid ${s.bad ? "#fecdd3" : "#bbf7d0"}`,
                  borderRadius: 16, padding: "20px 24px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.bad ? "#e11d48" : "#16a34a" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
              border: "2px solid #e0e7ff",
              borderRadius: 28, padding: "48px 40px",
              textAlign: "center", position: "relative",
            }}>
              <div style={{ fontSize: 80, marginBottom: 20 }}>🍱</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>The Biryani That</h3>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#2563eb", marginBottom: 32 }}>Changed Everything</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { val: "8",    label: "First Restaurants" },
                  { val: "3",    label: "First Partners"    },
                  { val: "2019", label: "Founded"           },
                  { val: "🏙️ BLR", label: "First City"     },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "#fff", borderRadius: 14, padding: "16px 12px",
                    border: "1px solid #e0e7ff",
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "#2563eb" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* decorative dots */}
            <div style={{ position: "absolute", top: -16, right: -16, width: 56, height: 56, background: "#fbbf24", borderRadius: 16, opacity: 0.25 }} />
            <div style={{ position: "absolute", bottom: -12, left: -12, width: 40, height: 40, background: "#2563eb", borderRadius: 10, opacity: 0.15 }} />
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          VALUES — full width gray bg
      ───────────────────────────────────────────────────── */}
      <section style={{ width: "100%", background: "#f8fafc", padding: "80px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>Core Values</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>What we stand for</h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            Six principles that guide every delivery, every decision, every day.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {values.map((v) => (
            <div
              key={v.title}
              style={{
                background: v.bg, border: `2px solid ${v.border}`,
                borderRadius: 20, padding: "32px 28px",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          TIMELINE — full width white
      ───────────────────────────────────────────────────── */}
      <section style={{ width: "100%", background: "#fff", padding: "80px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>Our Journey</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0f172a" }}>How far we've come</h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          {/* vertical line */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: 2, background: "linear-gradient(to bottom, #2563eb, #e2e8f0)",
            transform: "translateX(-50%)",
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {milestones.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                {/* Left card (even) or empty */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {i % 2 === 0 ? (
                    <div
                      style={{
                        background: "#f8fafc", border: "2px solid #e2e8f0",
                        borderRadius: 18, padding: "24px 28px", maxWidth: 300,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>{m.year}</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{m.title}</div>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                    </div>
                  ) : <div />}
                </div>

                {/* Center dot */}
                <div style={{
                  width: 48, height: 48, flexShrink: 0,
                  background: "#2563eb", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, boxShadow: "0 0 0 6px #eff6ff, 0 4px 16px rgba(37,99,235,0.25)",
                  zIndex: 1,
                }}>
                  {m.icon}
                </div>

                {/* Right card (odd) or empty */}
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  {i % 2 !== 0 ? (
                    <div
                      style={{
                        background: "#f8fafc", border: "2px solid #e2e8f0",
                        borderRadius: 18, padding: "24px 28px", maxWidth: 300,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.1)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#2563eb", letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>{m.year}</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{m.title}</div>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                    </div>
                  ) : <div />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          TEAM — full width gray bg
      ───────────────────────────────────────────────────── */}
      <section style={{ width: "100%", background: "#f8fafc", padding: "80px 5vw" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#eff6ff", border: "1px solid #bfdbfe",
            borderRadius: 100, padding: "6px 16px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase" }}>The Team</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>Meet the dreamers</h2>
          <p style={{ color: "#64748b", fontSize: 16, maxWidth: 420, margin: "0 auto" }}>
            The small but mighty team behind every great delivery.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {team.map((member) => (
            <div
              key={member.name}
              style={{
                background: "#fff",
                border: "2px solid #f1f5f9",
                borderRadius: 20, overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#f1f5f9"; }}
            >
              {/* Avatar area */}
              <div style={{
                background: `linear-gradient(135deg, ${member.bg}, #fff)`,
                borderBottom: `2px solid ${member.border}`,
                padding: "32px 20px",
                textAlign: "center",
              }}>
                <div style={{
                  width: 80, height: 80,
                  background: member.bg, border: `2px solid ${member.border}`,
                  borderRadius: "50%", margin: "0 auto 14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36,
                }}>
                  {member.emoji}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{member.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginTop: 4, letterSpacing: "0.02em" }}>{member.role}</div>
              </div>

              <div style={{ padding: "18px 20px" }}>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          CTA — full width blue
      ───────────────────────────────────────────────────── */}
      <section style={{
        width: "100%",
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
        padding: "80px 5vw",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🤝</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Hungry for more?{" "}
            <span style={{ color: "#fbbf24" }}>So are we.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Whether you're a restaurant owner, a delivery partner, or a food-obsessed engineer — we'd love to have you on board.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "🍴 Partner with Us", to: "/contact", primary: true  },
              { label: "💼 Join Our Team",   to: "/contact", primary: false },
              { label: "🛵 Deliver with Us", to: "/contact", primary: false },
            ].map((btn) => (
              <Link
                key={btn.label}
                to={btn.to}
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "14px 28px", borderRadius: 12,
                  fontWeight: 800, fontSize: 15,
                  textDecoration: "none",
                  background: btn.primary ? "#fbbf24" : "rgba(255,255,255,0.12)",
                  color: btn.primary ? "#1f2937" : "#fff",
                  border: btn.primary ? "none" : "1.5px solid rgba(255,255,255,0.28)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  boxShadow: btn.primary ? "0 4px 20px rgba(251,191,36,0.4)" : "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────
          FOOTER — full width dark (matches Home.jsx)
      ───────────────────────────────────────────────────── */}
      <footer style={{ width: "100%", background: "#0f172a", padding: "56px 5vw 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#60a5fa", marginBottom: 14 }}>MyApp</div>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Delivering happiness to your doorstep, one meal at a time.
            </p>
          </div>
          {[
            { title: "Navigate", links: [{ l: "Home", to: "/" }, { l: "Foods", to: "/foods" }, { l: "About", to: "/about" }, { l: "Contact", to: "/contact" }] },
            { title: "Account",  links: [{ l: "Login", to: "/login" }, { l: "Register", to: "/register" }, { l: "My Orders", to: "/my-orders" }, { l: "Admin", to: "/admin" }] },
            { title: "Support",  links: [{ l: "Help Centre", to: "/" }, { l: "Privacy Policy", to: "/" }, { l: "Terms of Use", to: "/" }, { l: "Contact Us", to: "/contact" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ color: "#f1f5f9", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l) => (
                  <li key={l.l}>
                    <Link
                      to={l.to}
                      style={{ color: "#475569", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = "#60a5fa"}
                      onMouseLeave={e => e.target.style.color = "#475569"}
                    >
                      {l.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>© 2026 MyApp. All rights reserved.</p>
          <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>Made with 🧡 for food lovers</p>
        </div>
      </footer>

    </div>
  );
};

export default About;