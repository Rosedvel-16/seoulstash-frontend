import { db } from './firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where,
  addDoc,
  QueryConstraint,
  deleteDoc,
  updateDoc,
  Timestamp // Importado para los pedidos
} from "firebase/firestore";
// Importamos todos los tipos que hemos definido
import type { 
  Product, 
  Category, 
  Filter, 
  SelectedFilters, 
  Order, 
  CartItem 
} from '../types';

// Helper para simular retraso de red
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- FUNCIONES DE LECTURA DE FIRESTORE (Productos, Categorías, Búsqueda) ---

/**
 * Obtiene productos, opcionalmente filtrados por categoría y filtros de checkbox.
 */
export const getProducts = async (
  categoryName: string | null,
  activeFilters: SelectedFilters = {}
): Promise<Product[]> => {
  console.log(`API REAL: Obteniendo productos... (Categoría: ${categoryName})`);
  console.log("Filtros activos:", activeFilters);
  await networkDelay(500); 

  const productsCollection = collection(db, "products");
  const queryConstraints: QueryConstraint[] = [];

  // 1. Filtro base por Categoría
  if (categoryName) {
    queryConstraints.push(where("category", "==", categoryName));
  }
  
  // 2. Obtenemos los productos de Firebase
  const q = query(productsCollection, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  
  let products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });
  
  // 3. Filtramos en el frontend (client-side)
  // (Este es el "hack" para que los filtros de 'brand', 'flavor', 'type' funcionen
  // buscando en el nombre del producto)
  if (Object.keys(activeFilters).length > 0) {
    products = products.filter(product => {
      // 'every' = debe coincidir con TODOS los grupos (ej. Sabor Y Tipo)
      return Object.keys(activeFilters).every(filterId => {
        const selectedOptions = activeFilters[filterId];
        if (selectedOptions.length === 0) return true; // Pasa si no hay nada seleccionado
        
        // 'some' = debe coincidir con CUALQUIERA de las opciones (ej. "Tteokbokki" O "Chocolate")
        return selectedOptions.some(optionLabel => 
           product.name.toLowerCase().includes(optionLabel.toLowerCase())
        );
      });
    });
  }

  console.log("Productos filtrados:", products.length);
  return products;
};

/**
 * Obtiene solo los productos "Destacados" (tags 'Best Seller' o 'Editor's Pick')
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos destacados...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains-any", ["Best Seller", "Editor's Pick"]));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};

/**
 * Obtiene todas las categorías principales
 */
export const getCategories = async (): Promise<Category[]> => {
  console.log('API REAL: Obteniendo categorías...');
  await networkDelay(200); 
  const categoriesCollection = collection(db, "categories");
  const q = query(categoriesCollection); 
  const querySnapshot = await getDocs(q);
  const categories: Category[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  return categories;
};

/**
 * Obtiene un solo producto por su ID.
 */
export const getProductById = async (id: string): Promise<Product> => {
  console.log(`API REAL: Obteniendo producto por ID: ${id}`);
  await networkDelay(400);
  const productDocRef = doc(db, "products", id);
  const docSnap = await getDoc(productDocRef);
  if (!docSnap.exists()) {
    throw new Error('Producto no encontrado');
  }
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

/**
 * Busca productos por nombre en toda la base de datos (filtro client-side).
 */
export const searchProducts = async (queryText: string): Promise<Product[]> => {
  console.log(`API REAL: Buscando productos con query: "${queryText}"`);
  await networkDelay(600); 
  const normalizedQuery = queryText.toLowerCase();

  const productsCollection = collection(db, "products");
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);
  
  const allProducts: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });

  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.category.toLowerCase().includes(normalizedQuery)
  );

  return filteredProducts;
};

/**
 * Obtiene solo los productos con el tag "New"
 */
export const getNewProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos nuevos...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains", "New"));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};

/**
 * Obtiene solo los productos con tags de "Oferta"
 */
export const getOfferProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos en oferta...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains-any", ["17% OFF", "20% OFF", "25% OFF", "Sale"]));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};


// --- FUNCIONES DE ESCRITURA EN FIRESTORE (Admin CRUD y Pedidos) ---

/**
 * Añade un nuevo producto a la colección 'products'.
 */
export const addProductToFirestore = async (productData: any) => {
  console.log("API REAL: Añadiendo producto a Firestore...");
  try {
    const productsCollection = collection(db, "products");
    const docRef = await addDoc(productsCollection, productData);
    console.log("Producto añadido con ID: ", docRef.id);
    return docRef.id; 
  } catch (error) {
    console.error("Error al añadir producto: ", error);
    throw new Error("No se pudo añadir el producto a Firestore.");
  }
};

/**
 * Elimina un producto de Firestore usando su ID.
 */
