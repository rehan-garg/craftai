import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PublicLayout from '../layouts/PublicLayout';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProductStudio from '../pages/ProductStudio/ProductStudio';
import Marketplace from '../pages/Marketplace/Marketplace';
import Analytics from '../pages/Analytics/Analytics';
import Profile from '../pages/Profile/Profile';
import SavedProducts from '../pages/SavedProducts/SavedProducts';
import NotFound from '../pages/NotFound/NotFound';
import { getCurrentUser, isLoggedIn } from '../services/authService';

function AuthGuard({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}

function SellerRoute({ children }) {
  const user = getCurrentUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'Seller') {
    return <Navigate to="/marketplace" replace />;
  }

  return children || <Outlet />;
}

function BuyerRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          <Route element={<SellerRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-studio" element={<ProductStudio />} />
            <Route path="/saved-products" element={<SavedProducts />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route element={<BuyerRoute />}>
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
