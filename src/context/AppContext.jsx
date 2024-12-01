import React, { createContext, useState, useEffect, useMemo } from "react";

export const AppContext = createContext();

export const ContestProvider = ({ children }) => {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);

  const [currPage, setCurrPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    type: "All",
    phase: "All",
    sortBy: "date-new-to-old",
  });

  const [favorites, setFavorites] = useState(
    JSON.parse(sessionStorage.getItem("favoriteContests")) || []
  );
  const [showFavorites, setShowFavorites] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      try {
        const cachedData = JSON.parse(localStorage.getItem("contestsCache"));
        const cacheTimestamp = localStorage.getItem("cacheTimestamp");

        const cacheDuration = 60 * 60 * 1000; // 1 hour
        if (cachedData && Date.now() - cacheTimestamp < cacheDuration) {
          setContests(cachedData);
          console.log("Using cached contests");
          return;
        }

        const response = await fetch(
          "https://codeforces.com/api/contest.list",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "OK") {
          setContests(data.result);

          localStorage.setItem("contestsCache", JSON.stringify(data.result));
          localStorage.setItem("cacheTimestamp", Date.now());
        } else {
          throw new Error("Failed to fetch contests");
        }
      } catch (err) {
        alert("Error fetching contests");
        console.error("Error fetching contests:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const processedContests = useMemo(() => {
    let result = [...contests];
    if (filters.type !== "All") {
      result = result.filter((contest) => contest.type === filters.type);
    }
    if (filters.phase !== "All") {
      result = result.filter((contest) => contest.phase === filters.phase);
    }
    result = result.filter((contest) =>
      contest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filters.sortBy === "date-new-to-old") {
      result.sort((a, b) => b.startTimeSeconds - a.startTimeSeconds);
    } else if (filters.sortBy === "date-old-to-new") {
      result.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    } else if (filters.sortBy === "duration-high-to-low") {
      result.sort((a, b) => b.durationSeconds - a.durationSeconds);
    } else if (filters.sortBy === "duration-low-to-high") {
      result.sort((a, b) => a.durationSeconds - b.durationSeconds);
    }

    if (showFavorites) {
      result = result.filter((contest) => favorites.includes(contest.id));
    }
    return result;
  }, [contests, filters, searchQuery, showFavorites, favorites]);

  useEffect(() => {
    setFilteredContests(processedContests);
    setCurrPage(1);
  }, [processedContests]);

  const toggleFavorite = (contestId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.includes(contestId)
        ? prevFavorites.filter((id) => id !== contestId)
        : [...prevFavorites, contestId];
      sessionStorage.setItem(
        "favoriteContests",
        JSON.stringify(updatedFavorites)
      );
      return updatedFavorites;
    });
  };

  const lastIdx = currPage * itemsPerPage;
  const firstIdx = lastIdx - itemsPerPage;
  const currContests = filteredContests.slice(firstIdx, lastIdx);

  return (
    <AppContext.Provider
      value={{
        contests,
        filteredContests,
        currPage,
        setCurrPage,
        itemsPerPage,
        setItemsPerPage,
        filters,
        setFilters,
        favorites,
        setFavorites,
        showFavorites,
        setShowFavorites,
        searchQuery,
        setSearchQuery,
        toggleFavorite,
        loading,
        firstIdx,
        lastIdx,
        currContests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
