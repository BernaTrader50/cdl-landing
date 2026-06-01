import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const API_BASE = "https://papayawhip-armadillo-217262.hostingersite.com/wp-json/wp/v2";

type Post = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
};

type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

type LoaderData = {
  initialPosts: Post[];
  initialCategories: Category[];
  totalPages: number;
};

const FILTER_TABS = [
  { label: "All", slug: "all" },
  { label: "Home Backup", slug: "home-backup" },
  { label: "Camping & Off-Grid", slug: "camping-off-grid" },
  { label: "Comparisons", slug: "comparisons" },
  { label: "Technical Guides", slug: "technical-guides" },
  { label: "Use Cases", slug: "use-cases" },
];

async function loadBlogData(): Promise<LoaderData> {
  const [postsRes, catsRes] = await Promise.all([
    fetch(`${API_BASE}/posts?per_page=12&page=1&_fields=id,slug,title,excerpt,date,categories`),
    fetch(`${API_BASE}/categories?per_page=20&_fields=id,name,slug,count`),
  ]);
  const initialPosts = postsRes.ok ? ((await postsRes.json()) as Post[]) : [];
  const totalPages = postsRes.ok ? Number(postsRes.headers.get("X-WP-TotalPages") || "1") : 1;
  const initialCategories = catsRes.ok ? ((await catsRes.json()) as Category[]) : [];
  return { initialPosts, initialCategories, totalPages };
}

export const Route = createFileRoute("/blog/")({
  loader: () => loadBlogData(),
  head: () => ({
    meta: [
      { title: "Solar Generator Research & Guides | ClickDecisionLab" },
      { name: "description", content: "Technical guides, comparisons, and decision frameworks for solar generators. Engineering-grade analysis to help you choose the right unit for your needs." },
      { property: "og:title", content: "Solar Generator Research & Guides | ClickDecisionLab" },
      { property: "og:description", content: "Technical guides, comparisons, and decision frameworks for solar generators." },
      { property: "og:url", content: "https://www.clickdecisionlab.com/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://www.clickdecisionlab.com/blog" }],
  }),
  component: BlogIndex,
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch { return ""; }
}

function BlogIndex() {
  const loaderData = Route.useLoaderData() as LoaderData;
  const [posts, setPosts] = useState<Post[]>(loaderData.initialPosts ?? []);
  const [categories] = useState<Category[]>(loaderData.initialCategories ?? []);
  const [activeSlug, setActiveSlug] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState((loaderData.totalPages ?? 1) > 1);
  const [error, setError] = useState<string | null>(null);

  const catBySlug = (slug: string) => categories.find((c) => c.slug === slug);
  const catById = (id: number) => categories.find((c) => c.id === id);

  async function fetchPosts(p: number, catId?: number, replace = false) {
    try {
      const url = new URL(`${API_BASE}/posts`);
      url.searchParams.set("per_page", "12");
      url.searchParams.set("page", String(p));
      url.searchParams.set("_fields", "id,slug,title,excerpt,date,categories");
      if (catId) url.searchParams.set("categories", String(catId));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("fetch failed");
      const total = Number(res.headers.get("X-WP-TotalPages") || "1");
      const data = (await res.json()) as Post[];
      setPosts((prev) => (replace ? data : [...prev, ...data]));
      setHasMore(p < total);
      setError(null);
    } catch {
      setError("Could not load articles. Try again.");
    }
  }

  async function handleFilter(slug: string) {
    setActiveSlug(slug);
    setPage(1);
    setLoading(true);
    const catId = slug === "all" ? undefined : catBySlug(slug)?.id;
    await fetchPosts(1, catId, true);
    setLoading(false);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    const next = page + 1;
    const catId = activeSlug === "all" ? undefined : catBySlug(activeSlug)?.id;
    await fetchPosts(next, catId, false);
    setPage(next);
    setLoadingMore(false);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#2563EB]">RESEARCH</p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]">
            Solar Generator Research & Guides
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-neutral-600">
            In-depth analysis, real-world testing, and decision frameworks for solar generators and off-grid power.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e8e8e8] pb-4">
            {FILTER_TABS.map((tab) => {
              const isActive = tab.slug === activeSlug;
              return (
                <button key={tab.slug} onClick={() => handleFilter(tab.slug)}
                  className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${isActive ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 hover:bg-[#f5f5f5]"}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {error && !loading ? (
              <div className="rounded-lg border border-[#e8e8e8] bg-white p-8 text-center text-[14px] text-neutral-600">
                {error}
                <div className="mt-3">
                  <button onClick={() => handleFilter(activeSlug)} className="rounded-md bg-neutral-900 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#2563EB]">
                    Try again
                  </button>
                </div>
              </div>
            ) : loading ? (
              <SkeletonGrid />
            ) : posts.length === 0 ? (
              <p className="text-[14px] text-neutral-600">No articles found in this category.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((p) => {
                    const cat = p.categories?.[0] ? catById(p.categories[0]) : undefined;
                    return (
                      <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }}
                        className="group flex h-full flex-col rounded-xl border border-[#E8E8E8] bg-white p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
                      >
                        {cat && <span className="self-start rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB]">{cat.name}</span>}
                        <h2 className="mt-3 text-[18px] font-semibold leading-[1.3] tracking-[-0.01em] text-neutral-950 group-hover:text-[#2563EB]"
                          dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                        />
                        <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-neutral-600">
                          {stripHtml(p.excerpt.rendered)}
                        </p>
                        <p className="mt-4 text-[12px] text-neutral-500">{formatDate(p.date)}</p>
                      </Link>
                    );
                  })}
                </div>
                {hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button onClick={handleLoadMore} disabled={loadingMore}
                      className="rounded-md border border-neutral-900 bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#2563EB] hover:border-[#2563EB] disabled:opacity-60"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[#E8E8E8] bg-white p-6">
          <div className="h-4 w-20 animate-pulse rounded bg-[#f0f0f0]" />
          <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-[#f0f0f0]" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-[#f0f0f0]" />
          <div className="mt-4 h-3 w-24 animate-pulse rounded bg-[#f0f0f0]" />
        </div>
      ))}
    </div>
  );
}
