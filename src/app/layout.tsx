import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReownProvider } from "@/lib/reown/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GitCaster - Build Your Developer Reputation",
  description: "Showcase your GitHub activity and onchain builder score to stand out to recruiters and employers",
  keywords: ["developer", "portfolio", "github", "web3", "hiring", "talent protocol", "blockchain"],
  authors: [{ name: "GitCaster" }],
  openGraph: {
    title: "GitCaster - Build Your Developer Reputation",
    description: "Showcase your GitHub activity and onchain builder score",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReownProvider>
          {children}
        </ReownProvider>
      </body>
    </html>
  );
}
