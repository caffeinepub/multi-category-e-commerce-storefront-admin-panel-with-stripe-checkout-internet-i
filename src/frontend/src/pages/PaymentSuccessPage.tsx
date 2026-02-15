import { useEffect } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  usePageMeta('Payment Successful');
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate({ to: '/orders' })}>
            View Orders
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
