import { useState } from "react";

/* ============================================================================
   BFT Wynnum Landing
   - Hero (autoplay video + caption) + "Getting Started" above H1
   - Why / What's included
   - Coaches (Ben, Pren, Josh, Tyneale) — 2 columns on desktop; Ben focus nudged up
   - Timetable (childminding badges, no Sunday)
   - Kickstart form (Netlify Forms)
   - Group shot (no caption)
   - FAQs
   ========================================================================== */

const FEATURES = [
  { title: "4 curated weeks of progressive training", desc: "A simple, safe plan to build momentum fast." },
  { title: "Heart-rate tiles & progress tracking", desc: "See your effort and improvements each week." },
  { title: "Technique coaching every session", desc: "Real coaching, real cues, real confidence." },
  { title: "Access to all program types", desc: "Strength, Cardio & Hybrid — learn what you love." },
];

/* ---------------------- Timetable (exact times you gave) --------------------- */
const SCHEDULE = {
  Monday:    ["5:00am", "6:00am", "7:00am", "9:15am", "4:00pm", "5:00pm", "6:00pm"],
  Tuesday:   ["5:00am", "6:00am", "7:00am", "9:15am",            "5:00pm", "6:00pm"],
  Wednesday: ["5:00am", "6:00am", "7:00am", "9:15am", "4:00pm", "5:00pm", "6:00pm"],
  Thursday:  ["5:00am", "6:00am", "7:00am", "9:15am",            "5:00pm", "6:00pm"],
  Friday:    ["5:00am", "6:00am", "7:00am", "9:15am", "4:00pm", "5:00pm"],
  Saturday:  ["5:30am", "6:45am", "8:00am", "9:15am"],
};

/* -------- Sessions with childminding (must match strings in SCHEDULE) ------- */
const CHILD_MINDING = new Set([
  "Monday 9:15am",
  "Tuesday 9:15am",
  "Wednesday 9:15am",
  "Thursday 9:15am",
  "Friday 9:15am",
  "Monday 4:00pm",
  "Wednesday 4:00pm",
  "Saturday 8:00am",
  "Saturday 9:15am",
]);

/* ----------------------------- Coaches + one-liners -------------------------- */
/* NOTE: Ben’s image uses custom objectPosition to keep his head in frame */
const COACHES = [
  {
    name: "Ben",
    role: "Owner & Coach",
    img: "/images/Ben.png",
    bio: "Pushes you until you drop and then tells you an awful Dad joke to make you smile.",
    focus: "50% 12%", // nudge up (works on mobile & desktop)
  },
  {
    name: "Pren",
    role: "Owner & Coach",
    img: "/images/Pren.png",
    bio: "Our boss girl who brings the energy and keeps the vibe inclusive.",
    focus: "50% 20%",
  },
  {
    name: "Josh",
    role: "Coach",
    img: "/images/Josh.png",
    bio: "A balance of technical excellence and simplicity so you perform well safely.",
    focus: "50% 20%",
  },
  {
    name: "Tyneale",
    role: "Coach",
    img: "/images/Tyneale.png",
    bio: "Supportive and motivating — helping members nail form and confidence.",
    focus: "50% 20%",
  },
];

