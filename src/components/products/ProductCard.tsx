import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCarousel from './ProductCarousel';
import { Button } from '@/components/ui/button';
import { Star, Tag, Zap, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  product: Product;
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `https://wa.me/${whatsappNumber}?text=Quiero%20el%20producto%20${product.codigo}%20-%20${product.nombre}`;

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <ProductCarousel images={product.imagenes} productName={product.nombre} />
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <CardTitle className="font-headline text-xl">{product.nombre}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">{product.descripcion}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{product.valoracion.toFixed(1)}</span>
          </div>
          <Badge variant={product.disponible ? "secondary" : "destructive"} className="flex items-center gap-1">
            <Zap className="w-3 h-3"/>
            {product.disponible ? 'Disponible' : 'Agotado'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-mono">{product.codigo}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <p className="text-2xl font-bold font-headline text-primary">
          ${product.precio.toLocaleString('es-CL')}
        </p>
        <Button asChild disabled={!product.disponible}>
          <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Consultar
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
