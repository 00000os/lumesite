import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "./site-url";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Lume | Moda, presentes e personalizados",
  description:
    "Uma boutique completa de moda feminina, beleza, presentes e personalizados.",
  openGraph: {
    title: "Lume | Moda, presentes e personalizados",
    description:
      "Uma boutique completa de moda feminina, beleza, presentes e personalizados.",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 938, alt: "Lume Boutique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lume | Moda, presentes e personalizados",
    description:
      "Uma boutique completa de moda feminina, beleza, presentes e personalizados.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
