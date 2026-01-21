import { useState } from "react";
import  RegisterPage  from "./pages/RegisterPage";
import  LoginPage  from './pages/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { NavBar } from "./pages/NavBar";
import  CartPage  from './pages/CartPage'
import  CheckoutPage  from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";

function App() {

  return (
    <BrowserRouter>
      <NavBar />
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="orders" element={<OrderPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
