import Category from '@/components/Category';

export default function VehiclesPage() {
  return (
    <Category
      categoryId="32"                             
      title="Explore Vehicles"
      subtitle="Luxury cars, SUVs, and more from verified sellers"
      defaultView="grid"
      perPage={12}
    />
  );
}
