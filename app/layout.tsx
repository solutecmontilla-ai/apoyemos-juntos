import type { Metadata } from "next";
import { League_Spartan, Pathway_Gothic_One, Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

const leagueSpartan = League_Spartan({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const pathwayGothicOne = Pathway_Gothic_One({
  variable: "--font-subheading",
  subsets: ["latin"],
  weight: "400",
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = "https://www.apoyemosjuntos.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apoyemos Juntos | Sorteos benéficos",
    template: "%s | Apoyemos Juntos",
  },
  description:
    "Participá en los sorteos benéficos de Apoyemos Juntos: comprá en negocios afiliados, subí tu factura y ganá premios donados por nuestros patrocinadores.",
  openGraph: {
    title: "Apoyemos Juntos | Sorteos benéficos",
    description:
      "Comprá en negocios afiliados, subí tu factura y ganá premios donados por nuestros patrocinadores.",
    url: siteUrl,
    siteName: "Apoyemos Juntos",
    locale: "es_CR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${leagueSpartan.variable} ${pathwayGothicOne.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
