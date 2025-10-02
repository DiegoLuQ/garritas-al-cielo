"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type ProductCarouselProps = {
  images: string[];
  productName: string;
};

export default function ProductCarousel({ images, productName }: ProductCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full flex items-center justify-center bg-muted rounded-lg">
        <span className="text-muted-foreground">No hay imagen</span>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="overflow-hidden">
                <CardContent className="flex aspect-video items-center justify-center p-0">
                  <Image
                    src={src}
                    alt={`${productName} - Imagen ${index + 1}`}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint="product image"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </>
      )}
    </Carousel>
  );
}
