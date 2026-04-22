const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export type HomeHeroSlideSetting = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type HomepageSettings = {
  heroSlides?: HomeHeroSlideSetting[];
  topSaleHeading?: string;
  topSaleSubtitle?: string;
  topSaleProductSlugs?: string[];
  newInTitle?: string;
  newInSubtitle?: string;

  promoStripItems?: string[];
  marqueeItems?: string[];

  trustBarItems?: Array<{
    headline?: string;
    description?: string;
  }>;

  diaspora?: {
    eyebrow?: string;
    title?: string;
    body?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };

  giftlab?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };

  occasionsGrid?: Array<{
    name?: string;
    count?: number;
    href?: string;
    bg?: string;
  }>;
};

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  if (!WP_URL) return null;

  try {
    const res = await fetch(`${WP_URL}/wp-json/mygift/v1/homepage-settings`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as HomepageSettings;
    return data;
  } catch {
    return null;
  }
}

