import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  { id: '1', name: 'Clothing', image: '/assets/generated/cat-clothing.dim_512x512.png' },
  { id: '2', name: 'Beauty & Skincare', image: '/assets/generated/cat-beauty.dim_512x512.png' },
  { id: '3', name: 'Health & Wellness', image: '/assets/generated/cat-wellness.dim_512x512.png' },
  { id: '4', name: 'Perfumes & Fragrances', image: '/assets/generated/cat-fragrance.dim_512x512.png' },
  { id: '5', name: 'Jewellery & Accessories', image: '/assets/generated/cat-jewellery.dim_512x512.png' },
  { id: '6', name: 'Lifestyle Products', image: '/assets/generated/cat-lifestyle.dim_512x512.png' }
];

export default function FeaturedCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to="/category/$categoryId"
          params={{ categoryId: category.id }}
        >
          <Card className="overflow-hidden hover:shadow-soft transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium text-sm">{category.name}</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
