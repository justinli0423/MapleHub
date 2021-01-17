const NodeNames = {
  H1: "H1",
  H3: "H3",
  TEXT: "#text",
  UL: "UL",
  P: "P",
  IMG: "IMG",
};

const Keywords = {
  DATES: "UTC: ",
  REQUIREMENTS: "Requirement:",
  REWARDS: "Reward",
  PARTS: "Part",
  END: "Join the discussion",
};

const EventTypes = {
  PATCH: "PATCH",
  UPDATE: "UPDATE",
  SINGLE_EVENT: "SINGLE_EVENT",
  MULTIPLE_EVENTS: "MULTIPLE_EVENTS",
};

const FilterTypes = {
  MULTIPLE_EVENTS: "MULTIPLE_EVENTS",
  UPDATES_PATCHES: "UPDATES_PATCHES",
  ACTIVE_EVENTS: "ACTIVE_EVENTS",
  PAST_EVENTS: "PAST_EVENTS",
  FUTURE_EVENTS: "FUTURE_EVENTS",
};

const Classes = {
  WARRIOR: "Warrior",
  MAGICIAN: "Magician",
  BOWMAN: "Bowman",
  THIEF: "Thief",
  PIRATE: "Pirate",
  XENON: "Xenon",
  ALL: "All",
};

const LegionRanks = {
  B: "B",
  A: "A",
  S: "S",
  SS: "SS",
  SSS: "SSS",
};

Object.freeze(NodeNames);
Object.freeze(Keywords);
Object.freeze(EventTypes);
Object.freeze(FilterTypes);
Object.freeze(Classes);
Object.freeze(LegionRanks);

export { NodeNames, Keywords, EventTypes, FilterTypes, Classes, LegionRanks };
