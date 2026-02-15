import { usePageMeta } from '../hooks/usePageMeta';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import LoginButton from '../components/auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { User, Package, Heart, Shield } from 'lucide-react';

export default function AccountPage() {
  usePageMeta('My Account');
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="max-w-md mx-auto text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-3xl font-bold mb-4">My Account</h1>
          <p className="text-muted-foreground mb-6">Please login to access your account</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Welcome back, {userProfile?.name || 'User'}!</p>
          </div>
          <LoginButton />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-soft transition-shadow" onClick={() => navigate({ to: '/orders' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track and manage your orders</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-soft transition-shadow" onClick={() => navigate({ to: '/wishlist' })}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View your saved items</p>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="cursor-pointer hover:shadow-soft transition-shadow" onClick={() => navigate({ to: '/admin' })}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Manage store settings and products</p>
              </CardContent>
            </Card>
          )}
        </div>

        {userProfile && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">{userProfile.name}</p>
              </div>
              {userProfile.email && (
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              )}
              {userProfile.phone && (
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
