const CONTEST_TYPES = [
    { label: "All", value: "All" },
    { label: "ICPC", value: "ICPC" },
    { label: "CF", value: "CF" },
];

const CONTEST_PHASES = [
    { label: "All", value: "All" },
    { label: "Upcoming", value: "BEFORE" },
    { label: "Live", value: "CODING" },
    { label: "Completed", value: "FINISHED" },
];

const SORT_OPTIONS = [
    { label: "Date (New to Old)", value: "date-new-to-old" },
    { label: "Date (Old to New)", value: "date-old-to-new" },
    { label: "Duration (High to Low)", value: "duration-high-to-low" },
    { label: "Duration (Low to High)", value: "duration-low-to-high" },
];

module.exports = { CONTEST_TYPES, CONTEST_PHASES, SORT_OPTIONS }
