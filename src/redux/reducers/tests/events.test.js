import reducer from "../index";
import * as types from "../../actionTypes";
import MockDate from "mockdate";
import moment from "moment";
import { RRule } from "rrule";

import { rruleOptions } from "../../../todoUtils/consts";

MockDate.set("2021-01-01");
const startDate = new Date(Date.now());
MockDate.set("2021-02-28");
const endDate = new Date(Date.now());

const completeStore = {
  events: {
    calendarEvents: {
      lastUpdatedTime: new Date("2021-01-12").valueOf(),
      [`monday`]: {
        id: `monday`,
        subject: "monday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Mondays,
        }).toString(),
      },
      [`tuesday`]: {
        id: `tuesday`,
        subject: "tuesday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Tuesdays,
        }).toString(),
      },
      [`wednesday`]: {
        id: `wednesday`,
        subject: "wednesday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Wednesdays,
        }).toString(),
      },
      [`thursday`]: {
        id: `thursday`,
        subject: "thursday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Thursdays,
        }).toString(),
      },
      [`friday`]: {
        id: `friday`,
        subject: "friday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Fridays,
        }).toString(),
      },
      [`saturday`]: {
        id: `saturday`,
        subject: "saturday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Saturdays,
        }).toString(),
      },
      [`sunday`]: {
        id: `sunday`,
        subject: "sunday",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Sundays,
        }).toString(),
      },
      [`mon/wed/fri/sun`]: {
        id: `mon/wed/fri/sun`,
        subject: "mon/wed/fri/sun",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: [
            rruleOptions.Mondays,
            rruleOptions.Wednesdays,
            rruleOptions.Fridays,
            rruleOptions.Sundays,
          ].flat(),
        }).toString(),
      },
      [`weekdays`]: {
        id: `weekdays`,
        subject: "weekdays",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Weekdays,
        }).toString(),
      },
      [`weekends`]: {
        id: `weekends`,
        subject: "weekends",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: rruleOptions.Weekends,
        }).toString(),
      },
      [`tues/thurs/sat`]: {
        id: `tues/thurs/sat`,
        subject: "tues/thurs/sat",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: [
            rruleOptions.Tuesdays,
            rruleOptions.Thursdays,
            rruleOptions.Saturdays,
          ].flat(),
        }).toString(),
      },
      [`tues/fri`]: {
        id: `tues/fri`,
        subject: "tues/fri",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: startDate,
          until: endDate,
          byweekday: [rruleOptions.Tuesdays, rruleOptions.Fridays].flat(),
        }).toString(),
      },
      [`daily`]: {
        id: `daily`,
        subject: "daily",
        isComplete: true,
        rrule: new RRule({
          freq: RRule.DAILY,
          dtstart: startDate,
          until: endDate,
        }).toString(),
      },
    },
    eventIds: [
      `monday`,
      `tuesday`,
      `wednesday`,
      `thursday`,
      `friday`,
      `saturday`,
      `sunday`,
      `mon/wed/fri/sun`,
      `weekdays`,
      `weekends`,
      `tues/thurs/sat`,
      `tues/fri`,
      `daily`,
    ],
  },
};

