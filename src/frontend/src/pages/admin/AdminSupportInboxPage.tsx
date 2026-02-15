import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminSupportInboxPage() {
  usePageMeta('Support Inbox');

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Support Inbox</h1>
      <p className="text-muted-foreground">No support messages yet.</p>
    </div>
  );
}
