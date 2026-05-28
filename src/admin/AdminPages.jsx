import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, LogOut, PackageCheck, Search, ShieldCheck } from "lucide-react";
import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";

const ADMIN_EMAIL = "zidateothmane1@gmail.com";
const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

function priceFromOffer(offer = "") {
  if (offer.includes("2 T-Shirts")) return 179;
  if (offer.includes("3 T-Shirts")) return 229;
  return 0;
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function startOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfWeek() {
  const date = startOfDay();
  date.setDate(date.getDate() - date.getDay());
  return date;
}

function startOfMonth() {
  const date = startOfDay();
  date.setDate(1);
  return date;
}

function countSince(items, date) {
  return items.filter((item) => new Date(item.created_at) >= date).length;
}

function mostCommon(items, key, fallback = "-") {
  const counts = items.reduce((acc, item) => {
    const value = item[key] || fallback;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
}

function estimatedTotal(order) {
  return Number(order.estimated_total || priceFromOffer(order.offer) * Number(order.quantity || 1));
}

async function getSessionUser() {
  if (!hasSupabaseConfig || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!hasSupabaseConfig || !supabase) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setLoading(true);
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    if (data.user?.email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      setError("Unauthorized. This account is not allowed to access ZIDATE admin.");
      return;
    }

    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-chalk px-4 py-16 sm:px-5 sm:py-24">
      <motion.form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="eyebrow">ZIDATE Admin</p>
        <h1 className="section-title">Secure login.</h1>
        <p className="section-copy text-sm">Only {ADMIN_EMAIL} can access admin data.</p>

        <div className="mt-7 space-y-5">
          <label className="form-field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" />
          </label>
        </div>

        {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}

        <button type="submit" className="btn-primary mt-7 w-full disabled:opacity-60" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <Link to="/" className="mt-4 inline-flex w-full justify-center text-sm font-black text-smoke hover:text-ink">
          Back to website
        </Link>
      </motion.form>
    </main>
  );
}

export function ProtectedAdminRoute() {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let mounted = true;
    getSessionUser().then((user) => {
      if (mounted) setState({ loading: false, user });
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return <AdminLoading label="Checking secure session..." />;
  }

  if (!state.user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (state.user.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-chalk px-4 py-16 sm:px-5 sm:py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft sm:p-8">
          <ShieldCheck className="text-gold" />
          <h1 className="mt-4 text-3xl font-black text-ink">Unauthorized</h1>
          <p className="mt-4 text-sm leading-7 text-smoke">This account is authenticated but is not allowed to view ZIDATE admin data.</p>
        </div>
      </main>
    );
  }

  return <Outlet />;
}

function AdminLoading({ label = "Loading..." }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-chalk px-4 py-16 sm:px-5 sm:py-24">
      <div className="mx-auto max-w-md rounded-[2rem] border border-ink/10 bg-white p-6 text-center shadow-soft sm:p-8">
        <p className="text-sm font-black text-ink">{label}</p>
      </div>
    </main>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-chalk">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-xl font-black tracking-[0.3em] text-ink">ZIDATE</p>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-smoke">Admin Console</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {[
              ["Dashboard", "/admin/dashboard"],
              ["Orders", "/admin/orders"],
              ["Analytics", "/admin/analytics"],
            ].map(([label, path]) => (
              <NavLink key={path} to={path} className={({ isActive }) => `shrink-0 rounded-full px-4 py-3 text-sm font-black sm:py-2 ${isActive ? "bg-ink text-paper" : "bg-white text-ink"}`}>
                {label}
              </NavLink>
            ))}
            <button onClick={logout} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-ink sm:py-2">
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
      </header>
      <Outlet />
    </main>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="min-w-0 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-smoke">{label}</p>
      <p className="mt-3 break-words text-3xl font-black text-ink">{value}</p>
      {hint && <p className="mt-2 text-xs font-bold text-smoke">{hint}</p>}
    </div>
  );
}

function useAdminData({ refreshMs = 15000 } = {}) {
  const [state, setState] = useState({ loading: true, error: "", orders: [], pageViews: [] });

  const load = async () => {
    if (!supabase) {
      setState({ loading: false, error: "Supabase is not configured.", orders: [], pageViews: [] });
      return;
    }

    setState((current) => ({ ...current, loading: true, error: "" }));
    const [ordersResult, viewsResult] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("page_views").select("*").order("created_at", { ascending: false }).limit(1000),
    ]);

    if (ordersResult.error || viewsResult.error) {
      setState({
        loading: false,
        error: ordersResult.error?.message || viewsResult.error?.message || "Could not load admin data.",
        orders: [],
        pageViews: [],
      });
      return;
    }

    setState({ loading: false, error: "", orders: ordersResult.data || [], pageViews: viewsResult.data || [] });
  };

  useEffect(() => {
    load();
    if (!refreshMs) return undefined;

    const intervalId = window.setInterval(load, refreshMs);
    return () => window.clearInterval(intervalId);
  }, [refreshMs]);

  return { ...state, reload: load };
}

