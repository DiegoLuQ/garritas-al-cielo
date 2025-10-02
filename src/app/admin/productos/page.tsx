"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { getProducts, deleteProduct } from '@/lib/api';
import type { Product } from '@/lib/types';
import { DataTable } from '@/components/admin/products/DataTable';
import { getColumns } from '@/components/admin/products/Columns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { DeleteProductDialog } from '@/components/admin/products/DeleteProductDialog';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los productos.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete || !token) return;
    try {
      // API Call: Delete product from the backend.
      await deleteProduct(productToDelete.id, token);
      toast({
        title: 'Éxito',
        description: `Producto "${productToDelete.nombre}" eliminado.`,
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el producto.',
      });
    } finally {
        setProductToDelete(null);
    }
  };
  
  const columns = useMemo(() => getColumns((product) => setProductToDelete(product)), []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gestión de Productos</h1>
          <p className="text-muted-foreground">Añade, edita y elimina productos.</p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable columns={columns} data={products} />
      )}

      <DeleteProductDialog 
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        product={productToDelete}
      />
    </div>
  );
}
