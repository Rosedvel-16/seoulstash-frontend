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
import ProductListPage from './pages/ProductListPage';
import { getNewProducts, getOfferProducts } from './services/api';
import SearchPage from './pages/SearchPage';
import AdminManageProducts from './pages/AdminManageProducts';

// 1. ¡Importa la nueva página de "Editar"!
import AdminEditProduct from './pages/AdminEditProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas Públicas (CON Header y Footer) === */}
        <Route path="/" element={<Layout />}>
          
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="products/:categoryId" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="new" element={<ProductListPage title="Nuevos Lanzamientos" fetchProducts={getNewProducts} />} />
          <Route path="offers" element={<ProductListPage title="Ofertas" fetchProducts={getOfferProducts} />} />

          {/* === Ruta Protegida para Clientes === */}
          <Route path="profile" element={ <ProtectedRoute> <ProfilePage /> </ProtectedRoute> }>
            <Route index element={<ProfileWelcome />} /> 
            <Route path="orders" element={<ProfileOrders />} />
          </Route>
          
          {/* === Rutas Protegidas para ADMINS === */}
          <Route path="admin/add-product" element={ <AdminRoute> <AdminAddProduct /> </AdminRoute> }/>
          <Route path="admin/manage-products" element={ <AdminRoute> <AdminManageProducts /> </AdminRoute> }/>
          
          {/* 2. ¡NUEVA RUTA DE ADMIN PARA EDITAR! */}
          {/* Debe tener el ':productId' para que sea dinámica */}
          <Route 
            path="admin/edit-product/:productId" 
            element={ <AdminRoute> <AdminEditProduct /> </AdminRoute> }
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