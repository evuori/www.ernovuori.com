import type { Metadata } from "next";
import { Lora, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { getConfig } from "@/lib/config";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: {
      default: config.site.title,
      template: `%s — ${config.site.title}`,
    },
    description: config.site.description,
    metadataBase: config.site.url ? new URL(config.site.url) : undefined,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
