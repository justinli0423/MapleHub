import moment from "moment";
import { rrulestr } from "rrule";

export const getEventsStore = (store) => store.events;

export const getAllEventDetails = (store) => store.calendarEvents;

export const getEventList = (store) => store.eventIds;

export const getActiveEventIds = (store) => {
  const today = moment().utc().day(6).second(0).minute(0).hour(0);
  const endOfToday = moment().utc().day(6).second(59).minute(59).hour(23);
  const weekday = today.weekday();
  const events = store.calendarEvents;
  const eventIds = store.eventIds;
  const activeEventIds = [];

  eventIds.forEach((id) => {
    const rruleObj = rrulestr(events[id].rrule);
    if (moment(rruleObj.options.until).utc() < today) {
      return;
    }

    // query for first date that either matches the weekday
    // or skip if the dates aren't matching
    const allDates = rruleObj.all();
    for (let i = 0; i < allDates.length; i++) {
      const date = moment(allDates[i]).utc();
      if (date > endOfToday) {
        return;
      }
      if (date.weekday() === weekday) {
        return activeEventIds.push(id);
      }
    }
  });

  return activeEventIds;
};
