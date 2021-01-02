const NodeNames = {
  H1: 'H1',
  H3: 'H3',
  TEXT: '#text',
  UL: 'UL',
  P: 'P',
  IMG: 'IMG'
}

const Keywords = {
  DATES: 'UTC: ',
  REQUIREMENTS: 'Requirement:',
  REWARDS: 'Reward:',
  PARTS: 'Part',
  END: 'Join the discussion'
}

const EventTypes = {
  PATCH: 'PATCH',
  UPDATE: 'UPDATE',
  SINGLE_EVENT: 'SINGLE_EVENT',
  MULTIPLE_EVENTS: 'MULTIPLE_EVENTS'
}

Object.freeze(NodeNames)
Object.freeze(Keywords)
Object.freeze(EventTypes)

export {
  NodeNames,
  Keywords,
  EventTypes
}
