import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { themeBootScript } from "@/lib/theme";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "HCM Master Suite — Great people. Less paperwork.",
    template: "%s · HCM Master Suite",
  },
  description:
    "Bring your people, attendance, leave, payroll and talent together. A connected HR workspace with a role-aware AI copilot, built for teams in Pakistan.",
  applicationName: "HCM Master Suite",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, {
      url: "/favicon.ico",
      sizes: "32x32",
    }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "HCM Master Suite",
    title: "Great people. Less paperwork. More possibility.",
    description:
      "Your people, payroll and AI copilot. All working beautifully, as one.",
    images: [{
      url: "/social-preview.png",
      width: 1200,
      height: 630,
      alt: "HCM Master Suite — Great people. Less paperwork. More possibility.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HCM Master Suite — Make room for your people.",
    description: "One connected workspace for people, payroll and AI.",
    images: ["/social-preview.png"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#214e43",
};
export default function RootLayout(
  { children }: { children: React.ReactNode },
) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
