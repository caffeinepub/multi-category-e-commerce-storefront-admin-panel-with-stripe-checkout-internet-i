import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Package, FolderTree, ShoppingBag, Users, MessageSquare, CreditCard } from 'lucide-react';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-muted/30 p-6">
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="space-y-2">
            <Link to="/admin">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link to="/admin/categories">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FolderTree className="h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Link to="/admin/support">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Support Inbox
              </Button>
            </Link>
            <Link to="/admin/stripe">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <CreditCard className="h-4 w-4" />
                Stripe Setup
              </Button>
            </Link>
          </nav>
          <div className="mt-8">
            <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
              Back to Store
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </AdminRouteGuard>
  );
}
