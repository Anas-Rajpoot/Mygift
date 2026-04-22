import type { Metadata } from 'next';
import { AboutContent } from '@/components/about/about-content';

export const metadata: Metadata = {
  title: 'About Us — MyGift.pk',
  description:
    "Pakistan's premier gift house. Bridging the distance between the Pakistani diaspora and their loved ones back home, one gift at a time.",
};

export default function AboutPage() {
  return <AboutContent />;
}
