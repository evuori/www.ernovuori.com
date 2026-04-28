import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getConfig } from "@/lib/config";
import { getPosts, getPost } from "@/lib/github";
import Nav from "@/components/Nav";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const config = await getConfig();
  const posts = await getPosts(config);
  return posts.map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = await getConfig();
  const post = await getPost(config, slug.join("/"));
  if (!post) return {};

  const { frontmatter, excerpt } = post;
  const title = frontmatter.og?.title ?? frontmatter.title ?? config.site.title;
  const description = frontmatter.og?.description ?? excerpt;
  const image = frontmatter.og?.image ?? frontmatter.cover ?? config.site.defaultOgImage;

  const postUrl = config.site.url
    ? new URL(`/p/${slug.join("/")}`, config.site.url).toString()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: postUrl,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const config = await getConfig();
  const post = await getPost(config, slug.join("/"));

  if (!post) notFound();

  const { frontmatter, content } = post;

  const dateStr = new Date(frontmatter.date + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Nav config={config} />
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem 7rem" }}>
        <header style={{ marginBottom: "3rem" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              letterSpacing: "0.02em",
              color: "var(--muted)",
              marginBottom: frontmatter.title ? "1rem" : 0,
              display: "flex",
              gap: "0.6rem",
              alignItems: "center",
            }}
          >
            <time dateTime={frontmatter.date}>{dateStr}</time>
            <span aria-hidden>·</span>
            <span style={{ color: "var(--accent)" }}>{frontmatter.domain}</span>
          </div>

          {frontmatter.title && (
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 600,
                fontSize: "2rem",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              {frontmatter.title}
            </h1>
          )}
        </header>

        {frontmatter.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={frontmatter.cover}
            alt={frontmatter.title ?? ""}
            style={{
              width: "100%",
              borderRadius: "4px",
              marginBottom: "2rem",
              display: "block",
            }}
          />
        )}

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {frontmatter.url && (
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <a
              href={frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              ↗ external link
            </a>
          </div>
        )}
      </main>
    </>
  );
}
