import { db } from './firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where,
  addDoc,
  QueryConstraint
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
  
  // 1. Obtenemos los productos que coinciden con la CATEGORÍA
  const q = query(productsCollection, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  
  let products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });
  
  // 2. Si hay filtros activos, filtramos esos resultados
  if (Object.keys(activeFilters).length > 0) {
    products = products.filter(product => {
      
      // Lógica 'every': El producto debe coincidir con TODOS los grupos de filtros
      // (ej. Sabor Y Tipo)
      return Object.keys(activeFilters).every(filterId => {
        const selectedOptions = activeFilters[filterId];
        
        // Si no hay nada seleccionado en este grupo (ej. 'Tipo' está vacío),
        // el producto pasa este filtro.
        if (selectedOptions.length === 0) {
          return true;
        }

        // --- ¡LÓGICA CORREGIDA! ---
        // (Quitamos el 'if (filterId === ...)' que causaba el error)
        // Ahora esta lógica se aplica a 'brand', 'group', 'flavor', 'type', etc.
        
        // Lógica 'some': El producto debe coincidir con CUALQUIERA de las
        // opciones marcadas (ej. "Tteokbokki" O "Chocolate")
        return selectedOptions.some(optionLabel => 
           product.name.toLowerCase().includes(optionLabel.toLowerCase())
        );
      });
    });
  }

  console.log("Productos filtrados:", products.length);
  return products;
};

// ... (El resto del archivo no cambia)

export const getFeaturedProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos destacados...');
  await networkDelay(300); 

  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains-any", ["Best Seller", "Editor's Pick"]));
  const querySnapshot = await getDocs(q);
  
  const products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });
  return products;
};

export const getCategories = async (): Promise<Category[]> => {
  console.log('API REAL: Obteniendo categorías...');
  await networkDelay(200); 
  
  const categoriesCollection = collection(db, "categories");
  const q = query(categoriesCollection); 
  const querySnapshot = await getDocs(q);
  
  const categories: Category[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Category;
  });
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


// --- DATOS MOCK PARA FILTROS (Corregidos en el paso anterior) ---

const priceRangeFilter: Filter = {
  id: 'price',
  title: 'Rango de Precio',
  type: 'priceRange',
  min: 0,
  max: 100
};
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
  { 
    id: 'flavor', // Sabor
    title: 'Sabor', 
    type: 'checkbox', 
    options: [
      { label: 'Tteokbokki', count: 1 },
      { label: 'Chocolate', count: 1 },
      { label: 'Honey Butter', count: 1 } 
    ], 
  },
  { 
    id: 'type', // Tipo
    title: 'Tipo', 
    type: 'checkbox', 
    options: [
      { label: 'Rice Cake', count: 1 },
      { label: 'Sticks', count: 1 },
      { label: 'Chips', count: 1 }
    ], 
  },
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
 * Obtiene solo los productos con el tag "New"
 * ¡Lee desde Firestore!
 */
export const getNewProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos nuevos...');
  await networkDelay(300); 

  const productsCollection = collection(db, "products");
  const q = query(productsCollection, where("tags", "array-contains", "New"));

  const querySnapshot = await getDocs(q);
  
  const products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });

  return products;
};

/**
 * Obtiene solo los productos con tags de "Oferta"
 * ¡Lee desde Firestore!
 */
export const getOfferProducts = async (): Promise<Product[]> => {
  console.log('API REAL: Obteniendo productos en oferta...');
  await networkDelay(300); 

  const productsCollection = collection(db, "products");
  // Busca productos que tengan CUALQUIERA de estos tags
  const q = query(productsCollection, where("tags", "array-contains-any", [
    "17% OFF",
    "20% OFF",
    "25% OFF",
    "Sale" // Un tag genérico por si acaso
  ]));

  const querySnapshot = await getDocs(q);
  
  const products: Product[] = querySnapshot.docs.map(doc => {
    return { id: doc.id, ...doc.data() } as Product;
  });

  return products;
};