import { getConfig } from "@/lib/config";
import { getPosts } from "@/lib/github";
import Nav from "@/components/Nav";
import StreamItem from "@/components/StreamItem";
import FeedFilters from "@/components/FeedFilters";
import type { ContentType } from "@/types/content";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StreamPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const activeType = (typeof type === "string" ? type : "all") as ContentType | "all";

  const config = await getConfig();
  const allPosts = await getPosts(config);
  const posts =
    activeType === "all"
      ? allPosts
      : allPosts.filter((p) => p.frontmatter.type === activeType);

  return (
    <>
      <Nav config={config} />
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem 7rem" }}>
        <FeedFilters activeType={activeType} basePath="/" />
        {posts.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            Nothing published yet.
          </p>
        ) : (
          posts.map((post) => <StreamItem key={post.slug} post={post} />)
        )}
      </main>
    </>
  );
}
