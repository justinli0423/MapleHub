import moment from "moment";
import {
  ADD_EVENT,
  TOGGLE_EVENT,
  RESTORE_EVENTS,
  DELETE_EVENT,
  RESET_EVENTS,
} from "../actionTypes";
import { LOCAL_STORAGE_EVENT_DETAILS } from "../../common/consts";

const initialState = {
  calendarEvents: {
    lastUpdatedTime: Date.now(),
  },
  eventIds: [],
};

const updateCachedCalendarEvents = (type, data) => {
  window.localStorage.setItem(type, JSON.stringify(data));
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_EVENTS: {
      const { calendarEvents, eventIds } = action.payload;
      const { lastUpdatedTime } = calendarEvents;
      const today = moment().utc().day();
      const lastUpdatedDay = moment(lastUpdatedTime).utc().day();
      eventIds.splice(eventIds.indexOf("lastUpdatedTime"), 1);

      if (today !== lastUpdatedDay) {
        calendarEvents.lastUpdatedTime = Date.now();
        eventIds.forEach((id) => {
          calendarEvents[id].isComplete = false;
        });
      }

      return {
        ...state,
        calendarEvents,
        eventIds,
      };
    }
    case RESET_EVENTS: {
      const calendarEvents = { ...state.calendarEvents };
      calendarEvents.lastUpdatedTime = Date.now();
      state.eventIds.forEach((id) => {
        calendarEvents[id].isComplete = false;
      });
      return {
        ...state,
        calendarEvents: {
          ...state.calendarEvents,
          lastUpdatedTime: Date.now(),
        },
      };
    }
    case ADD_EVENT: {
      const { calEv } = action.payload;
      const { id } = calEv;
      const updatedStore = {
        ...state,
        eventIds: [...state.eventIds, id],
        calendarEvents: {
          ...state.calendarEvents,
          [id]: {
            ...calEv,
          },
        },
      };
      updateCachedCalendarEvents(
        LOCAL_STORAGE_EVENT_DETAILS,
        updatedStore.calendarEvents
      );
      return updatedStore;
    }
    case TOGGLE_EVENT: {
      const { id, isComplete } = action.payload;
      const updatedStore = {
        ...state,
        calendarEvents: {
          ...state.calendarEvents,
          lastUpdatedTime: Date.now(),
          [id]: {
            ...state.calendarEvents[id],
            isComplete: isComplete ?? !state.calendarEvents[id].isComplete,
          },
        },
      };
      updateCachedCalendarEvents(
        LOCAL_STORAGE_EVENT_DETAILS,
        updatedStore.calendarEvents
      );
      return updatedStore;
    }
    case DELETE_EVENT: {
      const { id } = action.payload;
      const calendarEvents = { ...state.calendarEvents };
      const eventIds = state.eventIds.slice();
      const eventIndex = eventIds.indexOf(id);
      if (eventIndex > -1) {
        eventIds.splice(eventIndex, 1);
      }
      delete calendarEvents[id];

      updateCachedCalendarEvents(LOCAL_STORAGE_EVENT_DETAILS, calendarEvents);
      return {
        calendarEvents,
        eventIds,
      };
    }
    default:
      return state;
  }
};

export default events;
