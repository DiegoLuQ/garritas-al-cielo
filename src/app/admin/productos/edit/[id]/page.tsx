import { ProductForm } from '@/components/admin/products/ProductForm';
import { getProductById } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  // API Call: Fetch product data by ID from the backend.
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} />;
}
