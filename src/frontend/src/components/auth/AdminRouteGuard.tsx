import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access the admin panel. Please contact an administrator if you believe this is an error.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: '/' })}
          >
            Return to Home
          </Button>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
