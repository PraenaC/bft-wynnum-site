import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Dumbbell,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* =========================
   CONFIG / DATA
========================= */

// Coaches (make sure these files exist in /public/images/)
const COACHES = [
  { name: "Ben", role: "Owner & Coach", bio: "Pushes you until you drop and then tells you an awful Dad joke to make you smile.", img: "/images/Ben.png" },
  { name: "Pren", role: "Owner & Coach", bio: "Our boss girl who brings the energy and keeps the vibe inclusive.", img: "/images/Pren.png" },
  { name: "Christian", role: "Head Coach", bio: "Technique-focused and results-driven. Leads the floor with precision.", img: "/images/Christian.png" },
  { name: "Tyneale", role: "Coach", bio: "Supportive and motivating — helping members nail form and confidence.", img: "/images/Tyneale.png" },
  { name: "Josh", role: "Coach", bio: "Coaching style is a balance of technical excellence and simplicity to help push you to perform well in a safe and enjoyable manner.", img: "/images/Josh.png" },
];

const TIMETABLE = [
  { group: "Monday",    sessions: [{time:"5:00a"},{time:"6:00a"},{time:"7:00a"},{time:"9:15a",child:true},{time:"4:00p",child:true},{time:"5:00p"},{time:"6:00p"}]},
  { group: "Tuesday",   sessions: [{time:"5:00a"},{time:"6:00a"},{time:"7:00a"},{time:"9:15a",child:true},{time:"4:00p"},{time:"5:00p"},{time:"6:00p"}]},
  { group: "Wednesday", sessions: [{time:"5:00a"},{time:"6:00a"},{time:"7:00a"},{time:"9:15a",child:true},{time:"4:00p",child:true},{time:"5:00p"},{time:"6:00p"}]},
  { group: "Thursday",  sessions: [{time:"5:00a"},{time:"6:00a"},{time:"7:00a"},{time:"9:15a",child:true},{time:"4:00p"},{time:"5:00p"},{time:"6:00p"}]},
  { group: "Friday",    sessions: [{time:"5:00a"},{time:"6:00a"},{time:"7:00a"},{time:"9:15a",child:true},{time:"4:00p"},{time:"5:00p"}]},
  { group: "Saturday",  sessions: [{time:"5:30a"},{time:"6:45a"},{time:"8:00a",child:true},{time:"9:15a",child:true}]},
];

/* =========================
   SMALL COMPONENTS
========================= */

const Session = ({ time, child }) => (
  <p className="flex items-center gap-2 text-slate-700">
    {time} {child && <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">{"👶"} Child-minding</span>}
  </p>
);

const Feature = ({ icon: Icon, title, text }) => (
  <Card className="bg-white/80 backdrop-blur border border-slate-200 shadow-sm rounded-2xl">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-xl bg-slate-100"><Icon className="w-5 h-5" aria-hidden /></span>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-slate-600 text-sm leading-relaxed">{text}</CardContent>
  </Card>
);

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="font-medium text-slate-800">{q}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-slate-600">{a}</p>}
    </div>
  );
};

/* =========================
   ELFSIGHT GOOGLE REVIEWS
========================= */

const ElfsightReviews = () => {
  useEffect(() => {
    const SRC = "https://elfsightcdn.com/platform.js";
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => window.ELFSIGHT?.reload?.();
    } else {
      window.ELFSIGHT?.reload?.();
    }
  }, []);

  return (
    <section id="reviews" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold">Google Reviews</h2>
        <p className="mt-2 text-slate-600">What our members say about BFT Wynnum.</p>
        <div className="mt-6">
          <div className="elfsight-app-3bde9cac-d178-4084-bdf5-1fa57984f813" data-elfsight-app-lazy />
        </div>
        <p className="mt-3 text-xs text-slate-500">Powered by Google.</p>
      </div>
    </section>
  );
};

/* =========================
   JSON-LD (added to <head>)
========================= */

const LocalBusinessSchema = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HealthClub",
      name: "BFT Wynnum",
      address: { "@type": "PostalAddress", streetAddress: "66 Edith St", addressLocality: "Wynnum", addressRegion: "QLD", postalCode: "4178", addressCountry: "AU" },
      telephone: "+61413496289",
      url: "https://REPLACE-YOUR-DOMAIN",
      priceRange: "$$",
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);
  return null;
};

