import React, { useContext, useState, useEffect } from "react";
import { TextField, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { AppContext } from "../context/AppContext";

const SearchBar = () => {
  const { setSearchQuery } = useContext(AppContext);

  const [tempSearchQuery, setTempSearchQuery] = useState("");

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchQuery(tempSearchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [tempSearchQuery, setSearchQuery]);

  return (
    <div className="mb-6">
      <TextField
        inputMode="search"
        type="search"
        placeholder="Search Contests by Name"
        value={tempSearchQuery}
        onChange={(newValue) => setTempSearchQuery(newValue)}
        prefix={<Icon source={SearchIcon} />}
        variant="borderless"
        tone="magic"
        id="search-bar"
      />
    </div>
  );
};

export default SearchBar;
