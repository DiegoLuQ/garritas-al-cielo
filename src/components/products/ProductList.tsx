import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

type ProductListProps = {
  products: Product[];
};

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground">No se encontraron productos.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
