import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatDuration } from "../utils/formatter";

const ContestChart = ({ data }) => {
  const processedData = data.map((contest) => ({
    ...contest,
    durationHours: Math.round(contest.durationSeconds / 3600),
    fullDuration: formatDuration(contest.durationSeconds),
    shortName:
      contest.name.length > 20
        ? contest.name.substring(0, 20) + "..."
        : contest.name,
  }));

  return (
    <div
      style={{
        height: "360px",
        marginTop: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="shortName"
            label={{
              value: "Contests",
            }}
            tickFormatter={() => ""}
            height={40}
          />
          <YAxis
            label={{
              value: "Duration (hours)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#666" },
            }}
            tick={{ fill: "#666" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value, name, props) => [
              props.payload.fullDuration,
              "Duration",
            ]}
            labelFormatter={(label) => {
              const fullName = processedData.find(
                (contest) => contest.shortName === label
              )?.name;
              return fullName || label;
            }}
          />
          <Bar
            dataKey="durationHours"
            fill="rgba(128, 81, 255, 1)"
            name="Contest Duration"
            barSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContestChart;
