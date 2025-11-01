import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage'; 
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import { ProfilePage, ProfileWelcome, ProfileOrders } from './pages/ProfilePage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 
import AdminAddProduct from './pages/AdminAddProduct'; 

// 1. ¡Importa la nueva plantilla de página!
import ProductListPage from './pages/ProductListPage';
// 2. ¡Importa las nuevas funciones de la API!
import { getNewProducts, getOfferProducts } from './services/api';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas Públicas (CON Header y Footer) === */}
        <Route path="/" element={<Layout />}>
          
          <Route index element={<HomePage />} />
          <Route path="products/:categoryId" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          {/* 3. ¡Añade las rutas para "Nuevos" y "Ofertas"! */}
          <Route 
            path="new" 
            element={
              <ProductListPage 
                title="Nuevos Lanzamientos" 
                fetchProducts={getNewProducts} 
              />
            } 
          />
          <Route 
            path="offers" 
            element={
              <ProductListPage 
                title="Ofertas" 
                fetchProducts={getOfferProducts} 
              />
            } 
          />

          {/* === Ruta Protegida para Clientes === */}
          <Route
            path="profile"
            element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> }
          >
            <Route index element={<ProfileWelcome />} /> 
            <Route path="orders" element={<ProfileOrders />} />
          </Route>
          
          {/* === Ruta Protegida para ADMINS === */}
          <Route
            path="admin/add-product"
            element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            }
          />
          
        </Route>
        
        {/* === Rutas de Autenticación (SIN Layout) === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;