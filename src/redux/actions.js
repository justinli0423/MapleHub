import {
  ADD_EVENT,
  TOGGLE_EVENT,
  RESTORE_EVENTS,
  RESET_EVENTS,
  DELETE_EVENT,
  ADD_TILE,
  REMOVE_TILE,
} from "./actionTypes";

// ------- REMINDER ACTIONS -------
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
  type: RESET_EVENTS,
});

// ------- LEGION GRID ACTIONS -------
export const addLegionTile = (id, position, legion) => ({
  type: ADD_TILE,
  payload: {
    id,
    position,
    legion,
  },
});

export const removeLegionTile = (id) => ({
  type: REMOVE_TILE,
  payload: { id },
});
