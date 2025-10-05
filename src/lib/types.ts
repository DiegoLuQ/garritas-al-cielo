// This file defines the core data structures for the application.

export type Product = {
  id: string;
  codigo: string;
  imagenes: string[];
  nombre?: string;
  descripcion: string;
  precio: number;
  valoracion: number;
  etiquetas: string[];
  descuento?: number;
  disponible: boolean;
  // GenAI related fields
  productFeatures?: string[];
  productTags?: string[];
  productMetadata?: Record<string, any>;
  marketTrends?: string;
};

export type SiteConfig = {
  id: string;
  mainH1: string;
  mainParagraph: string;
  contactData: string;
  whatsappNumber: string;
  // Add other section titles and paragraphs as needed
};

export type User = {
  username: string;
  role: 'admin' | 'user';
};

export type ProductClick = {
  id: string;
  productCode: string;
  productName: string;
  timestamp: string;
};
