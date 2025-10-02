"use client";

import { ColumnDef } from '@tanstack/react-table';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ArrowUpDown, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';

export const getColumns = (
  onDelete: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'imagenes',
    header: 'Imagen',
    cell: ({ row }) => {
      const imagenes = row.getValue('imagenes') as string[];
      const firstImage = imagenes?.[0];
      return firstImage ? (
        <Image src={firstImage} alt={row.original.nombre} width={40} height={40} className="rounded-md object-cover" />
      ) : (
        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">Sin foto</div>
      );
    },
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>,
  },
  {
    accessorKey: 'codigo',
    header: 'Código',
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue('codigo')}</div>
  },
  {
    accessorKey: 'precio',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Precio
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('precio'));
      const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'disponible',
    header: 'Disponibilidad',
    cell: ({ row }) => {
      const isAvailable = row.getValue('disponible');
      return (
        <Badge variant={isAvailable ? 'default' : 'destructive'}>
          {isAvailable ? 'Disponible' : 'Agotado'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/productos/edit/${product.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
