import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useAssignUserRole } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserRole } from '../../backend';

export default function AdminUsersPage() {
  usePageMeta('Manage Users');
  
  const assignRole = useAssignUserRole();
  const [principal, setPrincipal] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!principal) {
      toast.error('Please enter a principal ID');
      return;
    }

    try {
      await assignRole.mutateAsync({ user: principal, role });
      toast.success('Role assigned successfully!');
      setPrincipal('');
    } catch (error) {
      toast.error('Failed to assign role');
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">User Management</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Assign User Role</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="principal">User Principal ID</Label>
              <Input
                id="principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="Enter principal ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.admin}>Admin</SelectItem>
                  <SelectItem value={UserRole.user}>User</SelectItem>
                  <SelectItem value={UserRole.guest}>Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={assignRole.isPending}>
              {assignRole.isPending ? 'Assigning...' : 'Assign Role'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
