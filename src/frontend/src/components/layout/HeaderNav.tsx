import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, ShoppingCart, Heart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useGetCallerCartItems } from '../../hooks/useQueries';
import BrandMark from '../branding/BrandMark';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const categories = [
  { id: '1', name: 'Clothing' },
  { id: '2', name: 'Beauty' },
  { id: '3', name: 'Wellness' },
  { id: '4', name: 'Fragrances' },
  { id: '5', name: 'Jewellery' },
  { id: '6', name: 'Lifestyle' }
];

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { data: cartItems = [] } = useGetCallerCartItems();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <BrandMark />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/category/$categoryId"
                params={{ categoryId: cat.id }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/wishlist' })}
            className="relative"
          >
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/cart' })}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/account' })}
          >
            <User className="h-5 w-5" />
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to="/category/$categoryId"
                    params={{ categoryId: cat.id }}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