function computeStats(orders, pageViews) {
  const visitors = new Set(pageViews.map((view) => view.visitor_id).filter(Boolean));
  const revenue = orders.reduce((sum, order) => sum + estimatedTotal(order), 0);
  const totalVisitors = visitors.size;

  return {
    totalOrders: orders.length,
    newOrders: orders.filter((order) => order.status === "new").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    todayOrders: countSince(orders, startOfDay()),
    weekOrders: countSince(orders, startOfWeek()),
    monthOrders: countSince(orders, startOfMonth()),
    revenue,
    bestOffer: mostCommon(orders, "offer"),
    topSize: mostCommon(orders, "size"),
    topCity: mostCommon(orders, "city"),
    totalVisitors,
    totalPageViews: pageViews.length,
    todayVisitors: new Set(pageViews.filter((view) => new Date(view.created_at) >= startOfDay()).map((view) => view.visitor_id)).size,
    weekVisitors: new Set(pageViews.filter((view) => new Date(view.created_at) >= startOfWeek()).map((view) => view.visitor_id)).size,
    monthVisitors: new Set(pageViews.filter((view) => new Date(view.created_at) >= startOfMonth()).map((view) => view.visitor_id)).size,
    conversion: totalVisitors ? `${((orders.length / totalVisitors) * 100).toFixed(1)}%` : "0%",
  };
}

