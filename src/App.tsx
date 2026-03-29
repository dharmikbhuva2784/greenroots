import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// Customer Pages
import Home from '@/pages/customer/Home';
import Shop from '@/pages/customer/Shop';
import ProductDetail from '@/pages/customer/ProductDetail';
import Cart from '@/pages/customer/Cart';
import Checkout from '@/pages/customer/Checkout';
import OrderSuccess from '@/pages/customer/OrderSuccess';
import OrderTracking from '@/pages/customer/OrderTracking';
import Profile from '@/pages/customer/Profile';
import About from '@/pages/customer/About';
import FAQs from '@/pages/customer/FAQs';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';
import AdminCategories from '@/pages/admin/Categories';
import AdminAnalytics from '@/pages/admin/Analytics';

// Auth Pages
import Login from '@/pages/Login';

// Components
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import CartDrawer from '@/components/customer/CartDrawer';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      />
      
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <Home />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/shop" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <Shop />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <ProductDetail />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/cart" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <Cart />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="min-h-screen">
                <Checkout />
              </main>
              <Footer />
              <CartDrawer />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/order-success" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="min-h-screen">
                <OrderSuccess />
              </main>
              <Footer />
              <CartDrawer />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/track-order" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <OrderTracking />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main className="min-h-screen">
                <Profile />
              </main>
              <Footer />
              <CartDrawer />
            </>
          </ProtectedRoute>
        } />
        
        <Route path="/about" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <About />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        <Route path="/faqs" element={
          <>
            <Navbar />
            <main className="min-h-screen">
              <FAQs />
            </main>
            <Footer />
            <CartDrawer />
          </>
        } />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
