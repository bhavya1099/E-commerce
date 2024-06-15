export default function basicOps(
  products,
  searchTerm,
  sortDir,
  currCategory,
  pageNum,
  pageSize
) {
  if (products == null) {
    return;
  }
  /*************filtering -> hiding  products*************/
  let filteredArr = products;
  if (searchTerm != "") {
    filteredArr = filteredArr.filter((product) => {
      let lowerSearchTerm = searchTerm.toLowerCase();
      let lowerTitle = product.title.toLowerCase();
      return lowerTitle.includes(lowerSearchTerm);
    });
  }
  /***********************sorting -> rearrange**********************************/
  let filteredSortedArr = filteredArr;
  if (sortDir != 0) {
    // increasing
    if (sortDir == 1) {
      filteredSortedArr = filteredSortedArr.sort(incComparator);
    }
    //    decreasing order
    else {
      filteredSortedArr = filteredSortedArr.sort(decComparator);
    }
  }

  /**************************categorization**********************************************/
  let filteredSortedgroupByArr = filteredSortedArr;
  console.log("filteredSortedgroupByArr", filteredSortedgroupByArr, pageSize);
  let totalPages = Math.ceil(filteredSortedgroupByArr.length / pageSize);
  if (currCategory != "All categories") {
    filteredSortedgroupByArr = filteredSortedgroupByArr.filter((product) => {
      return product.category == currCategory;
    });
  }
  let sidx = (pageNum - 1) * pageSize;
  let eidx = sidx + pageSize;
  filteredSortedgroupByArr = filteredSortedgroupByArr.slice(sidx, eidx);
  console.log("filtered totalPages", filteredSortedgroupByArr, totalPages);
  let object = {
    filteredSortedgroupByArr: filteredSortedgroupByArr,
    totalPages: totalPages,
  };
  return object;
}

// total elem /elemperPage-> totalNumPages

function incComparator(product1, product2) {
  if (product1.price > product2.price) {
    return 1;
  } else {
    return -1;
  }
}
function decComparator(product1, product2) {
  if (product1.price < product2.price) {
    return 1;
  } else {
    return -1;
  }
}
