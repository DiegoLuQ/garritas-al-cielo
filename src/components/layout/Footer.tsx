import { Logo } from '@/components/shared/Logo';
import { getSiteConfig } from '@/lib/api';

export default async function Footer() {
  const config = await getSiteConfig();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo />
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Tu tienda de confianza para los mejores productos tecnológicos.
            </p>
          </div>
          <div className="text-center md:text-right">
            <h4 className="font-headline font-semibold mb-2">Contacto</h4>
            <p className="text-sm text-muted-foreground">{config.contactData}</p>
            <p className="text-sm text-muted-foreground">WhatsApp: {config.whatsappNumber}</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} E-Shop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
