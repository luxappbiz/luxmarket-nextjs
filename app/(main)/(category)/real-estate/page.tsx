import Category from '@/components/Category';

export default function RealEstatePage() {
  return (
    <Category
      categoryId="33"
      title="Explore Real Estate"
      subtitle="Exclusive properties, penthouses, and estates"
      defaultView="grid"
      perPage={12}
    />
  );
}
