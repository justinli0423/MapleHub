const repeatableOptions = {
  Everyday: "Everyday",
  Weekdays: "Weekdays",
  Weekends: "Weekends",
  Mondays: "Mondays",
  Tuesdays: "Tuesdays",
  Wednesdays: "Wednesdays",
  Thursdays: "Thursdays",
  Fridays: "Fridays",
  Saturdays: "Saturdays",
  Sundays: "Sundays",
};

const rruleOptions = {
  Mondays: ["MO"],
  Tuesdays: ["TU"],
  Wednesdays: ["WE"],
  Thursdays: ["TH"],
  Fridays: ["FR"],
  Saturdays: ["SA"],
  Sundays: ["SU"],
  Weekdays: ["MO", "TU", "WE", "TH", "FR"],
  Weekends: ["SA", "SU"],
};

const weekdays = [
  repeatableOptions.Mondays,
  repeatableOptions.Tuesdays,
  repeatableOptions.Wednesdays,
  repeatableOptions.Thursdays,
  repeatableOptions.Fridays,
];
const weekends = [repeatableOptions.Saturdays, repeatableOptions.Sundays];

const todaysColumns = [
  { id: "eventTitle", numeric: false, label: "Event Name" },
  {
    id: "isComplete",
    numeric: false,
    label: "Completed?",
  },
];

const allEventsColumns = [
  { field: "eventTitle", headerName: "Event", width: 400 },
  { field: "endDate", headerName: "Last Day", width: 200 },
  { field: "occurences", headerName: "Remind Me", width: 400 },
];

Object.freeze(repeatableOptions);
Object.freeze(rruleOptions);
Object.freeze(weekdays);
Object.freeze(weekends);
Object.freeze(todaysColumns);
Object.freeze(allEventsColumns);

export {
  repeatableOptions,
  rruleOptions,
  weekdays,
  weekends,
  todaysColumns,
  allEventsColumns,
};
