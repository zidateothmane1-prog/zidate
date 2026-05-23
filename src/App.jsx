import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Menu,
  MessageCircle,
  PackageCheck,
  Shirt,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AdminAnalytics, AdminDashboard, AdminLayout, AdminLogin, AdminOrders, ProtectedAdminRoute } from "./admin/AdminPages";
import OrderForm from "./components/OrderForm";
import { categories, getOfferBySlug, getProductBySlug, offers, products } from "./data/products";
import { trackPageView } from "./lib/analytics";

const INSTAGRAM_LINK = "https://instagram.com/zidate.official/";
const TIKTOK_LINK = "https://tiktok.com/@zidateofficial";
const WHATSAPP_LINK = "https://wa.me/212600000000";

const navLinks = [
  ["Home", "/"],
  ["Products", "/products"],
  ["Offers", "/offers"],
  ["Why ZIDATE", "/why-zidate"],
  ["Order", "/order"],
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Section({ id, eyebrow, title, text, children, className = "" }) {
  return (
    <section id={id} className={`section-padding ${className}`}>
      <motion.div
        className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        variants={fadeUp}
      >
        {(eyebrow || title || text) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {text && <p className="section-copy">{text}</p>}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}

function PageShell({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-paper/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link to="/" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label="Go to home">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-white text-[0.72rem] font-black tracking-[0.22em] text-ink shadow-sm">
            Z
          </span>
          <span>
            <span className="block text-lg font-black tracking-[0.32em] text-ink">ZIDATE</span>
            <span className="block text-left text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-smoke">
              Daily Essentials
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-link ${isActive ? "text-ink" : ""}`}>
              {label}
            </NavLink>
          ))}
        </div>

        <Link to="/products" className="hidden rounded-full bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:-translate-y-0.5 hover:bg-black lg:inline-flex">
          Order Now
        </Link>

        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-ink/10 bg-paper px-5 pb-5 lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-3">
              {navLinks.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `rounded-2xl px-4 py-3 text-left text-sm font-bold hover:bg-white ${isActive ? "bg-white text-ink" : "text-smoke"}`}
                >
                  {label}
                </NavLink>
              ))}
              <Link onClick={() => setOpen(false)} to="/products" className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-bold text-paper">
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ProductMockup() {
  return (
    <motion.div
      className="relative mx-auto aspect-[0.86] w-full max-w-[460px] overflow-hidden rounded-[2rem] border border-white/50 bg-[#e9e5dc] p-5 shadow-soft"
      initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.85),transparent_34%),linear-gradient(135deg,rgba(184,155,88,0.18),transparent_45%)]" />
      <div className="absolute right-5 top-5 rounded-full border border-ink/10 bg-paper/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-ink">
        COD Morocco
      </div>
      <div className="relative flex h-full flex-col justify-end">
        <div className="product-shirt shirt-back" />
        <div className="product-shirt shirt-front">
          <span>ZIDATE</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/45 bg-ink/88 p-5 text-paper backdrop-blur">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-dune">Launch Offer</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-black tracking-tight">3 T-Shirts</p>
              <p className="text-sm text-paper/70">Best daily rotation</p>
            </div>
            <p className="text-4xl font-black text-dune">229</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductVisual({ product, className = "" }) {
  const [failed, setFailed] = useState(false);
  const tone =
    product.color === "Black"
      ? "from-neutral-950 to-neutral-700"
      : product.color === "Beige"
        ? "from-[#d8c7a1] to-[#f7f1e4]"
        : product.color === "Gray"
          ? "from-neutral-400 to-neutral-100"
          : "from-white to-[#ebe7df]";

  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-ink/10 bg-chalk ${className}`}>
      {!failed && (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
      {failed && (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${tone}`}>
          <div className="relative h-[56%] w-[58%] rounded-[22%_22%_14%_14%] bg-paper shadow-soft">
            <div className="absolute left-1/2 top-6 h-14 w-20 -translate-x-1/2 rounded-b-full bg-mist" />
            <p className="absolute inset-x-0 top-1/2 text-center text-sm font-black tracking-[0.42em] text-ink/70">ZIDATE</p>
          </div>
        </div>
      )}
      <span className={`absolute left-4 top-4 rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.16em] ${product.status === "Available" ? "bg-ink text-dune" : "bg-white/85 text-ink"}`}>
        {product.status}
      </span>
    </div>
  );
}

function ProductCard({ product }) {
  const available = product.status === "Available";
  return (
    <motion.article className="group rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-2 hover:shadow-soft" whileHover={{ scale: 1.01 }}>
      <ProductVisual product={product} />
      <div className="p-2 pt-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">{product.category}</p>
        <h3 className="mt-2 text-xl font-black text-ink">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-smoke">{product.description}</p>
        <p className="mt-4 text-sm font-black text-ink">Color: {product.color}</p>
        {available ? (
          <Link to={product.orderPath} className="btn-primary mt-5 w-full">
            Order Now <ArrowRight size={17} />
          </Link>
        ) : (
          <button className="mt-5 w-full rounded-full bg-chalk px-5 py-4 text-sm font-black text-smoke" disabled>
            Coming Soon
          </button>
        )}
      </div>
    </motion.article>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-paper pt-28">
      <div className="absolute inset-0 subtle-grid" />
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 px-5 pb-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
          <motion.p variants={fadeUp} className="badge">
            Moroccan Streetwear Essentials
          </motion.p>
          <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Daily Essentials, Made Clean.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-smoke">
            Moroccan streetwear essentials made for comfort, simplicity, and everyday style.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="btn-primary">
              Explore Products <ArrowRight size={18} />
            </Link>
            <Link to="/offers" className="btn-secondary">
              View Offers
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3 text-sm font-bold text-ink">
            <span className="mini-pill"><PackageCheck size={16} /> Cash on Delivery</span>
            <span className="mini-pill"><Truck size={16} /> Available in Morocco</span>
            <span className="mini-pill"><Sparkles size={16} /> Clean streetwear essentials</span>
          </motion.div>
        </motion.div>
        <ProductMockup />
      </div>
    </section>
  );
}

function HomePage() {
  const previewCards = [
    ["Products", "Explore oversized essentials and future ZIDATE drops.", "/products"],
    ["Offers", "Choose your daily rotation with clear COD prices.", "/offers"],
    ["Why ZIDATE", "Learn the brand story behind clean Moroccan essentials.", "/why-zidate"],
  ];

  return (
    <PageShell>
      <Hero />
      <Section eyebrow="Brand Intro" title="Simple pieces for daily confidence." text="ZIDATE starts with the clean white oversized t-shirt: easy to wear, easy to style, and made for everyday Moroccan streetwear.">
        <div className="grid gap-5 md:grid-cols-3">
          {previewCards.map(([title, text, path]) => (
            <Link key={title} to={path} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <p className="text-xl font-black text-ink">{title}</p>
              <p className="mt-3 text-sm leading-7 text-smoke">{text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-gold">Explore <ArrowRight size={16} /></span>
            </Link>
          ))}
        </div>
      </Section>
      <Section className="bg-chalk" eyebrow="Featured Offer" title="Best daily rotation." text="The 3 T-Shirts pack gives you the strongest value for a clean everyday wardrobe.">
        <OfferCard offer={offers[1]} />
      </Section>
      <Section className="bg-ink text-paper">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-dune">Ready to start clean?</p>
            <h2 className="section-title text-paper">Choose your ZIDATE essential.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-paper/70">Browse the collection first, then continue to the secure COD checkout.</p>
          </div>
          <Link to="/products" className="btn-secondary">Explore Products</Link>
        </div>
      </Section>
    </PageShell>
  );
}

function ProductsPage() {
  const [active, setActive] = useState("T-Shirts");
  const filtered = active === "Coming Soon" ? products.filter((product) => product.status !== "Available") : products.filter((product) => product.category === active);

  return (
    <PageShell>
      <Section className="bg-paper pt-32" eyebrow="Products" title="Explore the ZIDATE Collection" text="Clean everyday pieces made for comfort, simplicity, and style.">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button key={category} onClick={() => setActive(category)} className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${active === category ? "border-ink bg-ink text-paper" : "border-ink/10 bg-white text-ink hover:border-gold/60"}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </Section>
    </PageShell>
  );
}

function OfferCard({ offer }) {
  const orderPath = `/order?product=white-oversized-tshirt&offer=${offer.slug}`;
  return (
    <motion.div
      className={`relative grid gap-6 rounded-[1.75rem] border bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-2 md:grid-cols-[0.72fr_1fr] sm:p-8 ${offer.best ? "border-gold shadow-gold" : "border-ink/10"}`}
      whileHover={{ scale: 1.01 }}
    >
      {offer.best && <span className="absolute right-6 top-6 rounded-full bg-ink px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-dune">Best Offer</span>}
      <ProductVisual product={products[0]} className="max-h-[360px]" />
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-gold">ZIDATE Pack</p>
        <h3 className="mt-5 text-3xl font-black text-ink">{offer.title}</h3>
        <p className="mt-3 text-6xl font-black tracking-tight text-ink">{offer.price} DH</p>
        <p className="mt-4 text-sm leading-7 text-smoke">{offer.description}</p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {offer.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm font-bold text-ink">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-chalk text-gold"><Check size={15} /></span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="mini-pill"><PackageCheck size={16} /> COD</span>
          <Link to={orderPath} className={`btn-primary ${offer.best ? "" : "bg-chalk text-ink hover:bg-mist"}`}>
            Order Now <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function OffersPage() {
  return (
    <PageShell>
      <Section className="bg-chalk pt-32" eyebrow="Offers" title="Clean Packs. Clear Value." text="Choose your daily rotation and pay only when your order arrives.">
        <div className="grid gap-6">
          {offers.map((offer) => <OfferCard key={offer.slug} offer={offer} />)}
        </div>
      </Section>
    </PageShell>
  );
}

function WhyPage() {
  const values = ["Minimal design", "Comfortable oversized fit", "Everyday streetwear", "Made for Morocco", "Cash on Delivery", "More drops coming soon"];
  const process = ["Choose your product", "Pick your offer", "Confirm your information", "Pay with Cash on Delivery"];

  return (
    <PageShell>
      <Section className="bg-paper pt-32" eyebrow="Brand Story" title="Why ZIDATE?" text="Simple pieces. Clean confidence. Everyday comfort.">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-ink/10 bg-white p-7 shadow-soft">
            <p className="text-lg leading-8 text-smoke">
              ZIDATE is a Moroccan clothing brand built around clean essentials, simple style, and everyday comfort. We start with oversized basics and continue building pieces made for daily rotation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
                <Sparkles className="text-gold" size={20} />
                <p className="mt-4 text-lg font-black text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="bg-chalk" eyebrow="Process" title="How ZIDATE ordering works.">
        <div className="grid gap-4 lg:grid-cols-4">
          {process.map((step, index) => (
            <div key={step} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <span className="text-sm font-black uppercase tracking-[0.2em] text-gold">Step {index + 1}</span>
              <p className="mt-4 text-xl font-black leading-tight text-ink">{step}</p>
            </div>
          ))}
        </div>
      </Section>
      <LifestyleSection />
      <Section className="bg-paper">
        <div className="rounded-[2rem] border border-ink/10 bg-ink p-8 text-paper shadow-gold lg:p-12">
          <p className="eyebrow text-dune">Next move</p>
          <h2 className="section-title text-paper">Build your daily rotation.</h2>
          <Link to="/products" className="btn-secondary mt-7">Explore Products</Link>
        </div>
      </Section>
    </PageShell>
  );
}

function LifestyleSection() {
  return (
    <Section className="bg-ink text-paper">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1814] p-6">
          <div className="absolute inset-x-8 top-10 h-40 rounded-full bg-white/8 blur-3xl" />
          <ProductMockup />
        </div>
        <div>
          <p className="eyebrow text-dune">Lifestyle</p>
          <h2 className="section-title text-paper">Simple. Clean. Essential.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/68">
            ZIDATE is built for clean outfits, simple confidence, and everyday comfort. Oversized white t-shirts are the base: fresh, minimal, and easy to style.
          </p>
        </div>
      </div>
    </Section>
  );
}

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const product = getProductBySlug(query.get("product"));
  const offer = getOfferBySlug(query.get("offer"));

  return (
    <PageShell>
      <Section className="bg-chalk pt-32" eyebrow="COD Checkout" title="Confirm your ZIDATE order." text="Review your selected product, fill your delivery details, and pay only when your order arrives.">
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="sticky top-24 rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
            <ProductVisual product={product} />
            <div className="mt-6">
              <p className="eyebrow">Order Summary</p>
              <h3 className="mt-3 text-2xl font-black text-ink">{product.name}</h3>
              <div className="mt-5 space-y-3 text-sm font-bold text-smoke">
                <p>Product color: <span className="text-ink">{product.color}</span></p>
                <p>Selected offer: <span className="text-ink">{offer.label}</span></p>
                <p>Price: <span className="text-ink">{offer.price} DH</span></p>
                <p>Quantity: <span className="text-ink">1+</span></p>
                <p>Estimated total: <span className="text-ink">Updated in form</span></p>
              </div>
              <span className="mini-pill mt-5"><PackageCheck size={16} /> Cash on Delivery</span>
              <button onClick={() => navigate("/products")} className="btn-secondary mt-5 w-full">Change Product</button>
            </div>
          </div>
          <OrderForm key={`${product.slug}-${offer.slug}`} selectedProduct={product} selectedOffer={offer} />
        </div>
      </Section>
    </PageShell>
  );
}

function FAQ() {
  const faqs = [
    ["How can I order?", "Choose an available product or offer, then fill the COD order form on the order page."],
    ["Can I pay on delivery?", "Yes. ZIDATE supports Cash on Delivery in Morocco. You pay when you receive your order."],
    ["What offers are available?", "We currently offer 2 T-Shirts for 179 DH and 3 T-Shirts for 229 DH."],
    ["Are the t-shirts oversized?", "Yes. The t-shirts are designed with an oversized fit for comfort and everyday style."],
  ];
  const [active, setActive] = useState(0);

  return (
    <Section eyebrow="FAQ" title="Quick answers." className="bg-chalk">
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map(([question, answer], index) => (
          <div key={question} className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <button onClick={() => setActive(active === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-black text-ink">
              {question}
              <ChevronDown className={`shrink-0 transition ${active === index ? "rotate-180" : ""}`} size={18} />
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.p className="px-5 pb-5 text-sm leading-7 text-smoke" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  {answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-2xl font-black tracking-[0.34em] text-ink">ZIDATE</p>
          <p className="mt-2 text-sm font-bold text-smoke">Daily Essentials. Made for Morocco.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-smoke">
          {navLinks.map(([label, path]) => <Link key={path} to={path} className="hover:text-ink">{label}</Link>)}
          <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="hover:text-ink">Instagram</a>
          <a href={TIKTOK_LINK} target="_blank" rel="noreferrer" className="hover:text-ink">TikTok</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="hover:text-ink">WhatsApp</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs font-semibold text-smoke">© 2026 ZIDATE. All rights reserved.</p>
    </footer>
  );
}

export default function App() {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <main className="min-h-screen bg-paper font-body text-ink">
      <ScrollToTop />
      <AnalyticsTracker />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/why-zidate" element={<WhyPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!isOrderPage && !isAdminRoute && <FAQ />}
      {!isAdminRoute && <Footer />}
    </main>
  );
}
