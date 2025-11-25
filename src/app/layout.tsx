import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GitCaster - Showcase Your GitHub on the Blockchain',
  description: 'Connect your GitHub profile with blockchain technology using Talent Protocol',
  keywords: ['github', 'blockchain', 'web3', 'developer', 'talent protocol'],
  authors: [{ name: 'GitCaster Team' }],
  openGraph: {
    title: 'GitCaster',
    description: 'Showcase Your GitHub on the Blockchain',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
