import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetCallerCartItems, useGetAllProducts } from '../hooks/useQueries';
import { useCreateCheckoutSession } from '../hooks/useStripeCheckout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { ShoppingItem } from '../backend';

export default function CheckoutPage() {
  usePageMeta('Checkout');
  const navigate = useNavigate();
  
  const { data: cartItems = [] } = useGetCallerCartItems();
  const { data: allProducts = [] } = useGetAllProducts();
  const createCheckout = useCreateCheckoutSession();
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const subtotal = cartItems.reduce((sum, item) => {
    const product = allProducts.find(p => p.id.startsWith(item.variantId.split('-')[0]));
    const price = product ? Number(product.price) / 100 : 0;
    return sum + price * Number(item.quantity);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'stripe') {
      try {
        const items: ShoppingItem[] = cartItems.map(item => {
          const product = allProducts.find(p => p.id.startsWith(item.variantId.split('-')[0]));
          return {
            productName: product?.name || 'Product',
            productDescription: product?.description || '',
            priceInCents: product ? product.price : BigInt(0),
            quantity: item.quantity,
            currency: 'USD'
          };
        });

        const session = await createCheckout.mutateAsync(items);
        if (!session?.url) throw new Error('Stripe session missing url');
        window.location.href = session.url;
      } catch (error) {
        toast.error('Failed to create checkout session');
        console.error(error);
      }
    } else {
      toast.info('Manual payment method selected. An admin will contact you to complete the order.');
      navigate({ to: '/orders' });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Add some products before checking out!</p>
          <Button onClick={() => navigate({ to: '/' })}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="cursor-pointer">Credit/Debit Card (Stripe)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">UPI (Manual/Offline)</Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="cursor-pointer">Net Banking (Manual/Offline)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                </div>
              </RadioGroup>
              {paymentMethod !== 'stripe' && (
                <p className="text-sm text-muted-foreground mt-4">
                  Note: Manual payment methods require admin verification. You will be contacted to complete the payment.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-20">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cartItems.map(item => {
                  const product = allProducts.find(p => p.id.startsWith(item.variantId.split('-')[0]));
                  const price = product ? Number(product.price) / 100 : 0;
                  return (
                    <div key={item.variantId} className="flex justify-between text-sm">
                      <span>{product?.name || 'Product'} × {Number(item.quantity)}</span>
                      <span>${(price * Number(item.quantity)).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Button type="submit" className="w-full" disabled={createCheckout.isPending}>
                {createCheckout.isPending ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
