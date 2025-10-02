import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteConfigForm } from '@/components/admin/SiteConfigForm';
import { getSiteConfig } from '@/lib/api';

export default async function SiteConfigPage() {
  // API Call: Fetch current site configuration from the backend.
  const config = await getSiteConfig();

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Configuración del Sitio</h1>
      <p className="text-muted-foreground mb-8">Modifica los textos principales y datos de contacto de tu tienda.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Contenido General</CardTitle>
          <CardDescription>Estos textos aparecen en la página de inicio y el pie de página.</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteConfigForm config={config} />
        </CardContent>
      </Card>
    </div>
  );
}
