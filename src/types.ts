// --- Tipos de Productos y Categorías ---
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

// --- Tipos de Carrito ---
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

// --- Tipos de Wishlist ---
export type WishlistItem = Product;

export interface WishlistContextType {
  wishlist: WishlistItem[];
  itemCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

// --- Tipos de Filtros ---
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

// Este es el tipo que faltaba y rompió Sidebar/ProductsPage/Api
export type SelectedFilters = Record<string, string[]>;


// --- Tipos de Autenticación ---
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'customer';
}

export interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // (El que acabamos de añadir)
}

// --- Tipos de Pedidos ---
export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: any;
}

// --- Tipos de Tema (Dark Mode) ---
// Estos son los tipos que faltaban y rompieron ThemeContext
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
