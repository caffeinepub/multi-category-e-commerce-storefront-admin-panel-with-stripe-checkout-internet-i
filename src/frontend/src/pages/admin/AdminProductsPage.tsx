import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetAllProducts, useAddProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  usePageMeta('Manage Products');
  
  const { data: products = [], isLoading } = useGetAllProducts();
  const addProduct = useAddProduct();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addProduct.mutateAsync({
        id: formData.id,
        name: formData.name,
        description: formData.description,
        price: BigInt(Math.round(parseFloat(formData.price) * 100)),
        category: formData.category
      });
      toast.success('Product added successfully!');
      setOpen(false);
      setFormData({ id: '', name: '', description: '', price: '', category: '1' });
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="id">Product ID *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={addProduct.isPending}>
                {addProduct.isPending ? 'Adding...' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products yet. Add your first product!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-sm">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${(Number(product.price) / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" disabled>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
