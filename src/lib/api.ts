/**
 * This file centralizes all API calls to the FastAPI backend.
 * The URLs are constructed using the environment variable NEXT_PUBLIC_API_URL.
 *
 * NOTE: For development purposes, mock data is returned.
 * In a production environment, these functions would make actual `fetch` calls.
 */
import type { Product, SiteConfig } from './types';
import { placeholderImages } from './placeholder-images.json';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- MOCK DATA ---
const mockProducts: Product[] = [
  { id: '1', nombre: 'Teclado Mecánico RGB', codigo: 'TEC-001', descripcion: 'Un teclado mecánico con iluminación RGB personalizable y switches de alta calidad.', precio: 89.99, valoracion: 5, imagenes: placeholderImages.filter(img => img.id.startsWith('keyboard')).map(img => img.imageUrl), disponible: true, etiquetas: ['gaming', 'periferico', 'rgb'], productTags: ['gaming', 'periferico', 'rgb'], productFeatures: ['Switches mecánicos', 'Iluminación RGB', 'Cable USB-C'] },
  { id: '2', nombre: 'Monitor Curvo 4K', codigo: 'MON-002', descripcion: 'Monitor curvo de 27 pulgadas con resolución 4K para una inmersión total.', precio: 349.50, valoracion: 4, imagenes: placeholderImages.filter(img => img.id.startsWith('monitor')).map(img => img.imageUrl), disponible: true, etiquetas: ['monitor', '4k', 'curvo'], productTags: ['monitor', '4k', 'curvo'], productFeatures: ['Resolución 4K UHD', 'Pantalla curva 1500R', 'Tasa de refresco 144Hz'] },
  { id: '3', nombre: 'Mouse Inalámbrico Ergonómico', codigo: 'MOU-003', descripcion: 'Mouse inalámbrico diseñado para la máxima comodidad durante horas de uso.', precio: 45.00, valoracion: 5, imagenes: placeholderImages.filter(img => img.id.startsWith('mouse')).map(img => img.imageUrl), disponible: false, etiquetas: ['mouse', 'inalambrico', 'ergonomico'], productTags: ['mouse', 'inalambrico', 'ergonomico'], productFeatures: ['Diseño ergonómico', 'Batería de larga duración', 'Sensor óptico preciso'] },
  { id: '4', nombre: 'Auriculares con Cancelación de Ruido', codigo: 'AUR-004', descripcion: 'Sumérgete en tu música con estos auriculares con cancelación de ruido activa.', precio: 120.00, valoracion: 4, imagenes: placeholderImages.filter(img => img.id.startsWith('headphones')).map(img => img.imageUrl), disponible: true, etiquetas: ['audio', 'cancelacion de ruido'], productTags: ['audio', 'cancelacion de ruido'], productFeatures: ['Cancelación de ruido activa', '20 horas de batería', 'Sonido de alta fidelidad'] },
  { id: '5', nombre: 'Webcam HD 1080p', codigo: 'CAM-005', descripcion: 'Webcam con resolución Full HD para videollamadas nítidas y claras.', precio: 65.00, valoracion: 4, imagenes: placeholderImages.filter(img => img.id.startsWith('webcam')).map(img => img.imageUrl), disponible: true, etiquetas: ['video', 'streaming', 'webcam'], productTags: ['video', 'streaming', 'webcam'], productFeatures: ['Resolución 1080p', 'Micrófono incorporado', 'Corrección de luz automática'] },
  { id: '6', nombre: 'Silla Gamer Profesional', codigo: 'SIL-006', descripcion: 'Silla ergonómica para largas sesiones de juego o trabajo.', precio: 250.00, valoracion: 5, imagenes: placeholderImages.filter(img => img.id.startsWith('chair')).map(img => img.imageUrl), disponible: true, etiquetas: ['silla', 'gamer', 'oficina'], productTags: ['silla', 'gamer', 'oficina'], productFeatures: ['Diseño ergonómico', 'Soporte lumbar ajustable', 'Materiales premium'] },
];

let mockSiteConfig: SiteConfig = {
  id: '1',
  mainH1: 'Tecnología de Vanguardia',
  mainParagraph: 'Explora nuestra selección de productos de alta tecnología diseñados para mejorar tu día a día.',
  contactData: 'contacto@eshop.com',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP || '+56912345678',
};


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- AUTH API ---

export async function login(data: any) {
  console.log(`[API MOCK] POST: ${API_URL}/auth/login`, data);
  // In a real app, you would make a fetch call here.
  // await fetch(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  await delay(500);
  if (data.username === 'admin' && data.password === 'admin') {
    return { token: 'mock-jwt-token', role: 'admin' };
  }
  throw new Error('Credenciales inválidas');
}

export async function verifyToken(token: string) {
  console.log(`[API MOCK] GET: ${API_URL}/auth/verify with token`, token);
  // In a real app, you would make a fetch call here.
  // await fetch(`${API_URL}/auth/verify`, { headers: { 'Authorization': `Bearer ${token}` } });
  await delay(500);
  if (token === 'mock-jwt-token') {
    return { valid: true, role: 'admin' };
  }
  return { valid: false };
}


// --- PRODUCTS API ---

export async function getProducts(): Promise<Product[]> {
  console.log(`[API MOCK] GET: ${API_URL}/productos`);
  await delay(1000);
  return mockProducts;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  console.log(`[API MOCK] GET: ${API_URL}/productos/${id}`);
  await delay(500);
  return mockProducts.find(p => p.id === id);
}

export async function createProduct(product: Omit<Product, 'id'>, token: string) {
  console.log(`[API MOCK] POST: ${API_URL}/productos`, { product, token });
  await delay(500);
  const newProduct = { ...product, id: String(Date.now()) };
  mockProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<Product>, token: string) {
  console.log(`[API MOCK] PUT: ${API_URL}/productos/${id}`, { product, token });
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...product };
    return mockProducts[index];
  }
  throw new Error('Producto no encontrado');
}

export async function deleteProduct(id: string, token: string) {
  console.log(`[API MOCK] DELETE: ${API_URL}/productos/${id}`, { token });
  await delay(500);
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return { message: 'Producto eliminado' };
  }
  throw new Error('Producto no encontrado');
}


// --- SITE CONFIG API ---

export async function getSiteConfig(): Promise<SiteConfig> {
  console.log(`[API MOCK] GET: ${API_URL}/configuracion`);
  await delay(500);
  return mockSiteConfig;
}

export async function updateSiteConfig(config: Partial<SiteConfig>, token: string) {
  console.log(`[API MOCK] PUT: ${API_URL}/configuracion`, { config, token });
  await delay(500);
  mockSiteConfig = { ...mockSiteConfig, ...config };
  return mockSiteConfig;
}
