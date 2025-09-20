import React, { useEffect, useState } from "react";

/* Dumbbell logo (inline SVG so it never goes missing) */
const Dumbbell = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M3 9h2v6H3V9zm16 0h2v6h-2V9zM7 7h2v10H7V7zm8 0h2v10h-2V7zM11 9h2v6h-2V9z" />
  </svg>
);

/* Tiny check icon */
const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
);

/* Coaches */
const COACHES = [
  { name: "Ben",        role: "Owner & Coach", bio: "Pushes you until you drop and then tells you an awful Dad joke to make you smile.", img: "/images/Ben.png" },
  { name: "Pren",       role: "Owner & Coach", bio: "Our boss girl who brings the energy and keeps the vibe inclusive.",                 img: "/images/Pren.png" },
  { name: "Christian",  role: "Head Coach",    bio: "Technique-focused and results-driven. Leads the floor with precision.",           img: "/images/Christian.png" },
  { name: "Tyneale",    role: "Coach",         bio: "Supportive and motivating — helping members nail form and confidence.",           img: "/images/Tyneale.png" },
  { name: "Josh",       role: "Coach",         bio: "Balanced technical excellence and simplicity so you push safely and enjoyably.",  img: "/images/Josh.png" },
];

export default function BFTWynnumLanding() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Load Elfsight once (Google Reviews)
  useEffect(() => {
    if (document.getElementById("elfsight-platform-script")) return;
    const s = document.createElement("script");
    s.id = "elfsight-platform-script";
    s.src = "https://elfsightcdn.com/platform.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Submit to Netlify Function
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError("");
  setSubmitted(false);

  try {
    const res = await fetch("/.netlify/functions/wingman-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    const raw = await res.text();
    if (!res.ok) {
      let msg = raw;
      // If the function sent JSON {error: "..."} use that. Otherwise strip XML tags.
      try {
        const j = JSON.parse(raw);
        msg = j?.error ?? raw;
      } catch {}
      msg = String(msg).replace(/<[^>]+>/g, " ").trim(); // strip XML/HTML
      setError(msg || "Sorry, something went wrong.");
    } else {
      setSubmitted(true);
      setName(""); setEmail(""); setPhone(""); setMessage("");
    }
  } catch (err) {
    setError(err.message || "Sorry, something went wrong.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Header with logo */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2 font-semibold">
            <Dumbbell className="h-5 w-5 text-slate-900" />
            <span>BFT Wynnum</span>
          </a>
          <a href="#kickstart" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
            Start 28 Day Kickstart
          </a>
        </div>
      </header>

      {/* Kickstart / Hero */}
      <section id="kickstart" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-start gap-10 md:grid-cols-2">
            {/* Left column */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">28 Day Kickstart</h1>
              <p className="mt-4 text-slate-700">
                Ready to level up your training? Build habits, learn technique, and see measurable progress with coach support.
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "4 curated weeks of progressive training",
                  "Heart-rate tiles & progress tracking",
                  "Technique coaching every session",
                  "Access to all program types (Strength, Cardio, Hybrid)",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-slate-800">
                    <span className="mt-[2px] text-teal-600"><Check /></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3">
                <a href="#kickstart" className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                  Get Started
                </a>
                <a href="#included" className="rounded-md border px-4 py-2 hover:bg-slate-50">
                  What’s included
                </a>
              </div>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold tracking-tight">Kickstart Enquiry</h2>
              <p className="mt-1 text-sm text-slate-600">
                We’ll be in touch to lock in your first session and personalise your plan.
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  type="text" placeholder="Full name" className="w-full rounded-md border px-3 py-2"
                  value={name} onChange={(e) => setName(e.target.value)} required
                />
                <input
                  type="email" placeholder="Email" className="w-full rounded-md border px-3 py-2"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
                <input
                  type="tel" placeholder="Phone" className="w-full rounded-md border px-3 py-2"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required
                />
                <textarea
                  placeholder="Any questions or goals?" rows={3}
                  className="w-full rounded-md border px-3 py-2"
                  value={message} onChange={(e) => setMessage(e.target.value)}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                {submitted && !error && <p className="text-sm text-green-700">Thanks! We’ll be in touch shortly.</p>}
                <button type="submit" disabled={submitting}
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60">
                  {submitting ? "Submitting..." : "Start Kickstart"}
                </button>
              </form>
            </div>
          </div>

          {/* Group shot image only */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200">
            <img
              src="/images/GroupShot.jpg?v=5"
              alt="BFT Wynnum members training in-studio"
              className="w-full"
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.dataset.triedPng) {
                  e.currentTarget.dataset.triedPng = "1";
                  e.currentTarget.src = "/images/GroupShot.png?v=5";
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Why BFT */}
      <section id="why" className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Why Train at BFT Wynnum</h2>
          <p className="mt-3 max-w-3xl text-slate-700">
            We keep it real: great coaching, progressive programming, and an inclusive vibe where you’ll actually want to show up.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: "Progressive Strength", text: "Build a strong foundation with coach-led technique and structured progressions." },
              { title: "Smarter Cardio",       text: "Train in the right heart-rate zones to burn calories and boost endurance efficiently." },
              { title: "50-Minute Sessions",   text: "High-energy, time-efficient classes that fit busy schedules." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 p-5 shadow-sm bg-white">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-700">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Moved up: What's included (before Coaches) */}
      <section id="included" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">What’s included</h2>
          <ul className="mt-4 list-disc pl-5 text-slate-700 space-y-2">
            <li>Access to all BFT programs for 28 days</li>
            <li>Coach-led sessions with technique cues every workout</li>
            <li>Heart-rate tiles and simple progress tracking</li>
            <li>Friendly, inclusive community</li>
          </ul>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Meet Your Coaches</h2>
          <p className="mt-2 text-slate-700">Technique-obsessed, friendly, and here for your progress.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {COACHES.map((c) => (
              <article key={c.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={c.img} alt={c.name} className="h-56 w-full object-cover object-top" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-slate-600">{c.role}</p>
                  <p className="mt-2 text-sm text-slate-700">{c.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews (Elfsight) */}
      <section id="reviews" className="py-16 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Reviews</h2>
          <p className="mt-2 text-slate-700">Real feedback from our members.</p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="elfsight-app-3bde9cac-d178-4084-bdf5-1fa57984f813" data-elfsight-app-lazy />
          </div>
        </div>
      </section>
    </main>
  );
}
