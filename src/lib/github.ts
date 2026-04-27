import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { LoudlyConfig } from "@/types/config";
import type { Post, Frontmatter } from "@/types/content";

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return result.toString();
}

const GITHUB_API = "https://api.github.com";

function headers(): HeadersInit {
  const h: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    h["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

interface GitHubTreeItem {
  path: string;
  type: string;
  sha: string;
  url: string;
}

interface GitHubTree {
  tree: GitHubTreeItem[];
}

interface GitHubBlob {
  content: string;
  encoding: string;
}

async function fetchTree(config: LoudlyConfig): Promise<GitHubTreeItem[]> {
  const { repo, branch, path } = config.content;

  if (repo === "username/vault") {
    // Vault not configured — return empty set so the site renders without crashing
    return [];
  }

  const url = `${GITHUB_API}/repos/${repo}/git/trees/${branch}?recursive=1`;

  const res = await fetch(url, {
    headers: headers(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.warn(`GitHub API error ${res.status}: ${url}`);
    return [];
  }

  const data: GitHubTree = await res.json();
  const contentPath = path.replace(/^\//, "");

  return data.tree.filter(
    (item) =>
      item.type === "blob" &&
      item.path.startsWith(contentPath) &&
      item.path.endsWith(".md")
  );
}

async function fetchBlob(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: headers(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GitHub blob fetch error ${res.status}: ${url}`);
  }

  const blob: GitHubBlob = await res.json();
  return Buffer.from(blob.content, blob.encoding as BufferEncoding).toString(
    "utf-8"
  );
}

function extractExcerpt(content: string): string {
  const plain = content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
  return plain.slice(0, 160);
}

function slugFromPath(filePath: string, contentPath: string): string {
  const base = contentPath.replace(/^\//, "");
  return filePath
    .replace(base + "/", "")
    .replace(/\.md$/, "");
}

export async function getPosts(config: LoudlyConfig): Promise<Post[]> {
  const tree = await fetchTree(config);

  const posts = await Promise.all(
    tree.map(async (item) => {
      const raw = await fetchBlob(item.url);
      const { data, content: rawContent } = matter(raw);
      // gray-matter parses YAML dates into JS Date objects — normalize to YYYY-MM-DD string
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split("T")[0];
      }
      const frontmatter = data as Frontmatter;

      if (frontmatter.status !== "public") return null;

      const slug = slugFromPath(item.path, config.content.path);
      const html = await markdownToHtml(rawContent);

      return {
        slug,
        frontmatter,
        content: html,
        excerpt: frontmatter.og?.description ?? extractExcerpt(rawContent),
      } satisfies Post;
    })
  );

  return posts
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export async function getPost(
  config: LoudlyConfig,
  slug: string
): Promise<Post | null> {
  const all = await getPosts(config);
  return all.find((p) => p.slug === slug) ?? null;
}
