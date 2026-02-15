import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import WhatsAppButton from '../support/WhatsAppButton';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'premium-marketplace');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/category/$categoryId" params={{ categoryId: '1' }} className="hover:text-foreground">Clothing</Link></li>
              <li><Link to="/category/$categoryId" params={{ categoryId: '2' }} className="hover:text-foreground">Beauty</Link></li>
              <li><Link to="/category/$categoryId" params={{ categoryId: '3' }} className="hover:text-foreground">Wellness</Link></li>
              <li><Link to="/category/$categoryId" params={{ categoryId: '4' }} className="hover:text-foreground">Fragrances</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/account" className="hover:text-foreground">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-foreground">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-foreground">Wishlist</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/support" className="hover:text-foreground">Contact Us</Link></li>
              <li><WhatsAppButton variant="link" /></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get in touch with us for any questions or support.
            </p>
            <WhatsAppButton />
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} Premium Marketplace. Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
