import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<string, string> = {
  '1': 'Clothes',
  '2': 'Jewellery',
  '3': 'Fragrances'
};

export default function ProductCard({ product }: ProductCardProps) {
  const price = Number(product.price) / 100;
  const categoryLabel = categoryLabels[product.category] || 'Product';

  return (
    <Card className="overflow-hidden hover:shadow-soft transition-shadow group">
      <CardContent className="p-0">
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <div className="aspect-square relative overflow-hidden bg-muted">
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          </div>
        </Link>
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link to="/product/$productId" params={{ productId: product.id }} className="flex-1">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">${price.toFixed(2)}</span>
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
