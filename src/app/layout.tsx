import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const syne = localFont({
  src: './fonts/Syne-Variable.woff2',
  weight: '400 800',
  variable: '--font-syne',
  display: 'swap',
});

const jakarta = localFont({
  src: './fonts/PlusJakartaSans-Variable.woff2',
  weight: '400 800',
  variable: '--font-jakarta',
  display: 'swap',
});

const grotesk = localFont({
  src: './fonts/SpaceGrotesk-Variable.woff2',
  weight: '400 700',
  variable: '--font-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://momoshop.sn'),
  title: {
    default: 'momoShop | T-Shirts Coupe Ajustée & Coton Mercerisé',
    template: '%s | momoShop',
  },
  description:
    'momoShop — boutique urbaine de t-shirts à col rond structuré et coupe ajustée en coton mercerisé. Commande directe sur WhatsApp.',
  icons: { icon: '/images/logo.png' },
};

export const viewport: Viewport = {
  themeColor: '#f6f4ee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${jakarta.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
