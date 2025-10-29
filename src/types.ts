// src/types.ts

export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  originalPrice?: number; // El '?' significa que es opcional
  rating: number;
  reviews: number;
  tags: string[];
  imageUrl: string;
  description?: string; // Opcional, para la página de detalle
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
}
// src/types.ts (AÑADIR AL FINAL)

// Un CartItem es un Producto, pero con una 'quantity'
export interface CartItem extends Product {
  quantity: number;
}

// Esto define qué funciones y valores tendrá nuestro Contexto
// Le dice a TypeScript qué podemos "preguntar" al carrito.
export interface CartContextType {
  cart: CartItem[]; // La lista de items
  itemCount: number; // El número total de items (ej. 5)
  totalPrice: number; // El precio total

  // Funciones para modificar el carrito
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

// Un WishlistItem es simplemente un Producto.
// No necesitamos cantidad.
export type WishlistItem = Product;

// Esto define qué podemos "preguntar" a la wishlist.
export interface WishlistContextType {
  wishlist: WishlistItem[];
  itemCount: number;

  // Funciones para modificar la wishlist
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;

  // Función para saber si un producto YA está en la lista
  isInWishlist: (productId: string) => boolean;
}
// Tipos de Filtros
export interface FilterOption {
  label: string;
  count: number;
}

export interface Filter {
  id: string; // e.g., 'skinType'
  title: string; // e.g., 'Tipo de Piel'
  type: 'checkbox' | 'priceRange';
  options?: FilterOption[]; // Para 'checkbox'
  min?: number; // Para 'priceRange'
  max?: number; // Para 'priceRange'
}

// Interfaz para la respuesta de la API de filtros
export interface FiltersApiResponse {
  filters: Filter[];
}