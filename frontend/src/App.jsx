import { useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import PaginationProvider from "./contexts/PaginationContext";
import Home from "./components/Home";
import Product from "./components/Product";
import Cart from "./components/Cart";
import User from "./components/User";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/Checkout";
function App() {
  return (
    <>
      <PaginationProvider>
        <NavBar></NavBar>

        <Routes>
          <Route path="/" element={<Home></Home>}>
            {" "}
          </Route>
          <Route path="/cart" element={<Cart></Cart>}></Route>
          <Route
            path="/product/:id"
            element={<ProductDetails></ProductDetails>}
          >
            {" "}
          </Route>
          <Route path="/user" element={<User></User>}>
            {" "}
          </Route>
          <Route path="/home" element={<Navigate to="/"></Navigate>}></Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="*" element={<Welcome />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/checkout" element={<Checkout />} />
        </Routes>
      </PaginationProvider>
    </>
  );
}

export default App;
