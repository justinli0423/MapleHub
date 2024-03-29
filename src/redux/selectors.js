import moment from "moment";
import { rrulestr } from "rrule";

// ------- REMINDER ACTIONS -------
export const getEventsStore = (store) => store.events;
export const getAllEventDetails = (store) => store.calendarEvents;
export const getEventList = (store) => store.eventIds;
export const getActiveEventIds = (store) => {
  const today = moment().utc().second(0).minute(0).hour(0);
  const events = store.calendarEvents;
  const eventIds = store.eventIds;
  const activeEventIds = [];

  eventIds.forEach((id) => {
    const rruleObj = rrulestr(events[id].rrule);
    if (moment(rruleObj.options.until).utc() < today) {
      return;
    }
    return activeEventIds.push(id);
  });

  return activeEventIds;
};

// ------- LEGION GRID ACTIONS -------
export const getLegionStore = (store) => store.legion;
export const getOverlayTileIds = (store) => store.overlayTileIds;
export const getOverlayTiles = (store) => store.overlayTiles;
