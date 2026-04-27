"use client";

import Link from "next/link";
import {
  Article,
  Image as ImageIcon,
  SpeakerHigh,
  Video,
  ChatCenteredText,
  ArrowRight,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import type { Post } from "@/types/content";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const metaStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.75rem",
  letterSpacing: "0.02em",
  color: "var(--nav-muted)",
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
};

function Meta({ date, domain, tags }: { date: string; domain: string; tags?: string[] }) {
  return (
    <div style={metaStyle}>
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden>·</span>
      <span style={{ color: "var(--accent)" }}>{domain}</span>
      {tags && tags.length > 0 && (
        <>
          <span aria-hidden>·</span>
          <span>{tags.join(", ")}</span>
        </>
      )}
    </div>
  );
}

function TypeIcon({ type }: { type: string }) {
  const props = { weight: "regular" as const, color: "var(--accent)" };
  let icon;
  switch (type) {
    case "note":    icon = <ChatCenteredText {...props} />; break;
    case "writing": icon = <Article {...props} />; break;
    case "image":   icon = <ImageIcon {...props} />; break;
    case "video":   icon = <Video {...props} />; break;
    case "audio":   icon = <SpeakerHigh {...props} />; break;
    default:        icon = <Article {...props} />;
  }
  return (
    <div className="stream-icon-col">
      <div className="stream-icon-col-inner">{icon}</div>
    </div>
  );
}

const article: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  padding: "1.75rem 0",
  display: "flex",
  gap: "0.85rem",
};

const content: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

function NoteItem({ post }: { post: Post }) {
  const { frontmatter, content: html } = post;
  return (
    <article style={article}>
      <TypeIcon type="note" />
      <div style={content}>
        <Meta date={frontmatter.date} domain={frontmatter.domain} tags={frontmatter.tags} />
        <div
          className="prose"
          style={{ marginTop: "0.55rem" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}

function WritingItem({ post }: { post: Post }) {
  const { frontmatter, slug } = post;
  return (
    <article style={article}>
      <TypeIcon type="writing" />
      <div style={content}>
        <Meta date={frontmatter.date} domain={frontmatter.domain} tags={frontmatter.tags} />
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 400,
            fontSize: "1.1rem",
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
            margin: "0.35rem 0 0.45rem",
          }}
        >
          <Link href={`/p/${slug}`} style={{ color: "var(--text)", textDecoration: "none" }}>
            {frontmatter.title}
          </Link>
        </h2>
        <Link
          href={`/p/${slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.2rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--accent)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Read <ArrowRight size={11} weight="regular" />
        </Link>
      </div>
    </article>
  );
}

function ImageItem({ post }: { post: Post }) {
  const { frontmatter, slug } = post;
  return (
    <article style={article}>
      <TypeIcon type="image" />
      <div style={content}>
        {frontmatter.cover && (
          <Link href={`/p/${slug}`} style={{ display: "block", marginBottom: "0.65rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frontmatter.cover}
              alt={frontmatter.title ?? ""}
              style={{ width: "100%", borderRadius: "4px", display: "block" }}
            />
          </Link>
        )}
        {frontmatter.title && (
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.4rem" }}>
            {frontmatter.title}
          </p>
        )}
        <Meta date={frontmatter.date} domain={frontmatter.domain} tags={frontmatter.tags} />
      </div>
    </article>
  );
}

function MediaItem({ post }: { post: Post }) {
  const { frontmatter, slug } = post;
  const isExternal = !!frontmatter.url;

  return (
    <article style={article}>
      <TypeIcon type={frontmatter.type} />
      <div style={content}>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "var(--text)",
            marginBottom: "0.45rem",
          }}
        >
          {frontmatter.title ?? frontmatter.url}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Meta date={frontmatter.date} domain={frontmatter.domain} tags={frontmatter.tags} />
          {isExternal ? (
            <a
              href={frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--accent)",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Open <ArrowSquareOut size={11} weight="regular" />
            </a>
          ) : (
            <Link
              href={`/p/${slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--accent)",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Read <ArrowRight size={11} weight="regular" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function StreamItem({ post }: { post: Post }) {
  switch (post.frontmatter.type) {
    case "note":    return <NoteItem post={post} />;
    case "writing": return <WritingItem post={post} />;
    case "image":   return <ImageItem post={post} />;
    case "audio":
    case "video":   return <MediaItem post={post} />;
    default:        return <WritingItem post={post} />;
  }
}
