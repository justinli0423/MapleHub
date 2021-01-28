import moment from "moment";
import {
  ADD_EVENT,
  TOGGLE_EVENT,
  RESTORE_EVENTS,
  DELETE_EVENT,
  RESET_EVENTS,
} from "../actionTypes";
import { RRule, rrulestr } from "rrule";
import { LOCAL_STORAGE_EVENT_DETAILS } from "../../common/consts";

const initialState = {
  calendarEvents: {
    lastUpdatedTime: 0,
  },
  eventIds: [],
};

const updateCachedCalendarEvents = (type, data) => {
  window.localStorage.setItem(type, JSON.stringify(data));
};

const resetTodaysEvents = (originalCalEvs, originalEvIds) => {
  const calendarEvents = { ...originalCalEvs };
  const eventIds = originalEvIds.slice();
  const { lastUpdatedTime } = calendarEvents;
  const today = moment().utc().dayOfYear();
  const lastUpdatedDay = moment(lastUpdatedTime).utc().dayOfYear();
  const startOfToday = moment().utc().second(0).minute(0).hour(0);
  const eventTimeStampIndex = eventIds.indexOf("lastUpdatedTime");

  if (eventTimeStampIndex > -1) {
    eventIds.splice(eventTimeStampIndex, 1);
  }

  if (today !== lastUpdatedDay) {
    // new day: check if any events should be reset
    calendarEvents.lastUpdatedTime = Date.now();
    eventIds.forEach((id) => {
      // reset rruleObj start date to today to remove any past dates from list
      const rruleObj = rrulestr(calendarEvents[id].rrule);
      const oldAllDates = rruleObj.all();
      rruleObj.options.dtstart = new Date(startOfToday.valueOf());
      rruleObj.origOptions.dtstart = new Date(startOfToday.valueOf());
      calendarEvents[id].rrule = rruleObj.toString();
      if (calendarEvents[id].isComplete) {
        if (rruleObj.options.freq === RRule.DAILY) {
          calendarEvents[id].isComplete = false;
        } else {
          const allDates = rruleObj.all();
          // rrule.all strips away all unnecessary dates
          // which makes it easy to know when things should reset
          if (oldAllDates.length !== allDates.length) {
            calendarEvents[id].isComplete = false;
          }
        }
      }
    });
  }
  return {
    eventIds,
    calendarEvents,
  };
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_EVENTS: {
      const { calendarEvents, eventIds } = action.payload;
      return {
        ...state,
        ...resetTodaysEvents(calendarEvents, eventIds),
      };
    }
    case RESET_EVENTS: {
      const newEventObject = resetTodaysEvents(
        state.calendarEvents,
        state.eventIds
      );
      updateCachedCalendarEvents(
        LOCAL_STORAGE_EVENT_DETAILS,
        newEventObject.calendarEvents
      );
      return {
        ...state,
        ...newEventObject,
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
