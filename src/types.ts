// src/types.ts (Actualizado)

export interface Product {
  id: string;
  category: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  tags: string[];
  imageUrl: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  productCount: number;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
}

export type WishlistItem = Product;

export interface WishlistContextType {
  wishlist: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export interface FilterOption {
  label: string;
  count: number;
}

export interface Filter {
  id: string;
  title: string;
  type: 'checkbox' | 'priceRange';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface FiltersApiResponse {
  filters: Filter[];
}

// --- CAMBIOS DE AUTENTICACIÓN AQUÍ ---

// 1. Añadido 'displayName'
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null; // <-- CAMPO AÑADIDO
  role: 'admin' | 'customer';
}

export interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;

  login: (email: string, pass: string) => Promise<void>;
  // 2. 'register' ahora también pedirá un displayName
  register: (email: string, pass: string, displayName: string) => Promise<void>; // <-- CAMPO AÑADIDO
  logout: () => Promise<void>;
}
export type SelectedFilters = Record<string, string[]>;

// Definimos los únicos dos valores que puede tener el tema
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}