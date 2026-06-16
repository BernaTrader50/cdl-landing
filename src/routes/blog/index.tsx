import { createFileRoute, Link } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooter } from "@/components/site-footer";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Research & Guides — ClickDecisionLab" },
      { name: "description", content: "83 research articles, buying guides, technical comparisons and how-to guides for solar generators, EV chargers and home batteries. Independent analysis based on verified specs." },
    ],
  }),
  component: BlogPage,
});

const API_BASE = "https://clickdecisionlab.com/wp-json/wp/v2";

type Post = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  link: string;
  categories: number[];
};

// Category IDs from WordPress
const CATEGORY_MAP: Record<string, { id: number | null; label: string; icon: string }> = {
  all:      { id: null, label: "All Research",     icon: "◈" },
  solar:    { id: 1,    label: "Solar Generators",  icon: "☀" },
  ev:       { id: 3,    label: "EV Chargers",       icon: "⚡" },
  battery:  { id: 4,    label: "Home Batteries",    icon: "⬡" },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim().slice(0, 140) + "…";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PostCard({ post }: { post: Post }) {
  const excerpt = stripHtml(post.excerpt.rendered);
  const slug = post.link.replace(/https?:\/\/[^/]+/, "").replace(/\/$/, "") + "/";
  return (
    <a
      href={slug}
      className="group flex flex-col rounded-[12px] border bg-white p-5 hover:border-neutral-400 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
      style={{ borderColor: "#E2E2E2" }}
    >
      <p className="font-mono text-[9.5px] text-neutral-400 mb-2">{formatDate(post.date)}</p>
      <h2 className="text-[14px] font-semibold leading-snug text-neutral-900 group-hover:text-[#2563EB] transition-colors mb-2 flex-1">
        {post.title.rendered}
      </h2>
      <p className="text-[12px] text-neutral-500 leading-relaxed line-clamp-2">{excerpt}</p>
      <p className="mt-3 font-mono text-[10.5px] text-neutral-400 group-hover:text-[#2563EB] transition-colors">
        Read →
      </p>
    </a>
  );
}

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const PER_PAGE = 18;

  useEffect(() => {
    setLoading(true);
    const cat = CATEGORY_MAP[activeTab];
    const catParam = cat.id ? `&categories=${cat.id}` : "";
    fetch(`${API_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_fields=id,slug,title,excerpt,date,link,categories${catParam}`)
      .then(async (res) => {
        setTotalPages(parseInt(res.headers.get("X-WP-TotalPages") || "1"));
        setTotalPosts(parseInt(res.headers.get("X-WP-Total") || "0"));
        return res.json();
      })
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeTab, page]);

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <SiteHeader />

      {/* HERO */}
      <section className="relative bg-[#2563eb] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
             style={{ backgroundImage:
               "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
               backgroundSize: "44px 44px" }} />
        <div className="relative max-w-6xl mx-auto px-5 pt-14 pb-16">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-blue-100 mb-3">Research</p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Technical guides and analysis.
          </h1>
          <p className="text-blue-50/90 max-w-xl leading-relaxed">
            Independent research across solar generators, EV chargers, and home batteries. Built on verified specs, not marketing claims.
          </p>
          <div className="mt-4 flex items-center gap-5 flex-wrap">
            {["125 research articles", "3 verticals", "Updated daily"].map(t => (
              <span key={t} className="font-mono text-[10px] text-blue-100 uppercase tracking-wider">{t}</span>
            ))}
          </div>

          {/* Vertical filters */}
          <div className="mt-8 flex items-center gap-2 flex-wrap">
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleTab(key)}
                className={`flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors ${
                  activeTab === key
                    ? "bg-white text-[#2563eb]"
                    : "bg-white/10 border border-white/20 text-blue-50 hover:bg-white/15"
                }`}
              >
                <span className="text-[13px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
            <span className="font-mono text-[10px] text-blue-100 ml-1">
              {loading ? "…" : `${totalPosts} articles`}
            </span>
          </div>

          {/* Quick links to hubs */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] text-blue-200 uppercase tracking-wider">Also:</span>
            {[
              { href: "/technical-analysis", label: "15 Technical Analyses" },
              { href: "/comparisons", label: "25 Comparisons" },
              { href: "/solar-calculator", label: "Decision Engine" },
            ].map(l => (
              <a key={l.href} href={l.href}
                className="font-mono text-[10.5px] text-white hover:underline">
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pt-10 pb-20">

        {/* Posts grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-[12px] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-neutral-500 text-center py-12">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-[8px] border px-4 py-2 font-mono text-[11px] text-neutral-600 hover:border-neutral-400 disabled:opacity-30 transition-colors"
              style={{ borderColor: "#E2E2E2" }}
            >
              ← Previous
            </button>
            <span className="font-mono text-[11px] text-neutral-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-[8px] border px-4 py-2 font-mono text-[11px] text-neutral-600 hover:border-neutral-400 disabled:opacity-30 transition-colors"
              style={{ borderColor: "#E2E2E2" }}
            >
              Next →
            </button>
          </div>
        )}

      </main>
      <SiteFooter />
    </div>
  );
}
