import { ADD_EVENT, TOGGLE_EVENT, RESTORE_EVENTS } from "./actionTypes";

export const restoreEvents = (calendarEvents, eventIds) => ({
  type: RESTORE_EVENTS,
  payload: {
    calendarEvents,
    eventIds
  },
});

export const addEvent = (calEv) => ({
  type: ADD_EVENT,
  payload: {
    calEv,
  },
});

export const toggleEvent = (id, isComplete) => ({
  type: TOGGLE_EVENT,
  payload: { id, isComplete },
});
