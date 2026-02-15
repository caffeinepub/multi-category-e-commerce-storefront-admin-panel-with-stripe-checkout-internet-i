import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useIsStripeConfigured } from '../../hooks/useQueries';
import { useActor } from '../../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function StripeSetupPanel() {
  usePageMeta('Stripe Setup');
  
  const { actor } = useActor();
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    setSaving(true);
    try {
      if (!actor) throw new Error('Actor not available');
      
      const allowedCountries = countries.split(',').map(c => c.trim()).filter(Boolean);
      await actor.setStripeConfiguration({
        secretKey,
        allowedCountries
      });
      
      toast.success('Stripe configured successfully!');
      setSecretKey('');
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Stripe Configuration</h1>

      {isConfigured ? (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Stripe is already configured and ready to accept payments.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Stripe is not configured. Please set up your Stripe credentials to enable online payments.
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Stripe Settings</CardTitle>
          <CardDescription>
            Configure your Stripe account to accept online payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="secretKey">Stripe Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="sk_test_..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your Stripe secret key (starts with sk_test_ or sk_live_)
              </p>
            </div>
            <div>
              <Label htmlFor="countries">Allowed Countries</Label>
              <Input
                id="countries"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
                placeholder="US,CA,GB"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated list of country codes (e.g., US,CA,GB)
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : isConfigured ? 'Update Configuration' : 'Configure Stripe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
