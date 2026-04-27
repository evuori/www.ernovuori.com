import Link from "next/link";
import type { LoudlyConfig } from "@/types/config";
import type { Domain } from "@/types/content";

const DOMAINS: { label: string; value: Domain }[] = [
  { label: "tech", value: "tech" },
  { label: "art", value: "art" },
  { label: "music", value: "music" },
  { label: "personal", value: "personal" },
];

interface NavProps {
  config: LoudlyConfig;
  activeDomain?: Domain | null;
}

export default function Nav({ config, activeDomain }: NavProps) {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        marginBottom: "3.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "40rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/site-logo-icon.png"
            alt={config.site.title}
            className="logo-icon"
            style={{ height: "2rem", width: "auto" }}
          />
        </Link>

        <nav style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          {DOMAINS.map((d) => {
            const isActive = activeDomain === d.value;
            return (
              <Link
                key={d.value}
                href={`/${d.value}`}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.88rem",
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  color: isActive ? "var(--accent)" : "var(--nav-muted)",
                  fontWeight: isActive ? "500" : "400",
                  transition: "color 0.12s",
                }}
              >
                {d.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
