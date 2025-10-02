import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductList from '@/components/products/ProductList';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_PER_PAGE = 6;

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function Products() {
  // API Call: Fetch products from the backend.
  const products: Product[] = await getProducts();
  // For now, we show all products. We can add pagination later if needed.
  return <ProductList products={products} />;
}

export default function CatalogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-12">
        <h1 className="text-4xl font-headline font-bold text-center mb-8">Nuestro Catálogo</h1>
        
        <Suspense fallback={<ProductsSkeleton />}>
          <Products />
        </Suspense>

        {/* 
          Pagination can be re-added here if needed. 
          It would require making this a client component again or using query params for server-side pagination.
        */}
      </main>
      <Footer />
    </div>
  );
}
