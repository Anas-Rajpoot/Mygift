import { wooCommerce } from '@/lib/woocommerce';
import { HeroSlider } from '@/components/home/hero-slider';
import { Marquee } from '@/components/home/marquee';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { OccasionsGrid } from '@/components/home/occasions-grid';
import { Bestsellers } from '@/components/home/bestsellers';
import { DiasporaSection } from '@/components/home/diaspora-section';
import { GiftLabSection } from '@/components/home/giftlab-section';
import { TrustBar } from '@/components/home/trust-bar';
import { ProductCarousel } from '@/components/home/product-carousel';
import { TopSaleSection } from '@/components/home/top-sale-section';
import { ImageBannerWall } from '@/components/home/image-banner-wall';
import { getPageBySlug } from '@/lib/graphql';
import { getHomepageSettings } from '@/lib/homepage-settings';
import { readDb } from '@/lib/db';

type HeroSlide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  backgroundImage?: { src: string; alt?: string };
};

type HomeImageBanner = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  style?: 'full' | 'card' | 'split';
  textAlign?: 'left' | 'center';
  overlayOpacity?: number;
  isActive?: boolean;
  sortOrder?: number;
};

export default async function HomePage() {
  const siteSettings = readDb<{
    homeLinks?: {
      shopAllLink?: string;
      saleLink?: string;
      sendToPakistanLink?: string;
      bestsellersLink?: string;
      categoryLinkTemplate?: string;
      occasionLinkTemplate?: string;
    };
  }>('site-settings')[0] || {};
  const homeLinks = siteSettings.homeLinks || {};

  let featuredProducts: Awaited<ReturnType<typeof wooCommerce.products.list>> = [];
  let newArrivals: Awaited<ReturnType<typeof wooCommerce.products.list>> = [];
  let topCategories: Awaited<ReturnType<typeof wooCommerce.categories.list>> = [];

  try {
    featuredProducts = await wooCommerce.products.list({ featured: true, per_page: 12 });
    newArrivals = await wooCommerce.products.list({
      orderby: 'date',
      order: 'desc',
      per_page: 12,
      status: 'publish',
    });

    const allCategories = await wooCommerce.categories.list({ per_page: 100, hide_empty: false });
    topCategories = allCategories.filter((c) => c.parent === 0);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  const stripHtml = (html: string) => {
    const text = (html || '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return text;
  };

  const parseCta = (content: string): { label?: string; href?: string } => {
    const text = stripHtml(content || '');
    const match = text.match(/CTA:\s*(.*?)\s*\|\s*([^\n]+)/i);
    if (!match) return {};
    return { label: match[1]?.trim(), href: match[2]?.trim() };
  };

  const lines = (content: string) =>
    stripHtml(content || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

  const parseHeroFromWpPage = (
    page: Awaited<ReturnType<typeof getPageBySlug>>,
    fallback: { eyebrow: string; title: string; subtitle: string; primaryCta: { label: string; href: string } }
  ): HeroSlide | null => {
    if (!page) return null;

    const ln = lines(page.content || '');
    const eyebrow = ln[0] || fallback.eyebrow;
    const subtitle = ln[1] || fallback.subtitle;
    const cta = parseCta(page.content || '');

    return {
      eyebrow,
      title: page.title || fallback.title,
      subtitle,
      primaryCta: {
        label: cta.label || fallback.primaryCta.label,
        href: cta.href || fallback.primaryCta.href,
      },
      backgroundImage: page.featuredImage?.node?.sourceUrl
        ? { src: page.featuredImage.node.sourceUrl, alt: page.title }
        : undefined,
    };
  };

  const findSlugByKeywords = (keywords: string[]) => {
    const match = topCategories.find((c) =>
      keywords.some((k) => c.name.toLowerCase().includes(k.toLowerCase()))
    );
    return match?.slug;
  };

  const giftsSlug = findSlugByKeywords(['gifts', 'hampers', 'gift']);

  const bg1 = newArrivals?.[0]?.images?.[0]?.src;
  const bg2 = featuredProducts?.[0]?.images?.[0]?.src;
  const bg3 = featuredProducts?.[1]?.images?.[0]?.src;

  const fallbackSlides: HeroSlide[] = [
    {
      eyebrow: 'New Arrivals',
      title: 'Fresh Gift Drops',
      subtitle: 'New season picks curated for fast ordering and premium delivery.',
      primaryCta: { label: 'Shop New In', href: homeLinks.shopAllLink || '/shop?sort=newest' },
      backgroundImage: bg1 ? { src: bg1, alt: 'New arrivals background' } : undefined,
    },
    {
      eyebrow: 'Gifts & Hampers',
      title: 'Ready-to-Gift Collections',
      subtitle: 'Beautiful bundles for every occasion—send love home in minutes.',
      primaryCta: {
        label: 'Explore Hampers',
        href: giftsSlug
          ? (homeLinks.categoryLinkTemplate || '/shop?category={slug}').replace('{slug}', encodeURIComponent(giftsSlug))
          : homeLinks.shopAllLink || '/shop',
      },
      backgroundImage: bg2 ? { src: bg2, alt: 'Gifts background' } : undefined,
    },
    {
      eyebrow: 'Bestsellers',
      title: 'Most Loved by Customers',
      subtitle: 'Top picks that sell out—discover your next favorite gift.',
      primaryCta: { label: 'Shop Bestsellers', href: homeLinks.bestsellersLink || '/shop?best_sellers=true' },
      backgroundImage: bg3 ? { src: bg3, alt: 'Bestsellers background' } : undefined,
    },
  ];

  // Home page banners (admin editable via WordPress pages):
  // - Create WP pages with slugs: home-banner-1, home-banner-2, home-banner-3
  // - Featured image is used as the slide background
  // - Page content convention (stripped text):
  //    line1 => eyebrow
  //    line2 => subtitle
  //    anywhere: "CTA: <label> | <href>"
  const [banner1, banner2, banner3, dashboardSettings] = await Promise.all([
    getPageBySlug('home-banner-1'),
    getPageBySlug('home-banner-2'),
    getPageBySlug('home-banner-3'),
    getHomepageSettings(),
  ]);

  const slides: HeroSlide[] = [
    parseHeroFromWpPage(banner1, fallbackSlides[0]),
    parseHeroFromWpPage(banner2, fallbackSlides[1]),
    parseHeroFromWpPage(banner3, fallbackSlides[2]),
  ].filter((s): s is HeroSlide => Boolean(s));

  const safeSlides = slides.length === 3 ? slides : fallbackSlides;

  const dashboardSlides = (dashboardSettings?.heroSlides || [])
    .slice(0, 3)
    .map((s, idx): HeroSlide => ({
      eyebrow: s.eyebrow || fallbackSlides[idx]?.eyebrow || 'Featured',
      title: s.title || fallbackSlides[idx]?.title || 'Featured Collection',
      subtitle: s.subtitle || fallbackSlides[idx]?.subtitle || '',
      primaryCta: {
        label: s.ctaLabel || fallbackSlides[idx]?.primaryCta.label || 'Shop now',
        href: s.ctaHref || fallbackSlides[idx]?.primaryCta.href || '/shop',
      },
      backgroundImage: s.imageUrl
        ? { src: s.imageUrl, alt: s.imageAlt || s.title || 'Hero slide' }
        : fallbackSlides[idx]?.backgroundImage,
    }));

  const finalSlides =
    dashboardSlides.length === 3 && dashboardSlides.every((s) => s.title)
      ? dashboardSlides
      : safeSlides;

  const adminBanners = readDb<{
    type?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    imageUrl?: string;
    imageOnly?: boolean;
    objectFit?: 'cover' | 'contain';
    objectPosition?: string;
    overlayOpacity?: number;
    isActive?: boolean;
    sortOrder?: number;
  }>('banners')
    .filter((b) => b.type === 'hero' && b.isActive)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 3)
    .map((b) => ({
      eyebrow: 'Featured',
      title: b.imageOnly ? '' : b.title || 'Featured Collection',
      subtitle: b.imageOnly ? '' : b.subtitle || '',
      primaryCta: { label: b.ctaText || 'Shop now', href: b.ctaLink || '/shop' },
      backgroundImage: b.imageUrl ? { src: b.imageUrl, alt: b.title || 'Hero banner' } : undefined,
      imageOnly: Boolean(b.imageOnly),
      objectFit: b.objectFit || 'cover',
      objectPosition: b.objectPosition || 'center',
      overlayOpacity: typeof b.overlayOpacity === 'number' ? b.overlayOpacity : 12,
    }));

  const finalSlidesWithAdmin = adminBanners.length ? adminBanners : finalSlides;
  const homeImageBanners = readDb<HomeImageBanner>('home-image-banners');
  const normalizedOccasionCards = (dashboardSettings?.occasionsGrid || []).map((item) => {
    const derivedSlug = String(item?.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const linkTemplate = homeLinks.occasionLinkTemplate || '/occasions?occasion={slug}'
    return {
      ...item,
      href: linkTemplate.replace('{slug}', encodeURIComponent(derivedSlug)),
    }
  })

  // Top sale section (admin editable via WP page: home-top-sale)
  const topSalePage = await getPageBySlug('home-top-sale');
  const topSaleLines = lines(topSalePage?.content || '');
  const topSaleSubtitle = topSaleLines[0] || undefined;

  const productSlugsText =
    topSaleLines.find((l) => /^products\\s*:/i.test(l)) ||
    topSaleLines.find((l) => /^product-slugs\\s*:/i.test(l)) ||
    '';

  const productSlugs = productSlugsText
    .replace(/^products\\s*:/i, '')
    .replace(/^product-slugs\\s*:/i, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  let topSaleProducts: typeof featuredProducts = [];
  const topSaleSlugOverride = dashboardSettings?.topSaleProductSlugs || [];

  if (topSaleSlugOverride.length) {
    const resolved = await Promise.all(
      topSaleSlugOverride.map(async (slug) => wooCommerce.products.getBySlug(slug))
    );
    topSaleProducts = resolved.filter(
      (p): p is (typeof featuredProducts)[number] => Boolean(p)
    );
  } else if (productSlugs.length) {
    const resolved = await Promise.all(productSlugs.map(async (slug) => wooCommerce.products.getBySlug(slug)));
    topSaleProducts = resolved.filter(
      (p): p is (typeof featuredProducts)[number] => Boolean(p)
    );
  }

  if (!topSaleProducts.length) {
    topSaleProducts = await wooCommerce.products.list({
      on_sale: true,
      per_page: 8,
      orderby: 'date',
      order: 'desc',
      status: 'publish',
    });
  }

  return (
    <>
      <HeroSlider
        slides={finalSlidesWithAdmin}
        promoItems={dashboardSettings?.promoStripItems}
        secondaryCtaHref={homeLinks.sendToPakistanLink || '/send-to-pakistan'}
        secondaryCtaLabel="Send to Pakistan"
      />
      <ImageBannerWall banners={homeImageBanners} />
      <Marquee items={dashboardSettings?.marqueeItems} />

      <ProductCarousel
        title={dashboardSettings?.newInTitle || 'New In'}
        subtitle={dashboardSettings?.newInSubtitle || 'Latest Arrivals'}
        products={newArrivals}
      />

      <TopSaleSection
        heading={dashboardSettings?.topSaleHeading || topSalePage?.title || 'Limited Deals'}
        subtitle={dashboardSettings?.topSaleSubtitle || topSaleSubtitle}
        products={topSaleProducts}
        saleHref={homeLinks.saleLink || '/shop?on_sale=true'}
      />

      <CategoryShowcase categoryLinkTemplate={homeLinks.categoryLinkTemplate || '/shop?category={slug}'} />
      <OccasionsGrid occasions={normalizedOccasionCards} occasionLinkTemplate={homeLinks.occasionLinkTemplate || '/occasions?occasion={slug}'} />
      <Bestsellers products={featuredProducts} />
      <DiasporaSection
        eyebrow={dashboardSettings?.diaspora?.eyebrow}
        title={dashboardSettings?.diaspora?.title}
        body={dashboardSettings?.diaspora?.body}
        ctaLabel={dashboardSettings?.diaspora?.ctaLabel}
        ctaHref={dashboardSettings?.diaspora?.ctaHref}
      />
      <GiftLabSection
        eyebrow={dashboardSettings?.giftlab?.eyebrow}
        title={dashboardSettings?.giftlab?.title}
        description={dashboardSettings?.giftlab?.description}
        ctaLabel={dashboardSettings?.giftlab?.ctaLabel}
        ctaHref={dashboardSettings?.giftlab?.ctaHref}
      />
      <TrustBar items={dashboardSettings?.trustBarItems} />
    </>
  );
}
