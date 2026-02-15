import { usePageMeta } from '../hooks/usePageMeta';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function WishlistPage() {
  usePageMeta('Wishlist');
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold mb-4">Wishlist</h1>
          <p className="text-muted-foreground mb-6">Please login to view your wishlist</p>
          <Button onClick={() => navigate({ to: '/account' })}>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your wishlist is empty</p>
      </div>
    </div>
  );
}
