import React, { useState, useEffect } from "react";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProductList from "./ProductList";
import Categories from "./Categories";
import basicOps from "../utility/basicOps";
import { usePaginationContext } from "../contexts/PaginationContext";

function Home() {
  // preserver -> pagination
  /***single source of truth for all the products***/
  const [products, setProducts] = useState(null);
  /************ all the categories -> a product**********/
  const [categories, setCategories] = useState([]);
  /**********Action***********/
  /*********************** state ->term with which you want to filter the product list*****************************/
  const [searchTerm, setSearchTerm] = useState("");
  /**************************sort : 0: unsorted, 1: increasing order, -1: decreasing order ************************************/
  const [sortDir, setsortDir] = useState(0);
  /**************************** currcategory: category group you result **********************************/
  const [currCategory, setCurrCategory] = useState("All categories");

  // const [pageSize, setPageSize] = useState(4);
  // const [pageNum, setPageNum] = useState(1);
  const { pageSize, pageNum, setPageNum, setPageSize } = usePaginationContext();
  // const [currentPage,setCurrentPage] = useState(1);
  // page number and page size
  //const { pageSize, pageNum, setPageNum, setPageSize } = usePaginationContext();
  /****************get all the products*********************/
  useEffect(() => {
    (async function () {
      const resp = await fetch(`https://fakestoreapi.com/products`);
      const productData = await resp.json();
      setProducts(productData);
    })();
  }, []);

  /**************getting all the categories ********************/
  useEffect(() => {
    (async function () {
      const resp = await fetch(`https://fakestoreapi.com/products/categories`);
      const categoriesData = await resp.json();
      setCategories(categoriesData);
    })();
  }, []);
  console.log("products", products, pageSize);
  const object = basicOps(
    products,
    searchTerm,
    sortDir,
    currCategory,
    pageNum,
    pageSize
  );

  console.log("object", object);
  const filteredSortedgroupByArr =
    object === undefined ? null : object.filteredSortedgroupByArr;
  const totalPages = object === undefined ? 1 : object.totalPages;
  console.log("totalPages", totalPages);
  return (
    <>
      {/* header */}
      <header className="nav_wrapper">
        <div className="search_sortWrapper">
          <input
            className="search_input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <div className="icons_container">
            <ArrowCircleUpIcon
              style={{ color: "white" }}
              fontSize="large"
              onClick={() => {
                setsortDir(1);
              }}
            ></ArrowCircleUpIcon>
            <ArrowCircleDownIcon
              fontSize="large"
              style={{ color: "white" }}
              onClick={() => {
                setsortDir(-1);
              }}
            ></ArrowCircleDownIcon>
          </div>
        </div>

        <div className="categories_wrapper">
          <Categories
            categories={categories}
            setCurrCategory={setCurrCategory}
          ></Categories>
        </div>
      </header>

      {/* main area  */}
      <main>
        <ProductList productList={filteredSortedgroupByArr}></ProductList>
      </main>
      <div className="pagination">
        <button
          onClick={() => {
            if (pageNum !== 1) setPageNum((pageNum) => pageNum - 1);
          }}
          disabled={pageNum == 1 ? true : false}
        >
          <KeyboardArrowLeftIcon
            style={{ color: "black" }}
            fontSize="large"
          ></KeyboardArrowLeftIcon>
        </button>

        {pageNum}
        <button
          onClick={() => {
            console.log("pageNum", pageNum, totalPages);
            if (pageNum !== totalPages) setPageNum((pageNum) => pageNum + 1);
          }}
          disabled={pageNum == totalPages ? true : false}
        >
          <ChevronRightIcon
            style={{ color: "black" }}
            fontSize="large"
            // onClick={() => {
            //   if (totalPages === pageNum) setPageNum((pageNum) => pageNum + 1);
            // }}
          ></ChevronRightIcon>
        </button>
      </div>
    </>
  );
}

export default Home;

/***
 * 1. Steps/
 *  - INtial Data
 *  a. Searching
 *  b. Sorting
 *  c. Categorization
 *  d. Pagination
 *  e. Render the Results
 *
 * 2. Data
 *      1. Products
 *      2. Categories
 *
 *
 * **/
