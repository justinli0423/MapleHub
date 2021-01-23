import { RRule } from 'rrule'

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
  Mondays: [RRule.MO],
  Tuesdays: [RRule.TU],
  Wednesdays: [RRule.WE],
  Thursdays: [RRule.TH],
  Fridays: [RRule.FR],
  Saturdays: [RRule.SA],
  Sundays: [RRule.SU],
  Weekdays: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
  Weekends: [RRule.SA, RRule.SU],
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
  { id: "spaceTaker", numeric: false, label: "" },
  {
    id: "isComplete",
    numeric: false,
    label: "Completed?",
  },
];

const allEventsColumns = [
  { id: "eventTitle", label: "Event", numeric: false },
  { id: "end", label: "Last Day", numeric: false },
  { id: "occurences", label: "Remind Me", numeric: false },
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
