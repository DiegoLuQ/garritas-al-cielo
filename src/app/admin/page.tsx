import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag, Settings, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Gestiona tu tienda desde aquí.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Gestión de Productos
            </CardTitle>
            <CardDescription>
              Añade, edita, y elimina productos de tu catálogo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/productos">
                Ir a Productos <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Settings className="w-6 h-6 text-primary" />
              Configuración del Sitio
            </CardTitle>
            <CardDescription>
              Modifica los textos, información de contacto y más.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/configuracion-sitio">
                Ir a Configuración <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
