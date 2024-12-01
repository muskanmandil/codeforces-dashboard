import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Text,
  Button,
  ButtonGroup,
  Badge,
  Icon,
} from "@shopify/polaris";
import {
  CalendarIcon,
  ClockIcon,
  CodeIcon,
  ArrowLeftIcon,
  CollectionIcon,
} from "@shopify/polaris-icons";
import { formatDate, formatDuration } from "../utils/formatter";
import { AppContext } from "../context/AppContext";

const ContestDetails = () => {
  const navigate = useNavigate();

  const { contests } = useContext(AppContext);
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const id = parseInt(contestId, 10);
    const selectedContest = contests.find((c) => c.id === id);
    setContest(selectedContest);
  }, [contestId, contests]);

  const formatContestDetail = (label, value, icon) => (
    <div className="flex items-center gap-3 mb-4">
      <Icon source={icon} tone="magic" />
      <div className="flex-1">
        <Text variant="bodyMd" fontWeight="bold">
          {label}
        </Text>
        <Text variant="bodyMd">{value}</Text>
      </div>
    </div>
  );

  const getPhaseBadge = (phase) => {
    switch (phase) {
      case "BEFORE":
        return <Badge tone="info">Upcoming</Badge>;
      case "CODING":
        return <Badge tone="success">Live</Badge>;
      case "FINISHED":
        return <Badge tone="warning">Completed</Badge>;
      default:
        return <Badge>{phase}</Badge>;
    }
  };

  return (
    contest && (
      <Page
        title={contest.name}
        primaryAction={{
          content: "Back to Contests",
          icon: ArrowLeftIcon,
          onAction: () => navigate("/"),
        }}
      >
        <div className="space-y-4">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <Text variant="headingMd" as="h2">
                Contest Details
              </Text>
              {getPhaseBadge(contest.phase)}
            </div>

            {formatContestDetail("Contest Name", contest.name, CodeIcon)}
            {formatContestDetail("Contest Type", contest.type, CollectionIcon)}
            {formatContestDetail(
              "Start Time",
              formatDate(contest.startTimeSeconds),
              CalendarIcon
            )}
            {formatContestDetail(
              "Duration",
              formatDuration(contest.durationSeconds),
              ClockIcon
            )}

            <ButtonGroup>
              <Button
                primary
                url={`https://codeforces.com/contests/${contest.id}`}
                external
              >
                View on Codeforces
              </Button>
            </ButtonGroup>
          </Card>
        </div>
      </Page>
    )
  );
};

export default ContestDetails;
