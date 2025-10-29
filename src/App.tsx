import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa nuestro Layout y nuestras páginas
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage'; 
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';

import { 
  ProfilePage, 
  ProfileWelcome, 
  ProfileOrders 
} from './pages/ProfilePage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          <Route index element={<HomePage />} />
          <Route path="products/:categoryId" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="product/:productId" element={<ProductDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          
          <Route path="profile" element={<ProfilePage />}>
            <Route index element={<ProfileWelcome />} /> 
            <Route path="orders" element={<ProfileOrders />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;