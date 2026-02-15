import { usePageMeta } from '../hooks/usePageMeta';
import { useGetCallerCartItems, useGetAllProducts, useGetVariantsByProduct, useUpdateCartItem, useRemoveItemFromCart } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export default function CartPage() {
  usePageMeta('Shopping Cart');
  const navigate = useNavigate();
  
  const { data: cartItems = [], isLoading } = useGetCallerCartItems();
  const { data: allProducts = [] } = useGetAllProducts();
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveItemFromCart();

  const cartWithDetails = cartItems.map(item => {
    const allVariants = allProducts.flatMap(p => {
      // We need to fetch variants for each product, but for simplicity we'll just show basic info
      return [];
    });
    return {
      ...item,
      product: allProducts.find(p => p.id.startsWith(item.variantId.split('-')[0]))
    };
  });

  const subtotal = cartWithDetails.reduce((sum, item) => {
    const price = item.product ? Number(item.product.price) / 100 : 0;
    return sum + price * Number(item.quantity);
  }, 0);

  const handleUpdateQuantity = async (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCart.mutateAsync({ variantId, quantity: newQuantity });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (variantId: string) => {
    try {
      await removeFromCart.mutateAsync(variantId);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Button onClick={() => navigate({ to: '/' })}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartWithDetails.map((item) => (
            <div key={item.variantId} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 bg-muted rounded flex-shrink-0" />
              
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product?.name || 'Product'}</h3>
                <p className="text-sm text-muted-foreground mb-2">Variant: {item.variantId}</p>
                <p className="font-semibold">
                  ${item.product ? (Number(item.product.price) / 100).toFixed(2) : '0.00'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.variantId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.variantId, Number(item.quantity) - 1)}
                  >
                    -
                  </Button>
                  <span className="px-3">{Number(item.quantity)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.variantId, Number(item.quantity) + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button className="w-full" onClick={() => navigate({ to: '/checkout' })}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
