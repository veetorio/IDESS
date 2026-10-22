import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Instituto Ettore Sebastianini",
    default: "Instituto Ettore Sebastianini",
  },
  icons : {
    icon : "/logo.png"
  },
  description:
    "Instituto Social e Sustentável dedicado a promover eventos, programas sociais e iniciativas de sustentabilidade.",
  openGraph: {
    title: "Instituto Ettore Sebastianini",
    description: "Instituto Social e Sustentável",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base text-neutral-900">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
