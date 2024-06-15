import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice/cartSlice";
import { applyMiddleware, createStore } from "redux";

import { thunk } from "redux-thunk";

// 2
const store = createStore(cartSlice.reducer, applyMiddleware(thunk));
export default store;
