import { Toaster } from "react-hot-toast";
import  RegisterPage  from "./pages/RegisterPage";
import  LoginPage  from './pages/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { NavBar } from "./pages/NavBar";
import  CartPage  from './pages/CartPage'
import  CheckoutPage  from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AdminProductPage from "./pages/AdminProductPage";
import AdminUserPage from "./pages/AdminUserPage";
import ProfilePage from "./pages/ProfilePage";


function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
      <NavBar />
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrderPage/>}/>
      <Route path="/admin/products" element={<AdminProductPage/>}/>
      <Route path="/admin/users" element={<AdminUserPage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
