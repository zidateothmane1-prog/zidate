import { hasSupabaseConfig, supabase } from "./supabaseClient";

function createId(prefix) {
  if (crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getVisitorIds() {
  let visitorId = localStorage.getItem("zidate_visitor_id");
  if (!visitorId) {
    visitorId = createId("visitor");
    localStorage.setItem("zidate_visitor_id", visitorId);
  }

  let sessionId = sessionStorage.getItem("zidate_session_id");
  if (!sessionId) {
    sessionId = createId("session");
    sessionStorage.setItem("zidate_session_id", sessionId);
  }

  return { visitorId, sessionId };
}

export async function trackPageView(pathname) {
  if (!hasSupabaseConfig || !supabase) return;
  if (!["/", "/products", "/offers", "/why-zidate", "/order"].includes(pathname)) return;

  const lastTracked = sessionStorage.getItem("zidate_last_tracked_path");
  if (lastTracked === pathname) return;
  sessionStorage.setItem("zidate_last_tracked_path", pathname);

  const { visitorId, sessionId } = getVisitorIds();

  try {
    await supabase.from("page_views").insert({
      page_path: pathname,
      page_title: document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
      visitor_id: visitorId,
      session_id: sessionId,
    });
  } catch (error) {
    console.warn("Page view tracking failed", error);
  }
}
