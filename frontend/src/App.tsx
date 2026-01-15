import { useState } from "react";
import  RegisterPage  from "./pages/RegisterPage";
import  LoginPage  from './pages/LoginPage';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage/>} />
      {/* <Route path="" /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
