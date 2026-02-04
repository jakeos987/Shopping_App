import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from './pages/LoginPage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { NavBar } from "./pages/NavBar";
import CartPage from './pages/CartPage'
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminUserPage from "./pages/AdminUserPage";
import ProfilePage from "./pages/ProfilePage";
import Page404 from "./pages/Page404";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserRole } from "./features/user/types";

function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <NavBar />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrderPage />} />
        <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin/products" element={<AdminProductPage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
