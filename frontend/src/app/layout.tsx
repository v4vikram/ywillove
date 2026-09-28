import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/features/auth/session-context';
import { CartProvider } from '@/features/cart/cart-context';
import { site } from '@/lib/site';
import './globals.css';

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  // Without this, Open Graph image paths stay relative and crawlers can't resolve them.
  metadataBase: new URL(site.url),
  title: {
    default: "uwillove — Men's Streetwear, Made to Order in India",
    template: '%s · uwillove',
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: site.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider>
            <CartProvider>{children}</CartProvider>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
