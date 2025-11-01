import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts y Guardias
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; 

// Páginas Públicas
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage'; 
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import ProductListPage from './pages/ProductListPage';
import { getNewProducts, getOfferProducts } from './services/api';

// 1. ¡Importa la nueva plantilla de página estática!
import GenericTextPage from './pages/GenericTextPage'; 

// Páginas de Autenticación
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas Protegidas (Cliente)
import { ProfilePage, ProfileWelcome, ProfileOrders } from './pages/ProfilePage'; 
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// Páginas Protegidas (Admin)
import AdminAddProduct from './pages/AdminAddProduct'; 
import AdminManageProducts from './pages/AdminManageProducts';
import AdminEditProduct from './pages/AdminEditProduct';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rutas de Autenticación (SIN Layout) === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === Rutas Principales (CON Layout) === */}
        <Route path="/" element={<Layout />}>
          
          {/* --- Rutas Públicas --- */}
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="products/:categoryId" element={<ProductsPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="new" element={<ProductListPage title="Nuevos Lanzamientos" fetchProducts={getNewProducts} />} />
          <Route path="offers" element={<ProductListPage title="Ofertas" fetchProducts={getOfferProducts} />} />
          
          {/* 2. ¡AÑADE LA RUTA DINÁMICA PARA PÁGINAS ESTÁTICAS! */}
          <Route path="page/:slug" element={<GenericTextPage />} />

          {/* --- Rutas Protegidas para Clientes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />}>
              <Route index element={<ProfileWelcome />} /> 
              <Route path="orders" element={<ProfileOrders />} />
            </Route>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
          </Route>
          
          {/* --- Rutas Protegidas para ADMINS --- */}
          <Route element={<AdminRoute />}>
            <Route path="admin/add-product" element={ <AdminAddProduct /> }/>
            <Route path="admin/manage-products" element={ <AdminManageProducts /> }/>
            <Route path="admin/edit-product/:productId" element={ <AdminEditProduct /> }/>
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
