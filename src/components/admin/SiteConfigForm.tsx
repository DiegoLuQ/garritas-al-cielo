"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { updateSiteConfig } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import type { SiteConfig } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  mainH1: z.string().min(1, 'El H1 principal es requerido.'),
  mainParagraph: z.string().min(1, 'El párrafo principal es requerido.'),
  contactData: z.string().min(1, 'Los datos de contacto son requeridos.'),
  whatsappNumber: z.string().min(1, 'El número de WhatsApp es requerido.'),
});

type SiteConfigFormProps = {
  config: SiteConfig;
};

export function SiteConfigForm({ config }: SiteConfigFormProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainH1: config?.mainH1 || '',
      mainParagraph: config?.mainParagraph || '',
      contactData: config?.contactData || '',
      whatsappNumber: config?.whatsappNumber || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast({ variant: 'destructive', title: 'Error', description: 'No estás autenticado.' });
      return;
    }
    setIsSubmitting(true);
    try {
      // API Call: Update site configuration on the backend.
      await updateSiteConfig(values, token);
      toast({ title: 'Éxito', description: 'Configuración del sitio actualizada.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la configuración.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="mainH1"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>H1 Principal (Página de Inicio)</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="mainParagraph"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Párrafo Principal (Página de Inicio)</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="contactData"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Datos de Contacto (Email, etc.)</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="whatsappNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de WhatsApp</FormLabel>
              <FormControl><Input {...field} placeholder="+56912345678" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Form>
  );
}
