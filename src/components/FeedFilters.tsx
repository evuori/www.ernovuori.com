import Link from "next/link";
import type { ContentType } from "@/types/content";

const TABS: { value: ContentType | "all"; label: string }[] = [
  { value: "all",     label: "all" },
  { value: "note",    label: "notes" },
  { value: "writing", label: "writing" },
  { value: "image",   label: "images" },
  { value: "video",   label: "video" },
  { value: "audio",   label: "audio" },
];

interface Props {
  activeType: ContentType | "all";
  basePath: string;
}

export default function FeedFilters({ activeType, basePath }: Props) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 0,
        marginBottom: "2rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {TABS.map(({ value, label }) => {
        const href = value === "all" ? basePath : `${basePath}?type=${value}`;
        const isActive = activeType === value;
        return (
          <Link
            key={value}
            href={href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.06em",
              color: isActive ? "var(--text)" : "var(--nav-muted)",
              textDecoration: "none",
              padding: "0.4rem 0.75rem",
              borderBottom: isActive
                ? "1px solid var(--text)"
                : "1px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
