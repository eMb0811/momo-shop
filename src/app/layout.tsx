import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';

const syne = Syne({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-syne', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
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
