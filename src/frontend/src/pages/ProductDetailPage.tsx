import { useParams, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetAllProducts, useGetVariantsByProduct, useGetProductReviews, useSubmitReview, useAddItemToCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import VariantSelector from '../components/product/VariantSelector';
import ReviewSection from '../components/product/ReviewSection';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: allProducts = [] } = useGetAllProducts();
  const product = allProducts.find(p => p.id === productId);
  const { data: variants = [] } = useGetVariantsByProduct(productId);
  const { data: reviews = [] } = useGetProductReviews(productId);
  const addToCart = useAddItemToCart();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  usePageMeta(product?.name || 'Product', product?.description);

  if (!product) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const price = selectedVariant ? Number(selectedVariant.price) / 100 : Number(product.price) / 100;
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate({ to: '/account' });
      return;
    }

    const variantId = selectedVariantId || variants[0]?.id;
    if (!variantId) {
      toast.error('Please select a variant');
      return;
    }

    try {
      await addToCart.mutateAsync({ variantId, quantity });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Product Image</span>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-warning text-warning' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <p className="text-3xl font-bold">${price.toFixed(2)}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {variants.length > 0 && (
            <>
              <Separator />
              <VariantSelector
                variants={variants}
                selectedVariantId={selectedVariantId}
                onSelectVariant={setSelectedVariantId}
              />
            </>
          )}

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="px-4">{quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="h-4 w-4" />
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <ReviewSection productId={productId} reviews={reviews} />
    </div>
  );
}
