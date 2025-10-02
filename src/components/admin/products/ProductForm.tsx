"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createProduct, updateProduct } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Loader2, Trash2, PlusCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { generateProductDescription, type ProductDetailsInput } from '@/ai/flows/generate-product-descriptions';

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  codigo: z.string().min(3, 'El código debe tener al menos 3 caracteres.'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  precio: z.coerce.number().positive('El precio debe ser un número positivo.'),
  valoracion: z.coerce.number().min(0).max(5, 'La valoración debe estar entre 0 y 5.'),
  etiquetas: z.array(z.object({ value: z.string() })).min(1, 'Añade al menos una etiqueta.'),
  imagenes: z.array(z.object({ value: z.string().url('Debe ser una URL válida.') })).min(1, 'Añade al menos una imagen.'),
  descuento: z.coerce.number().optional(),
  disponible: z.boolean(),
});

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const isEditMode = !!product;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: product?.nombre || '',
      codigo: product?.codigo || '',
      descripcion: product?.descripcion || '',
      precio: product?.precio || 0,
      valoracion: product?.valoracion || 0,
      etiquetas: product?.etiquetas.map(value => ({ value })) || [{ value: '' }],
      imagenes: product?.imagenes.map(value => ({ value })) || [{ value: '' }],
      descuento: product?.descuento || undefined,
      disponible: product?.disponible ?? true,
    },
  });

  const { fields: etiquetasFields, append: appendEtiqueta, remove: removeEtiqueta } = useFieldArray({
    control: form.control,
    name: "etiquetas",
  });

  const { fields: imagenesFields, append: appendImagen, remove: removeImagen } = useFieldArray({
    control: form.control,
    name: "imagenes",
  });

  async function handleGenerateDescription() {
    setIsGenerating(true);
    const formData = form.getValues();
    const input: ProductDetailsInput = {
      productName: formData.nombre,
      productFeatures: [], // You can extend the form to include features
      productTags: formData.etiquetas.map(t => t.value),
    };

    try {
      // AI Call to generate description
      const result = await generateProductDescription(input);
      form.setValue('descripcion', result.description, { shouldValidate: true });
      toast({ title: 'Descripción generada', description: 'La descripción del producto ha sido actualizada por la IA.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error de IA', description: 'No se pudo generar la descripción.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast({ variant: 'destructive', title: 'Error', description: 'No estás autenticado.' });
      return;
    }
    setIsSubmitting(true);
    
    const productData = {
      ...values,
      etiquetas: values.etiquetas.map(e => e.value),
      imagenes: values.imagenes.map(i => i.value),
    };

    try {
      if (isEditMode) {
        // API Call: Update existing product.
        await updateProduct(product.id, productData, token);
        toast({ title: 'Éxito', description: 'Producto actualizado correctamente.' });
      } else {
        // API Call: Create new product.
        await createProduct(productData, token);
        toast({ title: 'Éxito', description: 'Producto creado correctamente.' });
      }
      router.push('/admin/productos');
      router.refresh(); // To see the changes in the table
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar el producto.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{isEditMode ? 'Editar Producto' : 'Crear Producto'}</CardTitle>
        <CardDescription>Rellena los detalles del producto.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField name="nombre" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="codigo" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Código</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            
            <FormField name="descripcion" control={form.control} render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Descripción</FormLabel>
                  <Button type="button" size="sm" variant="outline" onClick={handleGenerateDescription} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generar con IA
                  </Button>
                </div>
                <FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FormField name="precio" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Precio</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="valoracion" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Valoración (0-5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="descuento" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Descuento (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="disponible" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Disponible</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <FormDescription>{field.value ? 'El producto se mostrará en la tienda' : 'El producto estará oculto'}</FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div>
              <FormLabel>Imágenes (URLs)</FormLabel>
              {imagenesFields.map((field, index) => (
                <FormField key={field.id} name={`imagenes.${index}.value`} control={form.control} render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-2">
                    <FormControl><Input {...field} placeholder="https://..."/></FormControl>
                    {imagenesFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeImagen(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendImagen({ value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Imagen
              </Button>
            </div>
            
            <div>
              <FormLabel>Etiquetas</FormLabel>
              {etiquetasFields.map((field, index) => (
                <FormField key={field.id} name={`etiquetas.${index}.value`} control={form.control} render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-2">
                    <FormControl><Input {...field} /></FormControl>
                    {etiquetasFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeEtiqueta(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendEtiqueta({ value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Etiqueta
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Guardar Cambios' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
