import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Dumbbell,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Star,
} from "lucide-react";

/* -----------------------------
   CONFIG / DATA
----------------------------- */

// Coaches – local images live in /public/images
const COACHES = [
  {
    name: "Ben",
    role: "Owner & Coach",
    bio:
      "Pushes you until you drop and then tells you an awful Dad joke to make you smile.",
    img: "/images/Ben.png",
  },
  {
    name: "Pren",
    role: "Owner & Coach",
    bio: "Our boss girl who brings the energy and keeps the vibe inclusive.",
    img: "/images/Pren.png",
  },
  {
    name: "Christian",
    role: "Head Coach",
    bio: "Technique-focused and results-driven. Leads the floor with precision.",
    img: "/images/Christian.png",
  },
  {
    name: "Tyneale",
    role: "Coach",
    bio:
      "Supportive and motivating — helping members nail form and confidence.",
    img: "/images/Tyneale.png",
  },
  {
    name: "Josh",
    role: "Coach",
    bio:
      "Coaching style is a balance of technical excellence and simplicity to help push you to perform well in a safe and enjoyable manner.",
    img: "/images/Josh.png",
  },
];

// Timetable
const TIMETABLE = [
  {
    group: "Monday",
    sessions: [
      { time: "5:00a" },
      { time: "6:00a" },
      { time: "7:00a" },
      { time: "9:15a", child: true },
      { time: "4:00p", child: true },
      { time: "5:00p" },
      { time: "6:00p" },
    ],
  },
  {
    group: "Tuesday",
    sessions: [
      { time: "5:00a" },
      { time: "6:00a" },
      { time: "7:00a" },
      { time: "9:15a", child: true },
      { time: "4:00p" },
      { time: "5:00p" },
      { time: "6:00p" },
    ],
  },
  {
    group: "Wednesday",
    sessions: [
      { time: "5:00a" },
      { time: "6:00a" },
      { time: "7:00a" },
      { time: "9:15a", child: true },
      { time: "4:00p", child: true },
      { time: "5:00p" },
      { time: "6:00p" },
    ],
  },
  {
    group: "Thursday",
    sessions: [
      { time: "5:00a" },
      { time: "6:00a" },
      { time: "7:00a" },
      { time: "9:15a", child: true },
      { time: "4:00p" },
      { time: "5:00p" },
      { time: "6:00p" },
    ],
  },
  {
    group: "Friday",
    sessions: [
      { time: "5:00a" },
      { time: "6:00a" },
      { time: "7:00a" },
      { time: "9:15a", child: true },
      { time: "4:00p" },
      { time: "5:00p" },
    ],
  },
  {
    group: "Saturday",
    sessions: [
      { time: "5:30a" },
      { time: "6:45a" },
      { time: "8:00a", child: true },
      { time: "9:15a", child: true },
    ],
  },
];

/* -----------------------------
   SMALL COMPONENTS
----------------------------- */

const Session = ({ time, child }) => (
  <p className="flex items-center gap-2 text-slate-700">
    {time}{" "}
    {child && (
      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
        {"👶"} Child-minding
      </span>
    )}
  </p>
);

const Feature = ({ icon: Icon, title, text }) => (
  <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-2">
      <span className="p-2 rounded-xl bg-slate-100">
        <Icon className="w-5 h-5" aria-hidden />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
  </div>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-slate-800">{q}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <p className="pb-4 text-slate-600">{a}</p>}
    </div>
  );
};

/* -----------------------------
   KICKSTART FORM (Wingman via Netlify function)
   Place ABOVE the main component
----------------------------- */

function KickstartForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/wingman-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(
        "Sorry, something went wrong. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">You're in! 🎉</h3>
        <p className="text-slate-600 mt-2">
          Thanks for your interest. We’ll contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <input
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
        type="tel"
        placeholder="Mobile"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        className="w-full rounded-xl border border-slate-300 px-3 py-2"
        rows={4}
        placeholder="Any questions or goals?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-slate-900 text-white py-3 font-medium disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Start Kickstart"}
      </button>
      <p className="text-xs text-slate-500">
        By submitting, you agree to be contacted about your enquiry. No spam.
      </p>
    </form>
  );
}

