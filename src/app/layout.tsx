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
  const siteUrl = config.site.url;
  const ogImage = config.site.defaultOgImage
    ? siteUrl
      ? new URL(config.site.defaultOgImage, siteUrl).toString()
      : config.site.defaultOgImage
    : undefined;

  return {
    title: {
      default: config.site.title,
      template: `%s — ${config.site.title}`,
    },
    description: config.site.description,
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    openGraph: {
      title: config.site.title,
      description: config.site.description,
      url: siteUrl,
      siteName: config.site.title,
      type: "website",
      locale: "en_US",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();
  const logoUrl =
    config.site.logo && config.site.url
      ? new URL(config.site.logo, config.site.url).toString()
      : undefined;

  return (
    <html
      lang="en"
      className={`${lora.variable} ${jetbrainsMono.variable} ${dmSans.variable}`}
    >
      <head>
        {logoUrl && <meta property="og:logo" content={logoUrl} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
