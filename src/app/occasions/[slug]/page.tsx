import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OccasionSlugPage({ params }: PageProps) {
  const { slug } = await params
  redirect(`/occasions?occasion=${encodeURIComponent(slug)}`)
}
