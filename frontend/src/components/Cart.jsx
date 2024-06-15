import React from "react";
import ProductList from "../components/ProductList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Cart() {
  const productList = useSelector((store) => {
    return store.cartProducts;
  });
  const navigate = useNavigate();
  return (
    <>
      <h1>Cart</h1>
      <h2>Add Products to List</h2>
      <div className="cart_product_wrapper">
        <ProductList productList={productList}></ProductList>
      </div>
      <div className="buy_footer">
        <button
          onClick={() => {
            navigate("/checkout");
          }}
        >
          Buy Products
        </button>
      </div>
    </>
  );
}

export default Cart;
