import { Truck, Globe, Sparkles, MessageCircle } from 'lucide-react';

const defaultItems = [
  { icon: Truck, headline: 'Same-Day Delivery', description: 'Order before 2pm for same-day delivery in major cities' },
  { icon: Globe, headline: 'Ship Worldwide', description: 'Order from anywhere, we deliver across Pakistan' },
  { icon: Sparkles, headline: 'Premium Quality', description: 'Hand-picked products with quality guarantee' },
  { icon: MessageCircle, headline: '24/7 Support', description: 'Reach us anytime via WhatsApp or email' },
];

export function TrustBar({
  items,
}: {
  items?: Array<{ headline?: string; description?: string }>;
}) {
  const merged = (items && items.length ? items : []).slice(0, 4);
  const finalItems =
    merged.length === 4
      ? merged.map((it, idx) => ({
          icon: defaultItems[idx].icon,
          headline: it.headline || defaultItems[idx].headline,
          description: it.description || defaultItems[idx].description,
        }))
      : defaultItems;

  return (
    <section className="border-y border-[var(--border)]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--border)]">
          {finalItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.headline} className="py-8 text-center px-4">
                <Icon
                  size={24}
                  className="mx-auto text-[var(--gold)]"
                  strokeWidth={1.5}
                />
                <h3 className="mt-3 font-heading text-base text-[var(--cream)]">
                  {item.headline}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
