import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const API_BASE = "https://papayawhip-armadillo-217262.hostingersite.com/wp-json/wp/v2";
const CDL_BASE = "https://www.clickdecisionlab.com";

type Post = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories: number[];
};

type Category = { id: number; name: string; slug: string };

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return ""; }
}

async function loadData(slug: string) {
  const postRes = await fetch(
    `${API_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,date,categories,excerpt`,
  );
  if (!postRes.ok) throw new Error("Failed to load post");
  const posts = (await postRes.json()) as Post[];
  const post = posts[0];
  if (!post) throw notFound();

  let categories: Category[] = [];
  let related: Post[] = [];

  if (post.categories?.length) {
    const catId = post.categories[0];
    const [catRes, relRes] = await Promise.all([
      fetch(`${API_BASE}/categories?include=${post.categories.join(",")}&_fields=id,name,slug`),
      fetch(`${API_BASE}/posts?categories=${catId}&exclude=${post.id}&per_page=3&_fields=id,slug,title,excerpt,date,categories`),
    ]);
    if (catRes.ok) categories = (await catRes.json()) as Category[];
    if (relRes.ok) related = (await relRes.json()) as Post[];
  }

  return { post, categories, related };
}

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => loadData(params.slug),
  head: ({ loaderData, params }) => {
    const slug = params.slug;
    const canonicalUrl = `${CDL_BASE}/blog/${slug}`;
    const title = loaderData?.post
      ? `${stripHtml(loaderData.post.title.rendered)} | ClickDecisionLab`
      : "Article — ClickDecisionLab";
    const description = loaderData?.post
      ? stripHtml(loaderData.post.excerpt.rendered).slice(0, 160)
      : "";
    const publishedTime = loaderData?.post?.date ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "ClickDecisionLab" },
        { property: "og:image", content: `${CDL_BASE}/og-default.png` },
        { property: "article:published_time", content: publishedTime },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${CDL_BASE}/og-default.png` },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
    };
  },
  component: BlogPost,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-semibold">Couldn't load this article</h1>
          <p className="mt-2 text-sm text-neutral-600">{error.message}</p>
          <Link to="/blog" className="mt-6 inline-block rounded-md bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2563EB]">
            ← Back to Research
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-white">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-semibold">Article not found</h1>
          <Link to="/blog" className="mt-6 inline-block rounded-md bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2563EB]">
            ← Back to Research
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
});

function BlogPost() {
  const { post, categories, related } = Route.useLoaderData() as {
    post: Post; categories: Category[]; related: Post[];
  };
  const catById = (id: number) => categories.find((c: Category) => c.id === id);

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <SiteNav />
      <main className="px-6 pb-24 pt-32">
        <article className="mx-auto max-w-[720px]">
          <Link to="/blog" className="inline-flex items-center gap-1 text-[13px] text-neutral-600 transition-colors hover:text-[#2563EB]">
            ← Back to Research
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {post.categories.map((id) => {
              const cat = catById(id);
              if (!cat) return null;
              return (
                <span key={id} className="rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB]">
                  {cat.name}
                </span>
              );
            })}
            <span className="text-[12px] text-neutral-500">{formatDate(post.date)}</span>
          </div>
          <h1
            className="mt-4 text-[40px] font-semibold leading-[1.15] tracking-[-0.025em]"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div
            className="wp-content mt-8 text-[17px] leading-[1.7] text-neutral-800"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </article>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-6xl border-t border-[#e8e8e8] pt-12">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">Related articles</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p) => {
                const cat = p.categories?.[0] ? catById(p.categories[0]) : undefined;
                return (
                  <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }}
                    className="group flex h-full flex-col rounded-xl border border-[#E8E8E8] bg-white p-6 transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]"
                  >
                    {cat && <span className="self-start rounded bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB]">{cat.name}</span>}
                    <h3 className="mt-3 text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] group-hover:text-[#2563EB]"
                      dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                    />
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-neutral-600">
                      {stripHtml(p.excerpt.rendered)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <style dangerouslySetInnerHTML={{ __html: `
        .wp-content p { margin: 0 0 1.25em; }
        .wp-content h2 { font-size: 26px; font-weight: 600; letter-spacing: -0.015em; margin: 2em 0 0.6em; line-height: 1.25; }
        .wp-content h3 { font-size: 20px; font-weight: 600; margin: 1.6em 0 0.5em; line-height: 1.3; }
        .wp-content a { color: #2563EB; text-decoration: underline; text-underline-offset: 2px; }
        .wp-content ul, .wp-content ol { padding-left: 1.4em; margin: 0 0 1.25em; }
        .wp-content li { margin-bottom: 0.4em; }
        .wp-content table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: 15px; }
        .wp-content th { background: #f5f5f5; font-weight: 600; padding: 8px 12px; text-align: left; border: 1px solid #e8e8e8; }
        .wp-content td { padding: 8px 12px; border: 1px solid #e8e8e8; }
        .wp-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.5em 0; }
        .wp-content code { background: #f5f5f5; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.92em; }
      `}} />
    </div>
  );
}