export const deleteProductFromFirestore = async (productId: string) => {
  console.log(`API REAL: Eliminando producto con ID: ${productId}`);
  try {
    const productDocRef = doc(db, "products", productId);
    await deleteDoc(productDocRef);
    console.log("Producto eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar producto: ", error);
    throw new Error("No se pudo eliminar el producto de Firestore.");
  }
};

/**
 * Actualiza un producto en Firestore usando su ID y nuevos datos.
 */
export const updateProductInFirestore = async (productId: string, productData: any) => {
  console.log(`API REAL: Actualizando producto con ID: ${productId}`);
  try {
    const productDocRef = doc(db, "products", productId);
    await updateDoc(productDocRef, productData);
    console.log("Producto actualizado con éxito.");
  } catch (error) {
    console.error("Error al actualizar producto: ", error);
    throw new Error("No se pudo actualizar el producto en Firestore.");
  }
};

/**
 * Crea un nuevo documento de "pedido" en la colección 'orders'.
 * (Función del Paso 51)
 */
export const createOrderInFirestore = async (
  userId: string, 
  items: CartItem[], 
  total: number
) => {
  console.log("API REAL: Creando orden en Firestore...");
  try {
    const ordersCollection = collection(db, "orders");
    
    const newOrderData: Omit<Order, 'id'> = {
      userId: userId,
      items: items, 
      total: total,
      status: "completed", 
      createdAt: Timestamp.now() // Marca de tiempo de Firebase
    };
    
    const docRef = await addDoc(ordersCollection, newOrderData);
    
    console.log("Orden creada con ID: ", docRef.id);
    return docRef.id; 
    
  } catch (error) {
    console.error("Error al crear la orden: ", error);
    throw new Error("No se pudo crear la orden en Firestore.");
  }
};


// --- DATOS Y FUNCIÓN MOCK PARA FILTROS ---
// (Estos siguen siendo falsos/simulados)

const priceRangeFilter: Filter = { id: 'price', title: 'Rango de Precio', type: 'priceRange', min: 0, max: 100 };
const kBeautyFilters: Filter[] = [
  { id: 'brand', title: 'Marca', type: 'checkbox', options: [{ label: 'COSRX', count: 18 }, { label: 'Innisfree', count: 22 }, { label: 'Laneige', count: 12 }, { label: 'Some By Mi', count: 15 },], },
  { id: 'skinType', title: 'Tipo de Piel', type: 'checkbox', options: [{ label: 'Grasa', count: 32 }, { label: 'Seca', count: 45 }, { label: 'Mixta', count: 51 }, { label: 'Sensible', count: 28 },], },
  priceRangeFilter,
];
const kPopFilters: Filter[] = [
  { id: 'group', title: 'Grupo', type: 'checkbox', options: [{ label: 'BTS', count: 40 }, { label: 'BLACKPINK', count: 35 }, { label: 'Stray Kids', count: 28 }, { label: 'TWICE', count: 31 },], },
  { id: 'productType', title: 'Tipo de Producto', type: 'checkbox', options: [{ label: 'Álbumes', count: 78 }, { label: 'Lightsticks', count: 12 }, { label: 'Merch Oficial', count: 44 },], },
  priceRangeFilter,
];
const snackFilters: Filter[] = [
  { id: 'flavor', title: 'Sabor', type: 'checkbox', options: [{ label: 'Tteokbokki', count: 1 }, { label: 'Chocolate', count: 1 }, { label: 'Honey Butter', count: 1 } ], },
  { id: 'type', title: 'Tipo', type: 'checkbox', options: [{ label: 'Rice Cake', count: 1 }, { label: 'Sticks', count: 1 }, { label: 'Chips', count: 1 } ], },
  priceRangeFilter,
];

export const getFiltersForCategory = async (categoryName: string): Promise<Filter[]> => {
  console.log(`API (Mock): Obteniendo filtros para la categoría: ${categoryName}`);
  await networkDelay(350); 
  
  switch (categoryName.toLowerCase()) { 
    case 'k-beauty': 
      return kBeautyFilters;
    case 'k-pop': 
      return kPopFilters;
    case 'snacks': 
      return snackFilters;
    case 'k-fashion': 
      return [priceRangeFilter]; 
    default: 
      return []; 
  }
};
/**
 * Obtiene todos los pedidos (orders) de un usuario específico.
 */
export const getOrdersForUser = async (userId: string): Promise<Order[]> => {
  console.log(`API REAL: Obteniendo pedidos para el usuario: ${userId}`);
  await networkDelay(600); // Simula carga
  
  // 1. Apunta a la colección 'orders'
  const ordersCollection = collection(db, "orders");
  
  // 2. Crea una consulta para encontrar donde 'userId' coincida
  const q = query(ordersCollection, where("userId", "==", userId));
  
  const querySnapshot = await getDocs(q);
  
  const orders: Order[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Order;
  });
  
  // (Opcional) Ordena los pedidos del más nuevo al más viejo
  orders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return orders;
};