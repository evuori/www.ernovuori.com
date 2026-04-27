import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getConfig } from "@/lib/config";
import { getPosts } from "@/lib/github";
import Nav from "@/components/Nav";
import StreamItem from "@/components/StreamItem";
import FeedFilters from "@/components/FeedFilters";
import type { Domain, ContentType } from "@/types/content";

export const revalidate = 60;

const VALID_DOMAINS: Domain[] = ["tech", "art", "music", "personal"];

interface Props {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params;
  if (!VALID_DOMAINS.includes(domain as Domain)) return {};
  const config = await getConfig();
  return {
    title: domain,
    description: `${domain} posts on ${config.site.title}`,
  };
}

export async function generateStaticParams() {
  return VALID_DOMAINS.map((d) => ({ domain: d }));
}

export default async function DomainPage({ params, searchParams }: Props) {
  const { domain } = await params;

  if (!VALID_DOMAINS.includes(domain as Domain)) {
    notFound();
  }

  const { type } = await searchParams;
  const activeType = (typeof type === "string" ? type : "all") as ContentType | "all";

  const config = await getConfig();
  const allPosts = await getPosts(config);
  const domainPosts = allPosts.filter((p) => p.frontmatter.domain === domain);
  const posts =
    activeType === "all"
      ? domainPosts
      : domainPosts.filter((p) => p.frontmatter.type === activeType);

  return (
    <>
      <Nav config={config} activeDomain={domain as Domain} />
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem 7rem" }}>
        <FeedFilters activeType={activeType} basePath={`/${domain}`} />

        {posts.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            Nothing here yet.
          </p>
        ) : (
          posts.map((post) => <StreamItem key={post.slug} post={post} />)
        )}
      </main>
    </>
  );
}