/* --------------------------------- Helpers --------------------------------- */
function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`py-16 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">{children}</div>
    </section>
  );
}

function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function Pill() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-emerald-600 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
      👶 Childminding
    </span>
  );
}

/* --------------------------- Netlify Forms handler -------------------------- */
function useNetlifyForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const encode = (data) =>
    Object.keys(data)
      .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const body = encode({
        "form-name": "kickstart",
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        subject: "BFT Wynnum – Kickstart enquiry",
      });
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Sorry, something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return { form, setForm, submitting, submitted, error, handleSubmit };
}

/* --------------------------------- Page ------------------------------------ */
export default function BFTWynnumLanding() {
  const form = useNetlifyForm();

  return (
    <div className="bg-white text-slate-800">
      {/* Top nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold">
            <span className="text-cyan-700">🏋️‍♀️</span>
            <span>BFT Wynnum</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:text-slate-900">Why BFT</a>
            <a href="#coaches" className="hover:text-slate-900">Coaches</a>
            <a href="#timetable" className="hover:text-slate-900">Timetable</a>
            <a href="#faqs" className="hover:text-slate-900">FAQs</a>
            <a href="#kickstart" className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">Start 28 Day Kickstart</a>
          </nav>
        </div>
      </header>

      {/* HERO (video right – autoplay + caption) */}
      <Section id="kickstart-hero" className="pt-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            {/* Getting Started block BEFORE the H1 */}
            <p className="text-xs uppercase tracking-widest text-cyan-700 font-semibold">Getting Started</p>
            <p className="mt-2 text-slate-600 max-w-prose">
              For the best results, value and experience, we highly recommend you start with our
              <span className="font-semibold"> 28 Day Intro Program</span>. It&apos;s designed to set you up
              for success right from the start, take away any potential gym nerves, overwhelm and build new
              habits that set you up for long-lasting success.
            </p>

            <h1 className="mt-5 text-4xl md:text-5xl font-black tracking-tight">28 DAY KICKSTART</h1>
            <p className="mt-4 text-slate-600 max-w-prose">
              Ready to level up your training? Build habits, learn technique, and see measurable progress
              with coach support.
            </p>

            <ul className="mt-6 space-y-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span className="mt-[3px] text-cyan-700">✓</span>
                  <div>
                    <p className="font-medium">{f.title}</p>
                    <p className="text-sm text-slate-600">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              <a href="#kickstart" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                Get Started
              </a>
              <a href="#why" className="rounded-full border px-4 py-2 hover:bg-slate-50">
                What’s included
              </a>
            </div>
          </div>

          <figure>
            <Card className="overflow-hidden">
              <video
                src="/IntroVideo.mp4"
                muted
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-[340px] md:h-[420px] object-cover bg-black"
              />
            </Card>
            <figcaption className="mt-2 text-sm text-slate-600 text-center">
              What to expect at BFT
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* WHY / What's included */}
      <Section id="why" className="bg-slate-50">
        <h2 className="text-3xl font-extrabold">Why Train at BFT Wynnum</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Great coaching, progressive programming, and an inclusive vibe where you’ll actually want to show up.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-lg font-semibold">Progressive Strength</p>
            <p className="text-sm text-slate-600 mt-1">Coach-led technique and structured progressions.</p>
          </Card>
          <Card className="p-6">
            <p className="text-lg font-semibold">Smarter Cardio</p>
            <p className="text-sm text-slate-600 mt-1">Train in the right HR zones to get more from every minute.</p>
          </Card>
          <Card className="p-6">
            <p className="text-lg font-semibold">50-Minute Sessions</p>
            <p className="text-sm text-slate-600 mt-1">High-energy, time-efficient classes for busy schedules.</p>
          </Card>
        </div>
      </Section>

      {/* COACHES (2 columns on desktop; Ben & Pren first row) */}
      <Section id="coaches">
        <h2 className="text-3xl font-extrabold">Meet Your Coaches</h2>
        <p className="mt-2 text-slate-600">Technique-obsessed, friendly, and here for your progress.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {COACHES.map((c) => (
            <Card key={c.name} className="overflow-hidden">
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-72 md:h-64 object-cover"  // extra headroom
                loading="lazy"
                style={c.focus ? { objectPosition: c.focus } : undefined}
                onError={(e) => (e.currentTarget.src = c.img.replace(".png", ".jpg"))}
              />
              <div className="p-4">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-slate-600">{c.role}</p>
                <p className="text-sm text-slate-600 mt-2">{c.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* TIMETABLE (no Sunday) */}
      <Section id="timetable" className="bg-slate-50">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-extrabold">Class Timetable</h2>
          <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">
            👶 Childminding on selected sessions
          </span>
        </div>
        <p className="mt-2 text-slate-600">
          Childminding at <strong>9:15am Mon–Fri</strong>, <strong>4:00pm Mon & Wed</strong>, and <strong>8:00am & 9:15am Saturday</strong>.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                {Object.keys(SCHEDULE).map((day) => (
                  <th key={day} className="py-3 pr-6 font-semibold">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.max(...Object.values(SCHEDULE).map((v) => v.length)) },
                (_, row) => (
                  <tr key={row} className="border-t">
                    {Object.entries(SCHEDULE).map(([day, times]) => {
                      const time = times[row] || "";
                      const cm = time ? CHILD_MINDING.has(`${day} ${time}`) : false;
                      return (
                        <td key={day} className="py-3 pr-6 align-top">
                          {time && (
                            <span className="inline-flex items-center">
                              {time}
                              {cm && <Pill />}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* KICKSTART FORM (after timetable) */}
      <Section id="kickstart">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-extrabold">Kickstart Enquiry</h2>
            <p className="mt-2 text-slate-600 max-w-prose">
              We’ll be in touch to lock in your first session and personalise your plan.
            </p>
          </div>

          <KickstartForm />
        </div>
      </Section>

      {/* GROUP SHOT (no caption) */}
      <Section>
        <Card className="overflow-hidden">
          <img
            src="/images/GroupShot.jpg?v=5"
            alt="BFT Wynnum members training in-studio"
            className="w-full h-[520px] object-cover object-center"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/images/GroupShot.jpg")}
          />
        </Card>
      </Section>

      {/* FAQs */}
      <Section id="faqs" className="bg-slate-50">
        <h2 className="text-3xl font-extrabold">FAQs</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="p-5">
            <p className="font-semibold">Do I need to be fit to start?</p>
            <p className="mt-2 text-sm text-slate-600">
              Nope! We coach you at your level with options for every exercise. You’ll get stronger and fitter each week.
            </p>
          </Card>
          <Card className="p-5">
            <p className="font-semibold">How long are the sessions?</p>
            <p className="mt-2 text-sm text-slate-600">50 minutes — warm-up, blocks, and a cool-down.</p>
          </Card>
          <Card className="p-5">
            <p className="font-semibold">Is there childminding?</p>
            <p className="mt-2 text-sm text-slate-600">
              Yes — 9:15am Mon–Fri, 4:00pm Mon & Wed, and 8:00am & 9:15am Saturday (see the 👶 badge).
            </p>
          </Card>
          <Card className="p-5">
            <p className="font-semibold">What should I bring?</p>
            <p className="mt-2 text-sm text-slate-600">A water bottle, towel, and comfortable trainers.</p>
          </Card>
        </div>
      </Section>

      {/* Footer / contact */}
      <footer id="contact" className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} BFT Wynnum</p>
            <a
              href="#kickstart"
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Start 28 Day Kickstart
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------- Subcomponents below --------------------------- */

function KickstartForm() {
  const { form, setForm, submitting, submitted, error, handleSubmit } = useNetlifyForm();
  return (
    <Card className="p-4">
      {/* Netlify Forms: name must match hidden 'form-name' in the POST body */}
      <form
        name="kickstart"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
      >
        {/* Netlify wires (bot-field is optional but helps) */}
        <input type="hidden" name="form-name" value="kickstart" />
        <input type="hidden" name="subject" value="BFT Wynnum – Kickstart enquiry" />
        <p className="hidden">
          <label>
            Don’t fill this out: <input name="bot-field" onChange={() => {}} />
          </label>
        </p>

        <div className="grid gap-3">
          <input
            className="h-11 rounded-lg border px-3"
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="h-11 rounded-lg border px-3"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="h-11 rounded-lg border px-3"
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <textarea
            className="min-h-[110px] rounded-lg border px-3 py-2"
            name="message"
            placeholder="Any questions or goals?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-4 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Start Kickstart"}
          </button>

          {submitted && (
            <p className="text-sm text-emerald-700" aria-live="polite">
              Thanks! We’ve received your details.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
