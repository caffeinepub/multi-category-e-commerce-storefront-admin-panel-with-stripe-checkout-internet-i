import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetCategories } from '../../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminCategoriesPage() {
  usePageMeta('Manage Categories');
  
  const { data: categories = [], isLoading } = useGetCategories();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Categories</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading categories...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.parentCategory || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
