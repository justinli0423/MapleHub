import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { RRule } from "rrule";
import moment from "moment";

import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";

import {
  LOCAL_STORAGE_EVENT_NOTES,
  LOCAL_STORAGE_EVENT_DETAILS,
} from "../common/consts";
import ics from "../common/ics";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Button from "../components/common/DefaultButton";

import { toggleEvent, addEvent, restoreEvents } from "../redux/actions";
import {
  getAllEventDetails,
  getEventList,
  getEventsStore,
} from "../redux/selectors";

import {
  repeatableOptions,
  rruleOptions,
  weekdays,
  weekends,
} from "../todoUtils/consts";
import DailyTable from "../todoUtils/DailyTable";
import TotalTable from "../todoUtils/TotalTable";

const filter = createFilterOptions();
const cal = ics();

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
      newEventRepeat: [repeatableOptions.Everyday],
    };
  }

  componentDidMount() {
    const updateEvents = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_EVENT_NOTES)
    );
    const calendarEvents =
      JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_EVENT_DETAILS)) ??
      {};

    this.props.restoreEvents(calendarEvents, Object.keys(calendarEvents));

    this.setState({
      ...this.state,
      events: (updateEvents && updateEvents.sectionDetails.length
        ? updateEvents.sectionDetails
        : []
      ).filter((event) => event.eventTimes.length && event.eventTimes[1]),
    });
  }

  eventSelectorOnChange = (_, newValue) => {
    if (!newValue) {
      return this.setState({
        ...this.state,
        newEventName: newValue,
      });
    }

    if (typeof newValue === "string") {
      this.setState({
        ...this.state,
        newEventName: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      this.setState({
        ...this.state,
        newEventName: newValue.inputValue,
      });
    } else {
      const eventDetails = this.state.events.find(
        (event) => event.eventName === newValue.eventName
      );
      let newEventStartDate, newEventEndDate;
      if (eventDetails.eventTimes[0].length) {
        // multiEvent
        newEventStartDate = eventDetails.eventTimes[0][0];
        newEventEndDate =
          eventDetails.eventTimes[eventDetails.eventTimes.length - 1][1];
      } else {
        newEventStartDate = eventDetails.eventTimes[0];
        newEventEndDate = eventDetails.eventTimes[1];
      }
      this.setState({
        ...this.state,
        newEventName: newValue,
        newEventStartDate,
        newEventEndDate,
      });
    }
  };

  eventFilterOptions = (options, params) => {
    const filtered = filter(options, params);

    // Suggest the creation of a new value
    if (params.inputValue !== "") {
      filtered.push({
        inputValue: params.inputValue,
        eventName: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  };

  eventGetOptionLabel = (option) => {
    // Value selected with enter, right from the input
    if (typeof option === "string") {
      return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue;
    }
    // Regular option
    return option.eventName;
  };

  setStartDate = (date) => {
    const newEventStartDate = moment(date).second(0).minute(0).hour(0);
    this.setState({
      ...this.state,
      newEventStartDate,
    });
  };

  setEndDate = (date) => {
    const newEventEndDate = moment(date).second(59).minute(59).hour(23);
    this.setState({
      ...this.state,
      newEventEndDate,
    });
  };

  eventRepeatLogic = (selectedDays) => {
    const latestDay = selectedDays[selectedDays.length - 1];
    let newEventRepeat = selectedDays;

    if (latestDay === repeatableOptions.Everyday) {
      newEventRepeat = [repeatableOptions.Everyday];
      return newEventRepeat;
    }

    if (latestDay === repeatableOptions.Weekdays) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          !weekdays.includes(day) && ![repeatableOptions.Everyday].includes(day)
      );
      return newEventRepeat;
    }

    if (latestDay === repeatableOptions.Weekends) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          !weekends.includes(day) && ![repeatableOptions.Everyday].includes(day)
      );
      return newEventRepeat;
    }

    if (weekdays.includes(latestDay)) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          weekdays.concat(weekends).includes(day) ||
          day === repeatableOptions.Weekends
      );
      return newEventRepeat;
    }

    if (weekends.includes(latestDay)) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          weekdays.concat(weekends).includes(day) ||
          day === repeatableOptions.weekdays
      );
      return newEventRepeat;
    }

    return selectedDays;
  };

  handleEventRepeatChange = (ev) => {
    this.setState({
      ...this.state,
      newEventRepeat: this.eventRepeatLogic(ev.target.value),
    });
  };

  handleAddEvent = () => {
    const {
      newEventName,
      newEventStartDate,
      newEventEndDate,
      newEventRepeat,
    } = this.state;

    if (!newEventName || !newEventStartDate || !newEventEndDate) {
      return alert("Please enter all the fields for this event.");
    }

    if (newEventStartDate > newEventEndDate) {
      return alert("Please adjust your dates.");
    }

    const eventIsDaily =
      newEventRepeat[0] === repeatableOptions.Everyday ||
      newEventRepeat.length === 7;
    // TODO: how did newEventName become an object? fix it
    const actualEventName =
      typeof newEventName === "string" ? newEventName : newEventName.eventName;
    if (eventIsDaily) {
      this.props.addEvent({
        id: `${actualEventName.replaceAll(' ', '_')}#${Date.now()}`,
        subject: actualEventName,
        rrule: new RRule({
          freq: RRule.DAILY,
          dtstart: new Date(newEventStartDate),
          until: new Date(newEventEndDate),
        }).toString(),
      });
    } else {
      const repeatArr = newEventRepeat.map((event) => rruleOptions[event]);
      this.props.addEvent({
        id: `${actualEventName.replaceAll(' ', '_')}#${Date.now()}`,
        subject: actualEventName,
        rrule: new RRule({
          freq: RRule.WEEKLY,
          dtstart: new Date(newEventStartDate),
          until: new Date(newEventEndDate),
          byweekday: repeatArr.flat(),
        }).toString(),
      });
    }

    this.setState({
      ...this.state,
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
      newEventRepeat: [repeatableOptions.Everyday],
    });
  };

  render() {
    const {
      events,
      newEventName,
      newEventStartDate,
      newEventEndDate,
      newEventRepeat,
    } = this.state;

    return (
      <>
        <Header src={process.env.PUBLIC_URL + "/todosbanner.jpg"}>
          <Title
            title='Todo List'
            caption='Add dailies, weeklies, and custom events to your calendar.'
          />
        </Header>
        <Container>
          <AddEvents>
            <Autocomplete
              options={events}
              value={newEventName}
              onChange={this.eventSelectorOnChange}
              filterOptions={this.eventFilterOptions}
              getOptionLabel={this.eventGetOptionLabel}
              renderOption={(option) => option.eventName}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              freeSolo
              renderInput={(params) => (
                <StyledTextField {...params} label='Event Name' />
              )}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <StyledKeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='dense'
                label='Start Date'
                value={newEventStartDate}
                onChange={this.setStartDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
              <StyledKeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='dense'
                label='End Date'
                value={newEventEndDate}
                onChange={this.setEndDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <FormControl>
              <InputLabel>Scheduled</InputLabel>
              <Select
                multiple
                value={newEventRepeat}
                onChange={this.handleEventRepeatChange}
                MenuProps={{
                  getContentAnchorEl: () => null,
                }}
                input={<Input style={{ width: 150 }} />}
              >
                {Object.keys(repeatableOptions).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledButton label='Add' callback={this.handleAddEvent} />
          </AddEvents>
          <EventContainer>
            <DailyTable />
          </EventContainer>
          <EventContainer>
            <TotalTable />
          </EventContainer>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const eventStore = getEventsStore(state);
  const calendarEvents = getAllEventDetails(eventStore);
  const eventIds = getEventList(eventStore);
  return {
    calendarEvents,
    eventIds,
  };
};

export default connect(mapStateToProps, {
  addEvent,
  toggleEvent,
  restoreEvents,
})(Events);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 1024px;
  margin: 40px 0;
`;

const EventContainer = styled.div`
  width: 100%;
  height: auto;
  margin: 24px 8px;
`;

const AddEvents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 8px;

  & > * {
    flex: 1 0 20%;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiInputBase-root {
    width: ${({ width }) => (width ? `${width}px` : "200px")};
  }
`;

const StyledKeyboardDatePicker = styled(KeyboardDatePicker)`
  & .MuiInputBase-root {
    width: 150px;
  }
`;

const StyledButton = styled(Button)`
  flex: 1 0 10%;
  margin: 0;
`;