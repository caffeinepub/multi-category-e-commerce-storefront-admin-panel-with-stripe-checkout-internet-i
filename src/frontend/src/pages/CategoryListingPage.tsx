import { useParams } from '@tanstack/react-router';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetProductsByCategory } from '../hooks/useQueries';
import ProductCard from '../components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const categoryNames: Record<string, string> = {
  '1': 'Clothes',
  '2': 'Jewellery',
  '3': 'Fragrances'
};

export default function CategoryListingPage() {
  const { categoryId } = useParams({ from: '/category/$categoryId' });
  const categoryName = categoryNames[categoryId] || 'Category';
  
  usePageMeta(categoryName, `Browse our ${categoryName.toLowerCase()} collection`);
  
  const { data: products = [], isLoading } = useGetProductsByCategory(categoryId);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
