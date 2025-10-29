// src/services/api.ts (Actualizado con URLs de placeholder)

// Importamos los tipos que acabamos de definir
import type { Product, Category , Filter} from '../types';

// --- DATOS MOCK (simulando tu base de datos) ---

const allProducts: Product[] = [
  // K-Beauty
  {
    id: 'kb1',
    category: 'K-Beauty',
    name: 'COSRX Advanced Snail 96 Mucin Power Essence',
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 9541,
    tags: ['Best Seller', '17% OFF'],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=COSRX+Snail+Essence', 
  },
  {
    id: 'kb2',
    category: 'K-Beauty',
    name: 'Laneige Water Sleeping Mask - Hydrating Night Treatment',
    price: 32.00,
    originalPrice: 40.00,
    rating: 4.9,
    reviews: 5876,
    tags: ['20% OFF', "Editor's Pick"],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Laneige+Mask',
  },
  {
    id: 'kb3',
    category: 'K-Beauty',
    name: 'Innisfree Green Tea Seed Serum - Moisture Boost',
    price: 18.50,
    rating: 4.7,
    reviews: 3241,
    tags: [],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Innisfree+Serum',
  },

  // Snacks
  {
    id: 's1',
    category: 'Snacks',
    name: 'Korean Rice Cake Snack Mix - Tteokbokki Flavor',
    price: 6.99,
    rating: 4.6,
    reviews: 945,
    tags: ['New'],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Tteokbokki+Snack',
  },
  {
    id: 's2',
    category: 'Snacks',
    name: 'Pepero Chocolate Sticks - Assorted Flavors (12 boxes)',
    price: 24.50,
    rating: 4.7,
    reviews: 1567,
    tags: [],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Pepero+Sticks',
  },
  {
    id: 's3',
    category: 'Snacks',
    name: 'Korean Honey Butter Chips - Family Size Pack',
    price: 8.99,
    originalPrice: 11.99,
    rating: 4.8,
    reviews: 2134,
    tags: ['25% OFF'],
    // URL actualizada
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Honey+Butter+Chips',
  },
];

const allCategories: Category[] = [
  // URLs actualizadas
  { id: 'k-beauty', name: 'K-Beauty', imageUrl: 'https://via.placeholder.com/400x400.png?text=K-Beauty', productCount: 450 },
  { id: 'k-pop', name: 'K-Pop', imageUrl: 'https://via.placeholder.com/400x400.png?text=K-Pop', productCount: 320 },
  { id: 'k-fashion', name: 'K-Fashion', imageUrl: 'https://via.placeholder.com/400x400.png?text=K-Fashion', productCount: 280 },
  { id: 'snacks', name: 'Snacks', imageUrl: 'https://via.placeholder.com/400x400.png?text=Snacks', productCount: 180 },
];

// --- FUNCIONES DE API (simulando peticiones de red) ---

// Función helper que simula el retraso de una petición a internet
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Obtiene todos los productos (o filtrados por categoría).
 * En el futuro, esto sería: supabase.from('products').select('*')
 */
export const getProducts = async (category: string | null = null): Promise<Product[]> => {
  console.log(`API: Obteniendo productos... (Categoría: ${category})`);
  await networkDelay(500); 

  if (category) {
    return allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return allProducts;
};

/**
 * Obtiene solo los productos "Destacados" (ej. 'Best Seller')
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  console.log('API: Obteniendo productos destacados...');
  await networkDelay(300); 

  return allProducts.filter(p => p.tags.includes('Best Seller') || p.tags.includes("Editor's Pick"));
};

/**
 * Obtiene todas las categorías principales
 */
export const getCategories = async (): Promise<Category[]> => {
  console.log('API: Obteniendo categorías...');
  await networkDelay(200); 
  return allCategories;
};

/**
 * Obtiene un solo producto por su ID.
 * En el futuro: supabase.from('products').select('*').eq('id', id).single()
 */
export const getProductById = async (id: string): Promise<Product> => {
  console.log(`API: Obteniendo producto por ID: ${id}`);
  await networkDelay(400);

  const product = allProducts.find(p => p.id === id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  return product;
};

// --- MOCKUP DE DATOS DE FILTROS ---
// Estos son los filtros que nuestra API "falsa" devolverá

const priceRangeFilter: Filter = {
  id: 'price',
  title: 'Rango de Precio',
  type: 'priceRange',
  min: 0,
  max: 100
};

// Filtros específicos para K-Beauty
const kBeautyFilters: Filter[] = [
  {
    id: 'skinType',
    title: 'Tipo de Piel',
    type: 'checkbox',
    options: [
      { label: 'Grasa', count: 32 },
      { label: 'Seca', count: 45 },
      { label: 'Mixta', count: 51 },
      { label: 'Sensible', count: 28 },
    ],
  },
  {
    id: 'brand',
    title: 'Marca',
    type: 'checkbox',
    options: [
      { label: 'COSRX', count: 18 },
      { label: 'Innisfree', count: 22 },
      { label: 'Laneige', count: 12 },
      { label: 'Some By Mi', count: 15 },
    ],
  },
  priceRangeFilter,
];

// Filtros específicos para K-Pop
const kPopFilters: Filter[] = [
  {
    id: 'group',
    title: 'Grupo',
    type: 'checkbox',
    options: [
      { label: 'BTS', count: 40 },
      { label: 'BLACKPINK', count: 35 },
      { label: 'Stray Kids', count: 28 },
      { label: 'TWICE', count: 31 },
    ],
  },
  {
    id: 'productType',
    title: 'Tipo de Producto',
    type: 'checkbox',
    options: [
      { label: 'Álbumes', count: 78 },
      { label: 'Lightsticks', count: 12 },
      { label: 'Merch Oficial', count: 44 },
    ],
  },
  priceRangeFilter,
];

// Filtros para Snacks
const snackFilters: Filter[] = [
  {
    id: 'flavor',
    title: 'Sabor',
    type: 'checkbox',
    options: [
      { label: 'Picante', count: 15 },
      { label: 'Dulce', count: 30 },
      { label: 'Salado', count: 22 },
    ],
  },
  {
    id: 'type',
    title: 'Tipo',
    type: 'checkbox',
    options: [
      { label: 'Chips & Crisps', count: 18 },
      { label: 'Bebidas', count: 27 },
      { label: 'Dulces & Galletas', count: 22 },
    ],
  },
  priceRangeFilter,
];

// --- NUEVA FUNCIÓN DE API ---

/**
 * Obtiene los filtros disponibles para una categoría específica.
 */
export const getFiltersForCategory = async (categoryName: string): Promise<Filter[]> => {
  console.log(`API: Obteniendo filtros para la categoría: ${categoryName}`);
  await networkDelay(350); // Simula una carga de red

  switch (categoryName.toLowerCase()) {
    case 'k-beauty':
      return kBeautyFilters;
    case 'k-pop':
      return kPopFilters;
    case 'snacks':
      return snackFilters;
    case 'k-fashion':
      // Devolvemos filtros genéricos por ahora
      return [priceRangeFilter]; 
    default:
      // Devuelve un array vacío si la categoría no tiene filtros
      return []; 
  }
};