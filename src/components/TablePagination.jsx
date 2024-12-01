import React, { useContext } from "react";
import { Pagination } from "@shopify/polaris";
import { AppContext } from "../context/AppContext";

const TablePagination = () => {
  const {
    filteredContests,
    firstIdx,
    lastIdx,
    currPage,
    setCurrPage,
    itemsPerPage,
  } = useContext(AppContext);
  const totalPages = Math.ceil(filteredContests.length / itemsPerPage);

  const handleNextPage = () => {
    if (currPage < totalPages) {
      setCurrPage(currPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };
  const paginationLabel =
    filteredContests.length > 0
      ? `${firstIdx + 1}-${Math.min(lastIdx, filteredContests.length)} of ${
          filteredContests.length
        } contests`
      : "";
  return (
    <Pagination
      type="table"
      label={paginationLabel}
      hasPrevious={currPage > 1}
      onPrevious={handlePreviousPage}
      hasNext={currPage < totalPages}
      onNext={handleNextPage}
    />
  );
};

export default TablePagination;
