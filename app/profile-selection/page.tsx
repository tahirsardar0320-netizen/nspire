"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const INSPECTOR_TYPES = [
  { id: "hud-certified-nspire", label: "I'm a HUD certified NSPIRE inspector", emoji: "🏛️" },
  { id: "nspire-certified",     label: "I'm a Nspire certified inspector",      emoji: "✅" },
  { id: "home-inspector",       label: "I'm a Home Inspector",                  emoji: "🏠" },
  { id: "multi-unit-inspector", label: "I'm a Multi Unit Inspector",            emoji: "🏢" },
]

export default function ProfileSelection() {
  const router = useRouter()
  const [typeOpen, setTypeOpen] = useState(false)

  return (
    <div className="ps-root">
      {/* Floating background blobs */}
      <div className="ps-blob ps-blob-1" />
      <div className="ps-blob ps-blob-2" />
      <div className="ps-blob ps-blob-3" />

      {/* Logo */}
      <div className="ps-logo" onClick={() => router.push("/")}>
        <Image src="/logo.png" alt="NSPIRE Logo" width={180} height={65} className="h-14 w-auto" priority />
      </div>

      {/* Heading */}
      <div className="ps-header">
        <h1 className="ps-title">Choose Your Portal</h1>
        <p className="ps-subtitle">Select how you want to continue to NSPIRE</p>
      </div>

      {/* Cards row */}
      <div className="ps-cards">

        {/* Inspector Login */}
        <button className="ps-bubble group" onClick={() => router.push("/login?role=inspector")}>
          <div className="ps-bubble-icon" style={{ background: "linear-gradient(135deg,#38bdf8,#006795)" }}>
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
              <rect x="10" y="6" width="28" height="36" rx="3" stroke="white" strokeWidth="2.5" fill="none"/>
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="24" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="33" r="2" fill="white"/>
              <line x1="25" y1="33" x2="32" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="ps-bubble-title">Inspector Login</h2>
          <p className="ps-bubble-desc">For field inspectors conducting property compliance checks</p>
          <div className="ps-bubble-btn" style={{ background: "linear-gradient(135deg,#38bdf8,#006795)" }}>
            Continue <span className="ps-arrow group-hover:translate-x-1">→</span>
          </div>
          <div className="ps-bubble-shine" />
        </button>

        {/* Management Login */}
        <button className="ps-bubble group" onClick={() => router.push("/management/login")}>
          <div className="ps-bubble-icon" style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}>
            <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
              <rect x="8"  y="8"  width="14" height="14" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
              <rect x="26" y="8"  width="14" height="14" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
              <rect x="8"  y="26" width="14" height="14" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
              <rect x="26" y="26" width="14" height="14" rx="2" stroke="white" strokeWidth="2.5" fill="none"/>
            </svg>
          </div>
          <h2 className="ps-bubble-title">Management Login</h2>
          <p className="ps-bubble-desc">For property managers and supervisors overseeing inspections</p>
          <div className="ps-bubble-btn" style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)" }}>
            Continue <span className="ps-arrow group-hover:translate-x-1">→</span>
          </div>
          <div className="ps-bubble-shine" />
        </button>

        {/* Inspector Types */}
        <div className="ps-bubble-wrap">
          <button
            className={`ps-bubble group${typeOpen ? " ps-bubble-active" : ""}`}
            onClick={() => setTypeOpen(o => !o)}
          >
            <div className="ps-bubble-icon" style={{ background: "linear-gradient(135deg,#fb923c,#e11d48)" }}>
              <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                <circle cx="24" cy="16" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
                <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <line x1="33" y1="30" x2="40" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="36.5" y1="26.5" x2="36.5" y2="33.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="ps-bubble-title">Inspector Types</h2>
            <p className="ps-bubble-desc">Select your certification type to access the right inspector portal</p>
            <div className="ps-bubble-btn" style={{ background: "linear-gradient(135deg,#fb923c,#e11d48)" }}>
              {typeOpen ? "Close ✕" : "Select Type"}
              {!typeOpen && <span className="ps-arrow group-hover:translate-x-1">→</span>}
            </div>
            <div className="ps-bubble-shine" />
          </button>

          {/* Dropdown */}
          <div className={`ps-dropdown${typeOpen ? " ps-dropdown-open" : ""}`}>
            <p className="ps-dropdown-label">Select your inspector type:</p>
            {INSPECTOR_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => router.push(`/login?role=inspector&type=${t.id}`)}
                className="ps-type-row group"
              >
                <span className="ps-type-emoji">{t.emoji}</span>
                <span className="ps-type-text">{t.label}</span>
                <span className="ps-type-arrow group-hover:translate-x-1">→</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <p className="ps-footer">
        New here?{" "}
        <button className="ps-footer-link" onClick={() => router.push("/signup")}>
          Create an account
        </button>
      </p>

      <style jsx>{`
        /* ─── Root ─── */
        .ps-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 2.5rem 1rem 3rem;
          background: linear-gradient(160deg, #dff2fb 0%, #eaf6ff 35%, #f0f9ff 60%, #e0f3fa 100%);
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        /* ─── Background blobs ─── */
        .ps-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
        .ps-blob-1 { width: 500px; height: 500px; background: rgba(0,103,149,0.12); top: -120px; left: -150px; }
        .ps-blob-2 { width: 380px; height: 380px; background: rgba(124,58,237,0.08); bottom: -80px; right: -100px; }
        .ps-blob-3 { width: 280px; height: 280px; background: rgba(251,146,60,0.1);  top: 50%; left: 50%; transform: translate(-50%,-50%); }

        /* ─── Logo ─── */
        .ps-logo {
          position: relative;
          z-index: 10;
          cursor: pointer;
          margin-bottom: 1.75rem;
          filter: drop-shadow(0 2px 8px rgba(0,103,149,0.15));
        }

        /* ─── Header ─── */
        .ps-header {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .ps-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #0c4a6e;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .ps-subtitle {
          font-size: 1rem;
          color: #0369a1;
          opacity: 0.8;
        }

        /* ─── Cards row ─── */
        .ps-cards {
          position: relative;
          z-index: 10;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
          max-width: 960px;
          align-items: start;
          overflow: visible;
        }
        @media (max-width: 700px) {
          .ps-cards { grid-template-columns: 1fr; max-width: 400px; }
        }

        /* ─── Glass bubble card ─── */
        .ps-bubble-wrap { position: relative; }

        .ps-bubble {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.9rem;
          padding: 2rem 1.5rem 1.75rem;
          border-radius: 2rem;
          background: rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          box-shadow:
            0 8px 32px rgba(0,103,149,0.08),
            0 1.5px 0px rgba(255,255,255,0.9) inset,
            0 -1px 0px rgba(0,103,149,0.04) inset;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          overflow: visible;
        }
        .ps-bubble:hover, .ps-bubble-active {
          transform: translateY(-8px) scale(1.02);
          background: rgba(255,255,255,0.42);
          box-shadow:
            0 20px 60px rgba(0,103,149,0.16),
            0 1.5px 0px rgba(255,255,255,1) inset,
            0 -1px 0px rgba(0,103,149,0.06) inset;
        }

        /* ─── Bubble shine overlay ─── */
        .ps-bubble-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%);
          border-radius: 2rem 2rem 0 0;
          pointer-events: none;
        }

        /* ─── Icon circle ─── */
        .ps-bubble-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.4) inset;
          flex-shrink: 0;
        }

        /* ─── Text ─── */
        .ps-bubble-title { font-size: 1.15rem; font-weight: 700; color: #0c4a6e; }
        .ps-bubble-desc  { font-size: 0.82rem; color: #0369a1; line-height: 1.6; opacity: 0.9; flex: 1; }

        /* ─── CTA button inside card ─── */
        .ps-bubble-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.55rem 1.4rem;
          border-radius: 100px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          margin-top: 0.25rem;
        }
        .ps-bubble:hover .ps-bubble-btn {
          box-shadow: 0 6px 22px rgba(0,0,0,0.22);
          transform: scale(1.03);
        }

        /* ─── Arrow ─── */
        .ps-arrow { display: inline-block; transition: transform 0.2s ease; }

        /* ─── Inspector type dropdown ─── */
        .ps-dropdown {
          width: 100%;
          z-index: 50;
          background: rgba(240, 249, 255, 0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1.5px solid rgba(255,255,255,0.90);
          border-radius: 1.5rem;
          box-shadow: 0 12px 40px rgba(0,103,149,0.14);
          overflow: hidden;
          transform-origin: top center;
          transform: scaleY(0);
          opacity: 0;
          max-height: 0;
          margin-top: 0;
          transition: transform 0.28s ease, opacity 0.28s ease, max-height 0.35s ease, margin-top 0.2s ease;
          padding: 0;
        }
        .ps-dropdown-open {
          transform: scaleY(1);
          opacity: 1;
          max-height: 400px;
          margin-top: 0.75rem;
          padding: 0.5rem 0;
        }
        .ps-dropdown-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 0.5rem 1.25rem 0.25rem;
        }

        /* ─── Type row items ─── */
        .ps-type-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s ease, padding-left 0.15s ease;
          border-bottom: 1px solid rgba(0,103,149,0.06);
          text-align: left;
        }
        .ps-type-row:last-child { border-bottom: none; }
        .ps-type-row:hover { background: rgba(0,103,149,0.06); padding-left: 1.5rem; }

        .ps-type-emoji { font-size: 1.2rem; flex-shrink: 0; }
        .ps-type-text  { flex: 1; font-size: 0.83rem; font-weight: 500; color: #0c4a6e; }
        .ps-type-arrow { font-size: 0.9rem; color: #006795; opacity: 0; transition: opacity 0.15s, transform 0.15s; }
        .ps-type-row:hover .ps-type-arrow { opacity: 1; }

        /* ─── Footer ─── */
        .ps-footer { position: relative; z-index: 10; margin-top: 2rem; font-size: 0.875rem; color: #0369a1; opacity: 0.8; }
        .ps-footer-link { color: #006795; font-weight: 700; background: none; border: none; cursor: pointer; text-decoration: underline; }
        .ps-footer-link:hover { color: #0284c7; }
      `}</style>
    </div>
  )
}
