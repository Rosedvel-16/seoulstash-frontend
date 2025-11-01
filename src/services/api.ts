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
  updateDoc
} from "firebase/firestore";
import type { Product, Category, Filter, SelectedFilters } from '../types';

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- FUNCIONES DE LECTURA DE FIRESTORE ---

export const getProducts = async (
  categoryName: string | null,
  activeFilters: SelectedFilters = {}
): Promise<Product[]> => {
  console.log(`API REAL: Obteniendo productos... (Categoría: ${categoryName})`);
  console.log("Filtros activos:", activeFilters);
  await networkDelay(500); 

  const productsCollection = collection(db, "products");
  const queryConstraints: QueryConstraint[] = [];
  if (categoryName) {
    queryConstraints.push(where("category", "==", categoryName));
  }
  
  const q = query(productsCollection, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  let products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });
  
  if (Object.keys(activeFilters).length > 0) {
    products = products.filter(product => {
      return Object.keys(activeFilters).every(filterId => {
        const selectedOptions = activeFilters[filterId];
        if (selectedOptions.length === 0) return true; 
        return selectedOptions.some(optionLabel => 
           product.name.toLowerCase().includes(optionLabel.toLowerCase())
        );
      });
    });
  }
  return products;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos destacados...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains-any", ["Best Seller", "Editor's Pick"]));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};

export const getCategories = async (): Promise<Category[]> => {
  console.log('API REAL: Obteniendo categorías...');
  await networkDelay(200); 
  const categoriesCollection = collection(db, "categories");
  const q = query(categoriesCollection); 
  const querySnapshot = await getDocs(q);
  const categories: Category[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  return categories;
};

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

// --- ¡NUEVA FUNCIÓN DE BÚSQUEDA! ---
/**
 * Busca productos por nombre en toda la base de datos.
 */
export const searchProducts = async (queryText: string): Promise<Product[]> => {
  console.log(`API REAL: Buscando productos con query: "${queryText}"`);
  await networkDelay(600); // Simula una búsqueda un poco más lenta

  const normalizedQuery = queryText.toLowerCase();

  // 1. Obtenemos TODOS los productos
  // (Para una app real con > 1000 productos, usaríamos Algolia,
  // pero esto es perfecto para la maqueta)
  const productsCollection = collection(db, "products");
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);
  
  const allProducts: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });

  // 2. Filtramos en el frontend (client-side)
  const filteredProducts = allProducts.filter(product => 
    // Busca en el nombre Y en la categoría
    product.name.toLowerCase().includes(normalizedQuery) ||
    product.category.toLowerCase().includes(normalizedQuery)
  );

  return filteredProducts;
};


// --- FUNCIONES DE ESCRITURA EN FIRESTORE ---

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

export const getNewProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos nuevos...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains", "New"));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};

export const getOfferProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos en oferta...');
  await networkDelay(300); 
  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains-any", ["17% OFF", "20% OFF", "25% OFF", "Sale"]));
  const querySnapshot = await getDocs(q);
  const products: Product[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return products;
};


// --- DATOS MOCK PARA FILTROS ---
// (Sin cambios)

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
    case 'k-beauty': return kBeautyFilters;
    case 'k-pop': return kPopFilters;
    case 'snacks': return snackFilters;
    case 'k-fashion': return [priceRangeFilter]; 
    default: return []; 
  }
};
  
/**
 * Elimina un producto de Firestore usando su ID.
 */
export const deleteProductFromFirestore = async (productId: string) => {
  console.log(`API REAL: Eliminando producto con ID: ${productId}`);
  try {
    // Obtenemos la referencia al documento
    const productDocRef = doc(db, "products", productId);
    // Lo eliminamos
    await deleteDoc(productDocRef);
    console.log("Producto eliminado con éxito.");
  } catch (error) {
    console.error("Error al eliminar producto: ", error);
    throw new Error("No se pudo eliminar el producto de Firestore.");
  }
};

/**
 * Actualiza un producto en Firestore usando su ID y nuevos datos.
 * (¡Lo usaremos en el próximo paso de "Editar"!)
 */
export const updateProductInFirestore = async (productId: string, productData: any) => {
  console.log(`API REAL: Actualizando producto con ID: ${productId}`);
  try {
    const productDocRef = doc(db, "products", productId);
    // Actualizamos el documento con los nuevos datos
    await updateDoc(productDocRef, productData);
    console.log("Producto actualizado con éxito.");
  } catch (error) {
    console.error("Error al actualizar producto: ", error);
    throw new Error("No se pudo actualizar el producto en Firestore.");
  }
};