import type { Metadata } from 'next';
import { WalletProvider } from '@/context/WalletContext';
import RootLayoutClient from '@/components/RootLayoutClient';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Privilege - Access The Elite',
  description: 'Buy tokens to unlock exclusive access to influencers',
  icons: {
    icon: '/P.png',
    apple: '/P.png',
  },
  openGraph: {
    title: 'Privilege - Access The Elite',
    description: 'Buy tokens to unlock exclusive access to influencers',
    url: 'https://privilege.io',
    siteName: 'Privilege',
    images: [
      {
        url: '/P.png',
        width: 1200,
        height: 630,
        alt: 'Privilege Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privilege - Access The Elite',
    description: 'Buy tokens to unlock exclusive access to influencers',
    images: ['/P.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/P.png" />
        <link rel="apple-touch-icon" href="/P.png" />
        <meta property="og:image" content="/P.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body>
        <WalletProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </WalletProvider>
      </body>
    </html>
  );
}