/* -----------------------------
   MAIN COMPONENT
----------------------------- */

export default function BFTWynnumLanding() {
  // Load Elfsight once for Google Reviews
  useEffect(() => {
    const id = "elfsight-platform-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.src = "https://elfsightcdn.com/platform.js";
      s.async = true;
      s.id = id;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="flex items-center gap-2 font-bold">
              <Dumbbell className="w-5 h-5" />
              <span>BFT Wynnum</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#kickstart" className="hover:text-slate-900 text-slate-600">
                Kickstart
              </a>
              <a href="#why" className="hover:text-slate-900 text-slate-600">
                Why BFT
              </a>
              <a href="#team" className="hover:text-slate-900 text-slate-600">
                Coaches
              </a>
              <a href="#timetable" className="hover:text-slate-900 text-slate-600">
                Timetable
              </a>
              <a href="#reviews" className="hover:text-slate-900 text-slate-600">
                Reviews
              </a>
              <a href="#faqs" className="hover:text-slate-900 text-slate-600">
                FAQs
              </a>
              <a href="#contact" className="hover:text-slate-900 text-slate-600">
                Contact
              </a>
            </nav>
            <div className="hidden md:block">
              <a
                href="#kickstart"
                className="rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-medium"
              >
                Start 28 Day Kickstart
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop"
            alt="Group training at a fitness studio"
            className="w-full h-full object-cover opacity-20"
            loading="eager"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Stronger. Fitter. Together.
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Join our <span className="font-semibold">28 Day Kickstart</span> —
              science-backed group training blending strength, cardio and
              progressive programming.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#kickstart"
                className="rounded-2xl bg-slate-900 text-white px-5 py-3 font-medium inline-flex items-center gap-2"
              >
                Start 28 Day Kickstart <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#timetable"
                className="rounded-2xl border border-slate-300 px-5 py-3 font-medium inline-flex items-center justify-center"
              >
                View Timetable
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" /> Heart-rate tech
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 50-min sessions
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" /> Progressive programming
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* KICKSTART */}
      <section id="kickstart" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold">Kickstart Enquiry</h2>
            <p className="mt-2 text-slate-600">
              <strong>Ready to level up your training?</strong> We’ll be in touch
              to lock in your first session and personalise your plan.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="aspect-[16/12] bg-slate-100">
                {/* If your file is PNG, rename the src to /images/GroupShot.png */}
                <img
                  src="/images/GroupShot.jpg?v=1"
                  alt="BFT Wynnum members training in-studio"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  onError={(e) => {
                    // if JPG not found, try PNG
                    if (!e.currentTarget.dataset.triedPng) {
                      e.currentTarget.dataset.triedPng = "1";
                      e.currentTarget.src = "/images/GroupShot.png?v=1";
                    }
                  }}
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600">
                  “The best training community in Wynnum. Coaches actually coach
                  and the programming keeps me progressing.”
                </p>
                <p className="mt-3 text-sm font-medium">— Member review</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 shadow-sm bg-white p-6">
            <KickstartForm />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Why Train at BFT Wynnum</h2>
          <p className="mt-3 text-slate-600 max-w-3xl">
            We keep it real: great coaching, progressive programming, and an
            inclusive vibe where you’ll actually want to show up. Our 28 Day
            Kickstart gets you moving safely, building confidence, and fitting
            training into your week without overwhelm.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Feature
              icon={Dumbbell}
              title="Progressive Strength"
              text="Build a strong foundation with coach-led technique and structured progressions."
            />
            <Feature
              icon={Heart}
              title="Smarter Cardio"
              text="Train in the right heart-rate zones to burn calories and boost endurance efficiently."
            />
            <Feature
              icon={Clock}
              title="50-Minute Sessions"
              text="High-energy, time-efficient classes that fit busy schedules."
            />
          </div>
        </div>
      </section>

      {/* COACHES */}
      <section id="team" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Meet Your Coaches</h2>
          <p className="mt-2 text-slate-600">
            Technique-obsessed, friendly, and here for your progress.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {COACHES.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Fixed height + object-top keeps heads in frame */}
                <div className="h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-slate-500 text-sm">{c.role}</p>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    {c.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMETABLE */}
      <section id="timetable" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold">Timetable</h2>
              <p className="mt-2 text-slate-600">
                Book via the app after you enquire.
              </p>
            </div>
            <a
              href="#contact"
              className="rounded-2xl border border-slate-300 px-5 py-3 font-medium"
            >
              Ask About Session Times
            </a>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {TIMETABLE.map((col) => (
              <div
                key={col.group}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="p-5 border-b">
                  <h3 className="text-lg font-semibold">{col.group}</h3>
                </div>
                <div className="p-5 text-slate-700 text-sm space-y-2">
                  {col.sessions.map((s, idx) => (
                    <Session key={idx} time={s.time} child={s.child} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            👶 Child-minding available at 9:15am Mon–Fri, 4:00pm Mon & Wed, and
            8:00am & 9:15am Saturday.
          </p>
        </div>
      </section>

      {/* REVIEWS (Elfsight) */}
      <section id="reviews" className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Reviews</h2>
          <p className="mt-2 text-slate-600">
            What our members say about training at BFT Wynnum.
          </p>
          <div className="mt-6">
            {/* Replace this class with your Elfsight widget class if it changes */}
            <div
              className="elfsight-app-3bde9cac-d178-4084-bdf5-1fa57984f813"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section id="faqs" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">FAQs</h2>
          <div className="mt-4">
            <FaqItem
              q="Do I need to be fit to start?"
              a="Not at all. We coach to your level and scale everything."
            />
            <FaqItem
              q="Is pricing shown here?"
              a="We chat through options in-studio — this page focuses on the experience."
            />
            <FaqItem
              q="Do you have child-minding?"
              a="Yes: 9:15am Mon–Fri, 4:00pm Mon & Wed, and 8:00am & 9:15am Saturday."
            />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold">Find Us</h2>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />{" "}
                <span>66 Edith St, Wynnum QLD 4178</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />{" "}
                <a href="tel:+61413496289" className="underline">
                  0413 496 289
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />{" "}
                <a
                  href="mailto:wynnum@bodyfittraining.com"
                  className="underline"
                >
                  wynnum@bodyfittraining.com
                </a>
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=66%20Edith%20St%20Wynnum%204178"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-300 px-5 py-3 font-medium inline-block"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Contact form re-uses Kickstart form for simplicity */}
          <div>
            <h2 className="text-3xl font-bold">Ask a Question</h2>
            <p className="mt-2 text-slate-600">
              Tell us your goals and we’ll recommend the best sessions to start
              with.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <KickstartForm />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t bg-white/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} BFT Wynnum. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#contact" className="underline">
              Contact
            </a>
            <a href="#faqs" className="underline">
              FAQs
            </a>
            <a href="#" className="underline">
              Terms
            </a>
            <a href="#" className="underline">
              Privacy
            </a>
          </div>
        </div>
      </footer>

      {/* Local Business JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HealthClub",
            name: "BFT Wynnum",
            address: {
              "@type": "PostalAddress",
              streetAddress: "66 Edith St",
              addressLocality: "Wynnum",
              addressRegion: "QLD",
              postalCode: "4178",
              addressCountry: "AU",
            },
            telephone: "+61413496289",
            url: "https://REPLACE-YOUR-DOMAIN",
            priceRange: "$$",
          }),
        }}
      />
    </div>
  );
}
