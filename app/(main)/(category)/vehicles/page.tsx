import CategoryContainer from '@/components/category/container';

export default function VehiclesPage() {
  return (
    <CategoryContainer
      categoryId="32"                             
      title="Explore Vehicles"
      // subtitle="Luxury cars, SUVs, and more from verified sellers"
      defaultView="grid"
      perPage={12}
    />
  );
}
