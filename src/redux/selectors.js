import moment from "moment";
import { rrulestr } from "rrule";

export const getEventsStore = (store) => store.events;

export const getAllEventDetails = (store) => store.calendarEvents;

export const getEventList = (store) => store.eventIds;

export const getActiveEventIds = (store) => {
  const today = moment().utc().second(0).minute(0).hour(0);
  const weekday = today.weekday();
  const events = store.calendarEvents;
  const eventIds = store.eventIds;
  const activeEventIds = [];

  eventIds.forEach((id) => {
    const rruleObj = rrulestr(events[id].rrule);
    if (moment(rruleObj.options.until).utc() < today) {
      return;
    }

    const allDates = rruleObj.all();
    const isTodayActive = allDates.find((date) => {
      const momentDate = moment(date).utc();
      return momentDate.weekday() === weekday;
    });

    if (isTodayActive) {
      activeEventIds.push(id);
    }
  });

  return activeEventIds;
};
