"use client";

import { useState, useEffect } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

// ─── Profile Completion Modal ─────────────────────────────────────────────────
function CompleteProfileModal({ onComplete }) {
  const { user } = useUser();
  const [step, setStep] = useState(0); // 0 = intro, 1 = form, 2 = done
  const [form, setForm] = useState({
    username: "",
    favTeam: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const TEAMS = [
    "India", "Australia", "England", "Pakistan",
    "South Africa", "New Zealand", "West Indies", "Sri Lanka",
  ];
  const ROLES = ["Fan", "Fantasy Player", "Analyst", "Coach / Player"];

  async function handleSave() {
    setSaving(true);
    try {
      // Save to Clerk public metadata so it's available everywhere
      await user.update({
        username: form.username || undefined,
        unsafeMetadata: {
          profileComplete: true,
          favTeam: form.favTeam,
          role: form.role,
        },
      });

      // ── Replace this block with your own DB call ──────────────────────────
      // e.g. await fetch("/api/users", {
      //   method: "POST",
      //   body: JSON.stringify({ clerkId: user.id, ...form }),
      // });
      // ─────────────────────────────────────────────────────────────────────

      setStep(2);
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 400); // wait for fade-out
      }, 1800);
    } catch (err) {
      console.error("Profile save failed:", err);
      setSaving(false);
    }
  }

  const ready = form.favTeam && form.role;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        transition: "opacity 0.4s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Blurred dark overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => {}} // intentionally non-dismissible
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #18181b 0%, #0f1410 100%)",
          border: "1px solid rgba(74,222,128,0.18)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease",
          boxShadow: "0 0 60px rgba(74,222,128,0.10), 0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Green glow strip at top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, #4ade80, transparent)",
          }}
        />

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <div className="p-8 text-center">
            {/* Cricket ball icon */}
            <div
              className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{
                background: "linear-gradient(135deg, #166534, #14532d)",
                boxShadow: "0 0 24px rgba(74,222,128,0.25)",
              }}
            >
              🏏
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Welcome to <span className="text-green-400">CricScore</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-7">
              Hey {user?.firstName || "there"}! Looks like you're new here.
              Take 30 seconds to personalise your experience.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                boxShadow: "0 4px 20px rgba(74,222,128,0.25)",
              }}
            >
              Complete Profile →
            </button>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onComplete, 400);
              }}
              className="mt-3 w-full py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* ── Step 1: Form ── */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-1">Your Profile</h2>
            <p className="text-zinc-500 text-xs mb-6">
              Helps us tailor scores, alerts &amp; fantasy tips for you.
            </p>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-widest">
                Username (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. rohit_fan_11"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(74,222,128,0.4)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
            </div>

            {/* Fav Team */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                Favourite Team <span className="text-green-400">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TEAMS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, favTeam: t })}
                    className="py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150"
                    style={{
                      background:
                        form.favTeam === t
                          ? "rgba(74,222,128,0.15)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        form.favTeam === t
                          ? "1px solid rgba(74,222,128,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                      color: form.favTeam === t ? "#4ade80" : "#a1a1aa",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Role */}
            <div className="mb-7">
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                I am a <span className="text-green-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className="py-2 px-3.5 rounded-xl text-xs font-semibold transition-all duration-150"
                    style={{
                      background:
                        form.role === r
                          ? "rgba(74,222,128,0.15)"
                          : "rgba(255,255,255,0.04)",
                      border:
                        form.role === r
                          ? "1px solid rgba(74,222,128,0.5)"
                          : "1px solid rgba(255,255,255,0.07)",
                      color: form.role === r ? "#4ade80" : "#a1a1aa",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!ready || saving}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              style={{
                background: ready
                  ? "linear-gradient(135deg, #16a34a, #15803d)"
                  : "rgba(255,255,255,0.06)",
                boxShadow: ready ? "0 4px 20px rgba(74,222,128,0.2)" : "none",
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save & Continue →"
              )}
            </button>
          </div>
        )}

        {/* ── Step 2: Done ── */}
        {step === 2 && (
          <div className="p-8 text-center">
            <div
              className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #166534, #14532d)",
                boxShadow: "0 0 32px rgba(74,222,128,0.35)",
                animation: "pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-1">You're all set!</h2>
            <p className="text-zinc-400 text-sm">Welcome to CricScore, {user?.firstName || "champion"} 🏆</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pop {
          from { transform: scale(0.6); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();

  // After Clerk loads + user signs in → check if profile is complete
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const profileComplete = user?.unsafeMetadata?.profileComplete;
    if (!profileComplete) {
      // Small delay so the navbar/page settles first
      const t = setTimeout(() => setShowProfileModal(true), 700);
      return () => clearTimeout(t);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <>
      <nav className="bg-zinc-900 border-b border-zinc-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="text-2xl font-extrabold tracking-tight cursor-pointer select-none">
            Cric<span className="text-green-400">Score</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {["Matches", "Teams", "Players"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-800 transition-all duration-200 group"
              >
                {item}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-green-400 rounded-full group-hover:w-4 transition-all duration-200" />
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoaded ? (
              // Skeleton while Clerk loads
              <div className="w-20 h-8 rounded-lg bg-zinc-800 animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-3">
                {/* Prompt incomplete profiles */}
                {!user?.unsafeMetadata?.profileComplete && (
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-xs font-semibold text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-lg hover:bg-amber-400/10 transition-all duration-200"
                  >
                    Complete profile ✦
                  </button>
                )}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-xl ring-2 ring-green-500/40 hover:ring-green-400/70 transition-all",
                    },
                  }}
                />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-zinc-400 hover:text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-200">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm font-semibold bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-lg shadow-md shadow-green-900/40 hover:shadow-green-800/60 transition-all duration-200 active:scale-95">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg hover:bg-zinc-800 transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
          <div className="flex flex-col gap-1 pb-4">
            {["Matches", "Teams", "Players"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
              >
                {item}
              </a>
            ))}

            <div className="h-px bg-zinc-800 my-2" />

            {!isLoaded ? (
              <div className="w-full h-10 rounded-lg bg-zinc-800 animate-pulse" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-3 px-4 py-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-xl ring-2 ring-green-500/40",
                    },
                  }}
                />
                <span className="text-sm text-zinc-300 font-medium">
                  {user?.firstName ?? user?.username ?? "Account"}
                </span>
                {!user?.unsafeMetadata?.profileComplete && (
                  <button
                    onClick={() => { setMenuOpen(false); setShowProfileModal(true); }}
                    className="ml-auto text-xs font-semibold text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-lg hover:bg-amber-400/10 transition-all duration-200"
                  >
                    Complete profile ✦
                  </button>
                )}
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 text-left"
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="py-3 text-sm font-semibold bg-green-500 hover:bg-green-400 text-white rounded-lg shadow-md transition-all duration-200 active:scale-95"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <CompleteProfileModal onComplete={() => setShowProfileModal(false)} />
      )}
    </>
  );
}