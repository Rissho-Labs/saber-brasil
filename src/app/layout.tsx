import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer, Navbar } from "@/components/navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saberbrasil.org.br"),
  title: {
    default: "SABER Brasil",
    template: "%s | SABER Brasil",
  },
  description:
    "Portal cívico de transparência e cidadania: acompanhe representantes, votações e indicadores públicos.",
  applicationName: "SABER Brasil",
  keywords: [
    "transparência",
    "cidadania",
    "dados abertos",
    "votações",
    "indicadores",
    "Brasil",
  ],
  authors: [{ name: "SABER Brasil" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "SABER Brasil",
    title: "SABER Brasil",
    description:
      "Transparência e cidadania em um só lugar. Consulte dados públicos de forma clara e acessível.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SABER Brasil",
    description:
      "Portal cívico de transparência: políticos, votações e indicadores públicos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <a
          href="#conteudo-principal"
          className="absolute top-0 left-0 z-[60] -translate-y-full rounded-md bg-card px-3 py-2 text-sm text-foreground shadow focus:translate-y-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Ir para o conteúdo
        </a>
        <Navbar />
        <div id="conteudo-principal" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
