import { usePageMeta } from '../hooks/usePageMeta';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function OrdersPage() {
  usePageMeta('My Orders');
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-4">My Orders</h1>
          <p className="text-muted-foreground mb-6">Please login to view your orders</p>
          <Button onClick={() => navigate({ to: '/account' })}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders yet</p>
      </div>
    </div>
  );
}
