import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminOrdersPage() {
  usePageMeta('Manage Orders');

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Orders</h1>
      <p className="text-muted-foreground">No orders yet.</p>
    </div>
  );
}
