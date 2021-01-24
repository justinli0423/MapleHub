import {
  ADD_EVENT,
  TOGGLE_EVENT,
  RESTORE_EVENTS,
  RESET_EVENTS,
  DELETE_EVENT,
} from "./actionTypes";

export const restoreEvents = (calendarEvents, eventIds) => ({
  type: RESTORE_EVENTS,
  payload: {
    calendarEvents,
    eventIds,
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

export const deleteEvent = (id) => ({
  type: DELETE_EVENT,
  payload: { id },
});

export const resetEvents = () => ({
  type: RESET_EVENTS
})