export function AdminDashboard() {
  const { loading, error, orders, pageViews } = useAdminData();
  const stats = useMemo(() => computeStats(orders, pageViews), [orders, pageViews]);

  if (loading) return <AdminLoading />;

  return (
    <section className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow">Dashboard</p>
      <h1 className="section-title">ZIDATE overview.</h1>
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
      {!error && orders.length === 0 && <p className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-smoke">No orders yet. New COD orders will appear here.</p>}
      <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={stats.totalOrders} />
        <StatCard label="New orders" value={stats.newOrders} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Shipped" value={stats.shipped} />
        <StatCard label="Delivered" value={stats.delivered} />
        <StatCard label="Cancelled" value={stats.cancelled} />
        <StatCard label="Today" value={stats.todayOrders} />
        <StatCard label="This week" value={stats.weekOrders} />
        <StatCard label="This month" value={stats.monthOrders} />
        <StatCard label="Estimated COD revenue" value={`${stats.revenue} DH`} hint="Estimated, not online paid revenue" />
        <StatCard label="Best selling offer" value={stats.bestOffer} />
        <StatCard label="Most ordered size" value={stats.topSize} />
        <StatCard label="Top city" value={stats.topCity} />
        <StatCard label="Total visitors" value={stats.totalVisitors} />
        <StatCard label="Total page views" value={stats.totalPageViews} />
        <StatCard label="Today visitors" value={stats.todayVisitors} />
        <StatCard label="This week visitors" value={stats.weekVisitors} />
        <StatCard label="This month visitors" value={stats.monthVisitors} />
        <StatCard label="Conversion estimate" value={stats.conversion} />
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    new: "bg-gold/15 text-gold",
    confirmed: "bg-blue-50 text-blue-800",
    shipped: "bg-purple-50 text-purple-800",
    delivered: "bg-emerald-50 text-emerald-800",
    cancelled: "bg-red-50 text-red-800",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${styles[status] || styles.new}`}>{status}</span>;
}

export function AdminOrders() {
  const { loading, error, orders, reload } = useAdminData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [offer, setOffer] = useState("all");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const cities = [...new Set(orders.map((order) => order.city).filter(Boolean))];
  const offerOptions = [...new Set(orders.map((order) => order.offer).filter(Boolean))];

  const filtered = orders.filter((order) => {
    const text = `${order.id} ${order.first_name} ${order.last_name} ${order.phone} ${order.city}`.toLowerCase();
    return (
      text.includes(search.toLowerCase()) &&
      (status === "all" || order.status === status) &&
      (city === "all" || order.city === city) &&
      (offer === "all" || order.offer === offer)
    );
  });

  const updateStatus = async (order, nextStatus) => {
    setMessage("");
    const { error: updateError } = await supabase.from("orders").update({ status: nextStatus }).eq("id", order.id);
    if (updateError) {
      setMessage(`Status update failed: ${updateError.message}`);
      return;
    }
    setMessage("Order status updated successfully.");
    setSelected((current) => current && { ...current, status: nextStatus });
    await reload();
  };

  if (loading) return <AdminLoading />;

  return (
    <section className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow">Orders</p>
      <h1 className="section-title">Manage COD orders.</h1>
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
      {message && <p className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-ink">{message}</p>}

      <div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="form-field">
          <span>Search</span>
          <div className="relative">
            <Search className="absolute left-4 top-4 text-smoke" size={18} />
            <input className="pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, phone, city, order ID" />
          </div>
        </label>
        <label className="form-field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All</option>
            {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>City</span>
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="all">All</option>
            {cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Offer</span>
          <select value={offer} onChange={(event) => setOffer(event.target.value)}>
            <option value="all">All</option>
            {offerOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-chalk text-xs font-black uppercase tracking-[0.16em] text-smoke">
            <tr>
              {["Order ID", "Customer", "Phone", "City", "Product", "Offer", "Size", "Qty", "Total", "Status", "Created"].map((head) => <th key={head} className="p-4">{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} onClick={() => setSelected(order)} className="cursor-pointer border-t border-ink/10 hover:bg-chalk/70">
                <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}</td>
                <td className="p-4 font-bold">{order.first_name} {order.last_name}</td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">{order.city}</td>
                <td className="p-4">{order.product_name}</td>
                <td className="p-4">{order.offer}</td>
                <td className="p-4">{order.size}</td>
                <td className="p-4">{order.quantity}</td>
                <td className="p-4 font-black">{estimatedTotal(order)} DH</td>
                <td className="p-4"><StatusBadge status={order.status} /></td>
                <td className="p-4">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid min-w-0 gap-4 lg:hidden">
        {filtered.map((order) => (
          <button key={order.id} onClick={() => setSelected(order)} className="min-w-0 rounded-3xl border border-ink/10 bg-white p-5 text-left shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-black text-ink">{order.first_name} {order.last_name}</p>
                <p className="mt-1 break-words text-sm font-bold text-smoke">{order.city} - {order.phone}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-4 break-words text-sm font-bold text-ink">{order.offer} - {order.size} - {estimatedTotal(order)} DH</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:p-4" onClick={() => setSelected(null)}>
          <div className="ml-auto min-h-full w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-paper p-4 shadow-soft sm:rounded-[2rem] sm:p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Order detail</p>
                <h2 className="mt-2 text-2xl font-black text-ink">{selected.first_name} {selected.last_name}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="min-h-10 shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black">Close</button>
            </div>
            <div className="mt-6 grid gap-3 text-sm font-bold text-smoke">
              {[
                ["Order ID", selected.id],
                ["Phone", selected.phone],
                ["City", selected.city],
                ["Home address", selected.address],
                ["Product name", selected.product_name],
                ["Product color", selected.product_color],
                ["Product slug", selected.product_slug],
                ["Selected offer", selected.offer],
                ["Size", selected.size],
                ["Quantity", selected.quantity],
                ["Estimated total", `${estimatedTotal(selected)} DH`],
                ["Payment method", selected.payment_method || "Cash on Delivery"],
                ["Status", selected.status],
                ["Notes", selected.notes || "-"],
                ["Created", formatDate(selected.created_at)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-smoke">{label}</p>
                  <p className="mt-1 break-words text-ink">{value}</p>
                </div>
              ))}
            </div>
            <label className="form-field mt-6">
              <span>Update status</span>
              <select value={selected.status} onChange={(event) => updateStatus(selected, event.target.value)}>
                {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </div>
      )}
    </section>
  );
}

export function AdminAnalytics() {
  const { loading, error, orders, pageViews } = useAdminData();
  const stats = useMemo(() => computeStats(orders, pageViews), [orders, pageViews]);
  const pageCounts = Object.entries(pageViews.reduce((acc, view) => {
    acc[view.page_path] = (acc[view.page_path] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const referrers = Object.entries(pageViews.reduce((acc, view) => {
    const ref = view.referrer || "Direct";
    acc[ref] = (acc[ref] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 8);

  if (loading) return <AdminLoading />;

  return (
    <section className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow">Analytics</p>
      <h1 className="section-title">Visitor analytics.</h1>
      {error && <p className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
      {!error && pageViews.length === 0 && <p className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold text-smoke">No page views tracked yet.</p>}
      <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total visitors" value={stats.totalVisitors} />
        <StatCard label="Total page views" value={stats.totalPageViews} />
        <StatCard label="Today visitors" value={stats.todayVisitors} />
        <StatCard label="This week visitors" value={stats.weekVisitors} />
        <StatCard label="This month visitors" value={stats.monthVisitors} />
        <StatCard label="Conversion estimate" value={stats.conversion} hint="Total orders / total visitors" />
      </div>

      <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink">Most visited pages</h2>
          <div className="mt-5 space-y-3">
            {pageCounts.map(([path, count]) => (
              <div key={path} className="flex items-center justify-between rounded-2xl bg-chalk p-4 text-sm font-bold">
                <span>{path}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-ink">Traffic referrers</h2>
          <div className="mt-5 space-y-3">
            {referrers.map(([ref, count]) => (
              <div key={ref} className="flex items-center justify-between gap-4 rounded-2xl bg-chalk p-4 text-sm font-bold">
                <span className="truncate">{ref}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white">
        <div className="flex items-center gap-3 border-b border-ink/10 p-5">
          <BarChart3 size={20} className="text-gold" />
          <h2 className="text-xl font-black text-ink">Recent page views</h2>
        </div>
        <div className="divide-y divide-ink/10">
          {pageViews.slice(0, 20).map((view) => (
            <div key={view.id} className="grid min-w-0 gap-2 p-5 text-sm font-bold text-smoke md:grid-cols-[1fr_1fr_auto]">
              <p className="break-words text-ink">{view.page_path}</p>
              <p className="truncate">{view.referrer || "Direct"}</p>
              <p>{formatDate(view.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

