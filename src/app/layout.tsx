import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import StoreProvider from '@/lib/store/StoreProvider';
import QueryProvider from '@/lib/query/QueryProvider';
import '@/styles/main.scss';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NFT Marketplace | Starsoft',
    template: '%s | NFT Marketplace',
  },
  description: 'Descubra, colecione e negocie NFTs únicos no nosso marketplace.',
  keywords: ['NFT', 'marketplace', 'digital art', 'crypto', 'blockchain', 'Starsoft'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'NFT Marketplace',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body>
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
