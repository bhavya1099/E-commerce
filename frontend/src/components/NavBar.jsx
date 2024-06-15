import React from "react";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
function NavBar() {
  const quantity = useSelector((store) => {
    console.log("store", store);
    return store.cartQuantity;
  });
  return (
    <div className="navbar">
      <Link to="/">Home </Link>
      <Link to="/user">Users</Link>
      <Link to="/cart">
        <div className="cart_container">
          <ShoppingCartIcon></ShoppingCartIcon>
          <div className="cart_quantity">12</div>
        </div>
      </Link>
    </div>
  );
}

export default NavBar;
