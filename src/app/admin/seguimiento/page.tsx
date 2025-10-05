"use client";

import { TrackingTable } from '@/components/admin/tracking/TrackingTable';
import { getTrackedClicks } from '@/lib/api';
import { useState, useEffect } from 'react';
import type { ProductClick } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

function TrackingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default function TrackingPage() {
  const [clicks, setClicks] = useState<ProductClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClicks() {
      try {
        const data = await getTrackedClicks();
        setClicks(data);
      } catch (error) {
        console.error("Failed to fetch tracked clicks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClicks();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Seguimiento de Clics</h1>
        <p className="text-muted-foreground">Revisa los clics que los usuarios han hecho en los productos.</p>
      </div>
      
      {loading ? (
         <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TrackingTable data={clicks} />
      )}
    </div>
  );
}