describe("event reducer", () => {
  it("should return init state", () => {
    expect(reducer(undefined, {})).toEqual({
      events: {
        calendarEvents: {
          lastUpdatedTime: 0,
        },
        eventIds: [],
      },
    });
  });

  it("should add an event", () => {
    expect(
      reducer(undefined, {
        type: types.ADD_EVENT,
        payload: {
          calEv: {
            id: `eventName`,
            subject: "eventName",
            rrule: new RRule({
              freq: RRule.DAILY,
              dtstart: new Date(),
              until: new Date(),
            }).toString(),
          },
        },
      })
    ).toEqual({
      events: {
        calendarEvents: {
          lastUpdatedTime: 0,
          [`eventName`]: {
            id: `eventName`,
            subject: "eventName",
            rrule: new RRule({
              freq: RRule.DAILY,
              dtstart: new Date(),
              until: new Date(),
            }).toString(),
          },
        },
        eventIds: [`eventName`],
      },
    });
  });

  it("should toggle an event", () => {
    expect(
      reducer(
        {
          events: {
            calendarEvents: {
              lastUpdatedTime: 0,
              [`eventName#${Date.now()}`]: {
                id: `eventName#${Date.now()}`,
                subject: "eventName",
                isComplete: false,
                rrule: new RRule({
                  freq: RRule.DAILY,
                  dtstart: new Date(Date.now()),
                  until: new Date(Date.now()),
                }).toString(),
              },
            },
            eventIds: [`eventName#${Date.now()}`],
          },
        },
        {
          type: types.TOGGLE_EVENT,
          payload: {
            id: `eventName#${Date.now()}`,
          },
        }
      )
    ).toEqual({
      events: {
        calendarEvents: {
          lastUpdatedTime: Date.now(),
          [`eventName#${Date.now()}`]: {
            id: `eventName#${Date.now()}`,
            subject: "eventName",
            isComplete: true,
            rrule: new RRule({
              freq: RRule.DAILY,
              dtstart: new Date(Date.now()),
              until: new Date(Date.now()),
            }).toString(),
          },
        },
        eventIds: [`eventName#${Date.now()}`],
      },
    });
  });

  it("should delete an event", () => {
    expect(
      reducer(
        {
          events: {
            calendarEvents: {
              lastUpdatedTime: 0,
              [`eventName#${Date.now()}`]: {
                id: `eventName#${Date.now()}`,
                subject: "eventName",
                isComplete: false,
                rrule: new RRule({
                  freq: RRule.DAILY,
                  dtstart: new Date(Date.now()),
                  until: new Date(Date.now()),
                }).toString(),
              },
            },
            eventIds: [`eventName#${Date.now()}`],
          },
        },
        {
          type: types.DELETE_EVENT,
          payload: {
            id: `eventName#${Date.now()}`,
          },
        }
      )
    ).toEqual({
      events: {
        calendarEvents: {
          lastUpdatedTime: 0,
        },
        eventIds: [],
      },
    });
  });

  it("should return the proper store", () => {
    expect(reducer(completeStore, {})).toEqual(completeStore);
  });

  it("should toggle a specific to false", () => {
    expect(
      reducer(completeStore, {
        type: types.TOGGLE_EVENT,
        payload: {
          id: `daily`,
        },
      })
    ).toEqual({
      events: {
        ...completeStore.events,
        calendarEvents: {
          ...completeStore.events.calendarEvents,
          lastUpdatedTime: Date.now(),
          [`daily`]: {
            id: `daily`,
            subject: "daily",
            isComplete: false,
            rrule: new RRule({
              freq: RRule.DAILY,
              dtstart: startDate,
              until: endDate,
            }).toString(),
          },
        },
      },
    });
    expect(
      reducer(completeStore, {
        type: types.TOGGLE_EVENT,
        payload: {
          id: `daily`,
          isComplete: false,
        },
      })
    ).toEqual({
      events: {
        ...completeStore.events,
        calendarEvents: {
          ...completeStore.events.calendarEvents,
          lastUpdatedTime: Date.now(),
          [`daily`]: {
            id: `daily`,
            subject: "daily",
            isComplete: false,
            rrule: new RRule({
              freq: RRule.DAILY,
              dtstart: startDate,
              until: endDate,
            }).toString(),
          },
        },
      },
    });
  });

  it("should reset the proper events when daily reset (monday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-18");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(false);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(false);
    expect(results[`weekdays`].isComplete).toEqual(false);
    expect(results[`weekends`].isComplete).toEqual(true);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(true);
    expect(results[`tues/fri`].isComplete).toEqual(true);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (tuesday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-19");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(false);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(true);
    expect(results[`weekdays`].isComplete).toEqual(false);
    expect(results[`weekends`].isComplete).toEqual(true);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(false);
    expect(results[`tues/fri`].isComplete).toEqual(false);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (wednesday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));
    MockDate.set("2021-01-20");
    moment.now = function () {
      return new Date(Date.now());
    };

    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(false);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(false);
    expect(results[`weekdays`].isComplete).toEqual(false);
    expect(results[`weekends`].isComplete).toEqual(true);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(true);
    expect(results[`tues/fri`].isComplete).toEqual(true);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (thursday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-21");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(false);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(true);
    expect(results[`weekdays`].isComplete).toEqual(false);
    expect(results[`weekends`].isComplete).toEqual(true);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(false);
    expect(results[`tues/fri`].isComplete).toEqual(true);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (friday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-22");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(false);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(false);
    expect(results[`weekdays`].isComplete).toEqual(false);
    expect(results[`weekends`].isComplete).toEqual(true);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(true);
    expect(results[`tues/fri`].isComplete).toEqual(false);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (saturday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-23");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(false);
    expect(results[`sunday`].isComplete).toEqual(true);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(true);
    expect(results[`weekdays`].isComplete).toEqual(true);
    expect(results[`weekends`].isComplete).toEqual(false);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(false);
    expect(results[`tues/fri`].isComplete).toEqual(true);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should reset the proper events when daily reset (sunday events)", () => {
    const copyOfStore = JSON.parse(JSON.stringify(completeStore));

    MockDate.set("2021-01-24");
    moment.now = function () {
      return new Date();
    };
    const results = reducer(copyOfStore, {
      type: types.RESET_EVENTS,
    }).events.calendarEvents;

    expect(results.lastUpdatedTime).toStrictEqual(Date.now());
    expect(results[`monday`].isComplete).toEqual(true);
    expect(results[`tuesday`].isComplete).toEqual(true);
    expect(results[`wednesday`].isComplete).toEqual(true);
    expect(results[`thursday`].isComplete).toEqual(true);
    expect(results[`friday`].isComplete).toEqual(true);
    expect(results[`saturday`].isComplete).toEqual(true);
    expect(results[`sunday`].isComplete).toEqual(false);
    expect(results[`mon/wed/fri/sun`].isComplete).toEqual(false);
    expect(results[`weekdays`].isComplete).toEqual(true);
    expect(results[`weekends`].isComplete).toEqual(false);
    expect(results[`tues/thurs/sat`].isComplete).toEqual(true);
    expect(results[`tues/fri`].isComplete).toEqual(true);
    expect(results[`daily`].isComplete).toEqual(false);
  });

  it("should delete a specific event", () => {
    const removedStore = JSON.parse(JSON.stringify(completeStore));
    delete removedStore.events.calendarEvents[`daily`];
    removedStore.events.eventIds.splice(
      removedStore.events.eventIds.indexOf(`daily`),
      1
    );

    expect(
      reducer(completeStore, {
        type: types.DELETE_EVENT,
        payload: {
          id: `daily`,
        },
      })
    ).toEqual({
      events: {
        ...removedStore.events,
        calendarEvents: {
          ...removedStore.events.calendarEvents,
        },
        eventIds: removedStore.events.eventIds,
      },
    });
  });
});
