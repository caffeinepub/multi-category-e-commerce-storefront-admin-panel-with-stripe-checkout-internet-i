import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import CategoryListingPage from './pages/CategoryListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import AccountPage from './pages/AccountPage';
import SupportPage from './pages/SupportPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSupportInboxPage from './pages/admin/AdminSupportInboxPage';
import StripeSetupPanel from './pages/admin/StripeSetupPanel';

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$categoryId',
  component: CategoryListingPage
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: WishlistPage
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrdersPage
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage
});

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: SupportPage
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboardPage
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: AdminProductsPage
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/categories',
  component: AdminCategoriesPage
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/users',
  component: AdminUsersPage
});

const adminSupportRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/support',
  component: AdminSupportInboxPage
});

const adminStripeRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/stripe',
  component: StripeSetupPanel
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  categoryRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  wishlistRoute,
  ordersRoute,
  accountRoute,
  supportRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminCategoriesRoute,
    adminOrdersRoute,
    adminUsersRoute,
    adminSupportRoute,
    adminStripeRoute
  ])
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
