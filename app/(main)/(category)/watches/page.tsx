import Category from '@/components/Category';

export default function WatchesPage() {
  return (
    <Category
      categoryId="21"
      title="Explore Watches"
      // subtitle="Iconic luxury timepieces from trusted sellers"
      defaultView="grid"
      perPage={12}
    />
  );
}
