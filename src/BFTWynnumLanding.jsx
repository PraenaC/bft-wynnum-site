// src/BFTWynnumLanding.jsx
import React from "react";

/**
 * BFT Wynnum Landing (Netlify form version)
 * - Netlify HTML form (name="kickstart") posts directly to Netlify
 * - No Wingman JS; email notifications can be set in Netlify > Forms
 * - Group shot image only (no caption)
 * - "What’s included" section appears before Coaches
 * - Coach images keep heads (object-top)
 */

export default function BFTWynnumLanding() {
  const [showThanks, setShowThanks] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShowThanks(window.location.hash === "#thanks");
    }
  }, []);

  const features = [
    "4 curated weeks of progressive training",
    "Heart-rate tiles & progress tracking",
    "Technique coaching every session",
    "Access to all program types (Strength, Cardio, Hybrid)",
  ];

  const included = [
    "Technique intro + first session booking",
    "Body scan & goals chat with a coach",
    "Unlimited classes for 28 days",
    "App access, heart-rate tiles & progress tracking",
    "Coach check-ins & accountability",
  ];

  const coaches = [
    {
      name: "Ben",
      role: "Owner & Coach",
      img: "/images/Ben.png",
      blurb:
        "Pushes you until you drop… then tells you an even better cue. Friendly menace, technique-obsessed.",
    },
    {
      name: "Pren",
      role: "Owner & Coach",
      img: "/images/Pren.png",
      blurb:
        "Boss girl energy. Keeps the vibes high and your lifts clean. Expect smiles and sweat.",
    },
    {
      name: "Christian",
      role: "Head Coach",
      img: "/images/Christian.png",
      blurb:
        "Coaching nerd. Loves strength technique and tidy reps. Brings structure and results.",
    },
    {
      name: "Tyneale",
      role: "Coach",
      img: "/images/Tyneale.png",
      blurb:
        "Your hype queen and pace setter. Cardio whisperer with perfect playlists.",
    },
    {
      name: "Josh",
      role: "Coach",
      img: "/images/Josh.png",
      blurb:
        "Quiet assassin. Patient cues, crisp movement, and sneaky burners you’ll feel tomorrow.",
    },
  ];

  return (
    <main className="bg-white text-slate-900">
      {/* Kickstart / Hero */}
      <section id="kickstart" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: copy */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              28 DAY KICKSTART
            </h1>
            <p className="mt-4 text-slate-600 max-w-prose">
              Ready to level up your training? Build habits, learn technique,
              and see measurable progress with coach support.
            </p>

            <ul className="mt-8 space-y-4">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 text-emerald-600"
                  >
                    ✓
                  </span>
                  <span className="text-slate-700">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              <a
                href="#kickstart"
                className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-800"
              >
                Get Started
              </a>
              <a
                href="#included"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-5 py-2.5 text-slate-800 hover:bg-slate-50"
              >
                What’s included
              </a>
            </div>
          </div>

          {/* Right: Netlify HTML form (no JS) */}
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold">Kickstart Enquiry</h2>
            <p className="mt-1 text-sm text-slate-500">
              We’ll be in touch to lock in your first session and personalise
              your plan.
            </p>

            <form
              name="kickstart"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              action="/#thanks"
              className="mt-4 space-y-3"
            >
              {/* Netlify form glue */}
              <input type="hidden" name="form-name" value="kickstart" />
              <p className="hidden">
                <label>
                  Don’t fill this out if you’re human: <input name="bot-field" />
                </label>
              </p>

              <label className="sr-only" htmlFor="ks-name">
                Full name
              </label>
              <input
                id="ks-name"
                name="name"
                type="text"
                required
                placeholder="Full name"
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />

              <label className="sr-only" htmlFor="ks-email">
                Email
              </label>
              <input
                id="ks-email"
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />

              <label className="sr-only" htmlFor="ks-phone">
                Phone
              </label>
              <input
                id="ks-phone"
                name="phone"
                type="tel"
                required
                placeholder="Phone"
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />

              <label className="sr-only" htmlFor="ks-msg">
                Any questions or goals?
              </label>
              <textarea
                id="ks-msg"
                name="message"
                rows={4}
                placeholder="Any questions or goals?"
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
              />

              <button
                type="submit"
                className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800"
              >
                Start Kickstart
              </button>
            </form>

            {showThanks && (
              <p className="mt-3 text-sm text-emerald-600">
                Thanks! We’ve received your details.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Group shot – image only (no caption) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <img
            src="/images/GroupShot.jpg"
            alt="BFT Wynnum members training in-studio"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Why / features trio */}
      <section id="why" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold">Why Train at BFT Wynnum</h2>
        <p className="mt-2 text-slate-600 max-w-3xl">
          Great coaching, progressive programming, and an inclusive vibe where
          you’ll actually want to show up. Our 28 Day Kickstart gets you moving
          safely, building confidence, and slotting training into your week
          without overwhelm.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Progressive Strength"
            body="Build a strong foundation with coach-led technique and structured progressions."
          />
          <FeatureCard
            title="Smarter Cardio"
            body="Train in the right heart-rate zones to burn calories and boost endurance efficiently."
          />
          <FeatureCard
            title="50-Minute Sessions"
            body="High-energy, time-efficient classes that fit busy schedules."
          />
        </div>
      </section>

      {/* What's included (moved before coaches) */}
      <section id="included" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-2xl sm:text-3xl font-bold">What’s Included</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500 text-emerald-600"
                >
                  ✓
                </span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a
              href="#kickstart"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-800"
            >
              Start 28 Day Kickstart
            </a>
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold">Meet Your Coaches</h2>
        <p className="mt-2 text-slate-600 max-w-3xl">
          Technique-obsessed, friendly, and here for your progress.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((c) => (
            <article
              key={c.name}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white"
            >
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-64 object-cover object-top"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-slate-500">{c.role}</p>
                <p className="mt-2 text-sm text-slate-700">{c.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-300">
          🏋️
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-slate-600">{body}</p>
    </div>
  );
}
