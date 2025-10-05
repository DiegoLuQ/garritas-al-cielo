"use client";

import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProductCarousel from './ProductCarousel';
import { Button } from '@/components/ui/button';
import { Star, Tag, Zap, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trackProductClick } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

// This component is now a client component to handle the click event.
export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
  const productName = product.nombre || product.descripcion;
  const whatsappMessage = `https://wa.me/${whatsappNumber}?text=Quiero%20el%20producto%20${product.codigo}%20-%20${productName}`;

  const handleConsultarClick = () => {
    // API Call: Track the product click.
    trackProductClick({ productCode: product.codigo, productName: productName });
    toast({
      title: 'Seguimiento',
      description: `Clic en "${productName}" registrado.`,
    });
    // Open WhatsApp link
    window.open(whatsappMessage, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <ProductCarousel images={product.imagenes} productName={productName} />
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <CardTitle className="font-headline text-xl">{productName}</CardTitle>
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
        <Button onClick={handleConsultarClick} disabled={!product.disponible}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Consultar
        </Button>
      </CardFooter>
    </Card>
  );
}
