import React, { useContext } from "react";
import { Page } from "@shopify/polaris";
import { AppContext } from "../context/AppContext";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ContestChart from "../components/ContestChart";
import ContestTable from "../components/ContestTable";
import TablePagination from "../components/TablePagination";

const Contests = () => {
  const { filteredContests, currContests, loading } = useContext(AppContext);

  return (
    <Page title="Contests">
      <div>
        <SearchBar />
        <Filters />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredContests.length === 0 ? (
        <p>No contests found with the given filters.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <ContestChart
            data={currContests.map((contest) => ({
              name: contest.name,
              durationSeconds: contest.durationSeconds,
            }))}
          />
          <div className="flex flex-col gap-2 mb-12">
            <ContestTable />
            <TablePagination />
          </div>
        </div>
      )}
    </Page>
  );
};

export default Contests;
