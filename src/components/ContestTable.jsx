import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, DataTable } from "@shopify/polaris";
import { StarIcon, StarFilledIcon } from "@shopify/polaris-icons";
import { AppContext } from "../context/AppContext";
import { formatPhase, formatDuration, formatDate } from "../utils/formatter";

const ContestTable = () => {
  const { favorites, toggleFavorite, currContests } = useContext(AppContext);

  const rows = currContests.map((contest) => [
    <Link to={`/contest/${contest.id}`} key={`name-${contest.id}`}>
      {contest.name}
    </Link>,
    contest.type,
    formatPhase(contest.phase),
    formatDuration(contest.durationSeconds),
    formatDate(contest.startTimeSeconds),
    <Button
      tone="success"
      onClick={() => toggleFavorite(contest.id)}
      key={`fav-${contest.id}`}
      children={
        favorites.includes(contest.id) ? (
          <Icon source={StarFilledIcon} tone="magic" />
        ) : (
          <Icon source={StarIcon} tone="magic" />
        )
      }
    />,
  ]);

  return (
    <DataTable
      columnContentTypes={["text", "text", "text", "text", "text", "text"]}
      headings={["Name", "Type", "Phase", "Duration", "Start Time", ""]}
      rows={rows}
      hoverable={true}
      stickyHeader={true}
    />
  );
};

export default ContestTable;
