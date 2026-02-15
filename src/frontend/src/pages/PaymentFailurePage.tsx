import { usePageMeta } from '../hooks/usePageMeta';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  usePageMeta('Payment Failed');
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't process your payment. Please try again or contact support if the problem persists.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate({ to: '/checkout' })}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: '/cart' })}>
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