/* =========================
   MAIN PAGE COMPONENT
========================= */

export default function BFTWynnumLanding() {
  const [email, setEmail]   = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = { name, email, phone, message };
      const res = await fetch("/.netlify/functions/wingman-lead", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submit responded ${res.status}`);
      setSubmitted(true); setName(""); setEmail(""); setPhone(""); setMessage("");
    } catch (err) {
      console.error(err);
      setError("Sorry, something went wrong. Please try again or contact us directly.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <LocalBusinessSchema />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="flex items-center gap-2 font-bold">
              <Dumbbell className="w-5 h-5" /><span>BFT Wynnum</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#offer" className="hover:text-slate-900 text-slate-600">Kickstart</a>
              <a href="#why" className="hover:text-slate-900 text-slate-600">Why BFT</a>
              <a href="#team" className="hover:text-slate-900 text-slate-600">Coaches</a>
              <a href="#timetable" className="hover:text-slate-900 text-slate-600">Timetable</a>
              <a href="#reviews" className="hover:text-slate-900 text-slate-600">Reviews</a>
              <a href="#faqs" className="hover:text-slate-900 text-slate-600">FAQs</a>
              <a href="#contact" className="hover:text-slate-900 text-slate-600">Contact</a>
            </nav>
            <div className="hidden md:block">
              <Button asChild className="rounded-2xl"><a href="#offer">Start 28 Day Kickstart</a></Button>
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
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Stronger. Fitter. Together.</h1>
            <p className="mt-4 text-lg text-slate-700">Join our <span className="font-semibold">28 Day Kickstart</span> — science-backed group training blending strength, cardio and progressive programming.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="rounded-2xl"><a href="#offer" className="flex items-center gap-2">Start 28 Day Kickstart <ArrowRight className="w-4 h-4" /></a></Button>
              <Button asChild className="rounded-2xl"><a href="#timetable">View Timetable</a></Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Heart className="w-4 h-4" /> Heart-rate tech</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 50-min sessions</div>
              <div className="flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Progressive programming</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="rounded-2xl shadow-xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl">Claim Your Kickstart</CardTitle>
                <p className="text-slate-600">Level Up Your Training — limited spots each intake. We’ll be in touch to lock in your first session and personalise your plan.</p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold">You're in! 🎉</h3>
                    <p className="text-slate-600 mt-2">Thanks for your interest. We'll contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                    <Input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Input required type="tel" placeholder="Mobile" value={phone} onChange={e => setPhone(e.target.value)} />
                    <Textarea placeholder="Any questions or goals?" value={message} onChange={e => setMessage(e.target.value)} />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" disabled={submitting} className="w-full rounded-2xl">{submitting ? "Sending..." : "Start Kickstart"}</Button>
                    <p className="text-xs text-slate-500">By submitting, you agree to be contacted about your enquiry. No spam.</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 items-stretch">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold">28 Day Kickstart</h2>
            <p className="mt-3 text-slate-600">Your first month structured for momentum. Build habits, learn technique, and see measurable progress with coach support.</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-slate-700">
              {["4 curated weeks of progressive training","Technique coaching every session","Heart-rate tiles & progress tracking","Access to all program types (Strength, Cardio, Hybrid)"].map(f => (
                <li key={f} className="flex items-start gap-2"><Check className="w-5 h-5 mt-0.5" /><span>{f}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Button asChild className="rounded-2xl"><a href="#home">Get Started</a></Button>
              <Button asChild className="rounded-2xl"><a href="#faqs">What’s included</a></Button>
            </div>
          </div>
          <Card className="overflow-hidden rounded-2xl border-slate-200">
            <img src="https://images.unsplash.com/photo-1517963628607-235ccdd5476f?q=80&w=1500&auto=format&fit=crop" alt="Athletes working out at a studio" className="h-44 w-full object-cover" loading="lazy" />
            <CardContent className="p-6">
              <p className="text-sm text-slate-600">“The best training community in Wynnum. Coaches actually coach and the programming keeps me progressing.”</p>
              <p className="mt-3 text-sm font-medium">— Member review</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Why Train at BFT Wynnum</h2>
          <p className="mt-3 text-slate-600 max-w-3xl">We keep it real: great coaching, progressive programming, and an inclusive vibe where you’ll actually want to show up. Our 28 Day Kickstart gets you moving safely, building confidence, and slotting training into your week without overwhelm.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Feature icon={Dumbbell} title="Progressive Strength" text="Build a strong foundation with coach-led technique and structured progressions." />
            <Feature icon={Heart} title="Smarter Cardio" text="Train in the right heart-rate zones to burn calories and boost endurance efficiently." />
            <Feature icon={Clock} title="50-Minute Sessions" text="High-energy, time-efficient classes that fit busy schedules." />
          </div>
        </div>
      </section>

      {/* COACHES */}
      <section id="team" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Meet Your Coaches</h2>
          <p className="mt-2 text-slate-600">Technique-obsessed, friendly, and here for your progress.</p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {COACHES.map(c => (
              <Card key={c.name} className="overflow-hidden rounded-2xl border-slate-200">
                {/* Taller height + object-top keeps heads visible */}
                <img src={c.img} alt={c.name} className="w-full h-56 sm:h-64 object-cover object-top" loading="lazy" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <p className="text-slate-500 text-sm">{c.role}</p>
                </CardHeader>
                <CardContent className="text-slate-600 text-sm">{c.bio}</CardContent>
              </Card>
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
              <p className="mt-2 text-slate-600">Book via the app after you enquire.</p>
            </div>
            <Button asChild className="rounded-2xl"><a href="#contact">Ask About Session Times</a></Button>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {TIMETABLE.map(col => (
              <Card key={col.group} className="rounded-2xl border-slate-200">
                <CardHeader><CardTitle>{col.group}</CardTitle></CardHeader>
                <CardContent className="text-slate-600 text-sm space-y-2">
                  {col.sessions.map((s, idx) => <Session key={idx} time={s.time} child={s.child} />)}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">👶 Child-minding available at 9:15am Mon–Fri, 4:00pm Mon & Wed, and 8:00am & 9:15am Saturday.</p>
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <ElfsightReviews />

      {/* FAQS */}
      <section id="faqs" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold">FAQs</h2>
          <div className="mt-4">
            <FaqItem q="Do I need to be fit to start?" a="Not at all. We coach to your level and scale everything." />
            <FaqItem q="Is pricing shown here?" a="We chat through options in-studio — this page focuses on the experience." />
            <FaqItem q="Do you have child-minding?" a="Yes: 9:15am Mon–Fri, 4:00pm Mon & Wed, and 8:00am & 9:15am Saturday." />
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold">Find Us</h2>
            <div className="mt-4 space-y-2 text-slate-700">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <span>66 Edith St, Wynnum QLD 4178</span></p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> <a href="tel:+61413496289" className="underline">0413 496 289</a></p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> <a href="mailto:wynnum@bodyfittraining.com" className="underline">wynnum@bodyfittraining.com</a></p>
              <div className="pt-2">
                <Button asChild className="rounded-2xl"><a href="https://maps.google.com/?q=66%20Edith%20St%20Wynnum%204178" target="_blank" rel="noreferrer">Get Directions</a></Button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Ask a Question</h2>
            <p className="mt-2 text-slate-600">Tell us your goals and we’ll recommend the best sessions to start with.</p>
            <Card className="mt-4 rounded-2xl border-slate-200">
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold">Thanks! We’ll be in touch.</h3>
                    <p className="text-slate-600 mt-2">Keep an eye on your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input required placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
                      <Input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <Input required type="tel" placeholder="Mobile" value={phone} onChange={e => setPhone(e.target.value)} />
                    <Textarea rows={5} placeholder="Your message (goals, preferred times, injuries, etc.)" value={message} onChange={e => setMessage(e.target.value)} />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" disabled={submitting} className="w-full rounded-2xl">{submitting ? "Sending..." : "Send Message"}</Button>
                  </form>
                )}
              </CardContent>
            </Card>
            <p className="mt-3 text-xs text-slate-500">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t bg-white/80">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} BFT Wynnum. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#contact" className="underline">Contact</a>
            <a href="#faqs" className="underline">FAQs</a>
            <a href="#" className="underline">Terms</a>
            <a href="#" className="underline">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
