import React, { useContext } from "react";
import { Select, Button, TextField } from "@shopify/polaris";
import { AppContext } from "../context/AppContext";
import {
  CONTEST_TYPES,
  CONTEST_PHASES,
  SORT_OPTIONS,
} from "../utils/constants";

const Filters = () => {
  const {
    filters,
    setFilters,
    itemsPerPage,
    setItemsPerPage,
    setCurrPage,
    showFavorites,
    setShowFavorites,
  } = useContext(AppContext);

  const setTypeFilter = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: value,
    }));
  };

  const setPhaseFilter = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      phase: value,
    }));
  };

  const setSortBy = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: value,
    }));
  };

  const handleItemsPerPageChange = (value) => {
    const num = parseInt(value);
    if (num >= 5 && num <= 15) {
      setItemsPerPage(num);
      setCurrPage(1);
    }
  };

  return (
    <div className="flex justify-between gap-5 flex-wrap mb-6">
      <div className="flex gap-6 flex-1 items-end">
        <Select
          label="Contest Type"
          options={CONTEST_TYPES}
          onChange={(value) => setTypeFilter(value)}
          value={filters.type}
          tone="magic"
        />
        <Select
          label="Phase"
          options={CONTEST_PHASES}
          onChange={(value) => setPhaseFilter(value)}
          value={filters.phase}
          tone="magic"
        />
        <Button id="fav-btn" onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? "Show All" : "Show Favorites"}
        </Button>
      </div>

      <div className="flex gap-4 justify-end flex-1">
        <Select
          label="Sort"
          options={SORT_OPTIONS}
          onChange={(value) => setSortBy(value)}
          value={filters.sortBy}
        />

        <TextField
          label="Items per Page (5-15)"
          type="number"
          value={itemsPerPage.toString()}
          onChange={(value) => handleItemsPerPageChange(value)}
          id="items-per-page"
        />
      </div>
    </div>
  );
};

export default Filters;
