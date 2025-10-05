
import { TrackingTable } from '@/components/admin/tracking/TrackingTable';
import { getTrackedClicks } from '@/lib/api';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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

async function TrackingData() {
  // API Call: Fetch tracked clicks from the backend.
  const clicks = await getTrackedClicks();
  return <TrackingTable data={clicks} />;
}

export default function TrackingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Seguimiento de Clics</h1>
        <p className="text-muted-foreground">Revisa los clics que los usuarios han hecho en los productos.</p>
      </div>
      
      <Suspense fallback={<TrackingSkeleton />}>
        <TrackingData />
      </Suspense>
    </div>
  );
}
