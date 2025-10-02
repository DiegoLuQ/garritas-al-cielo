import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductList from '@/components/products/ProductList';
import { getProducts, getSiteConfig } from '@/lib/api';
import type { Product, SiteConfig } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function Hero() {
  // API Call: Fetch site configuration from the backend.
  const siteConfig: SiteConfig = await getSiteConfig();
  
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">{siteConfig.mainH1 || 'Bienvenido a E-Shop'}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{siteConfig.mainParagraph || 'Tu tienda de confianza para los mejores productos.'}</p>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto flex flex-col items-center">
        <Skeleton className="h-16 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    </section>
  );
}


async function Products() {
  // API Call: Fetch products from the backend.
  const products: Product[] = await getProducts();
  return <ProductList products={products} />;
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
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


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
        
        <section className="py-12 bg-secondary/50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-headline font-bold text-center mb-8">Nuestros Productos</h2>
            <Suspense fallback={<ProductsSkeleton />}>
              <Products />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
