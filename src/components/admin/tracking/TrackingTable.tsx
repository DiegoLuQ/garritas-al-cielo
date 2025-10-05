"use client";

import type { ProductClick } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TrackingTableProps {
  data: ProductClick[];
}

export function TrackingTable({ data }: TrackingTableProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Fecha y Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data.map((click) => (
              <TableRow key={click.id}>
                <TableCell className="font-medium">{click.productName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{click.productCode}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{click.description}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(click.price)}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {format(new Date(click.timestamp), "PPP p", { locale: es })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aún no hay clics registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
