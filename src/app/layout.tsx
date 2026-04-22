import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Cinzel, DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Providers } from "@/components/providers";

// Body/UI font
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

// Display/Hero font
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

// Labels/Nav caps font
const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-accent",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "MYGIFT.PK | Send Gifts to Pakistan",
    template: "%s | MYGIFT.PK",
  },
  description: "Pakistan's premium gifting destination. Send curated gift hampers, flowers, cakes, clothing & watches to your loved ones in Pakistan. Same-day delivery across major cities.",
  keywords: ["gifts pakistan", "send gifts to pakistan", "online gifts", "gift hampers", "flowers pakistan", "cakes delivery", "mygift.pk"],
  authors: [{ name: "MyGift.pk" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MYGIFT.PK",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} ${cinzel.variable}`}>
      <body className="font-sans antialiased bg-[var(--ink)] text-[var(--cream)]" suppressHydrationWarning>
        <Providers>
          {isAdminRoute ? (
            <main className="min-h-screen">{children}</main>
          ) : (
            <>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 pt-14 lg:pt-[104px]">{children}</main>
                <Footer />
              </div>
              <CartDrawer />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
