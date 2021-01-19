import React, { Component } from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
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
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Colors from "../common/Colors";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Button from "../components/common/DefaultButton";

const localizer = momentLocalizer(moment);
const filter = createFilterOptions();

const repeatableOptions = {
  None: "None",
  Everyday: "Everyday",
  Weekdays: "Weekdays",
  Weekends: "Weekends",
  Mondays: "Mondays",
  Tuesdays: "Tuesdays",
  Wednesdays: "Wednesdays",
  Thursdays: "Thursdays",
  Fridays: "Fridays",
  Saturdays: "Saturdays",
  Sundays: "Sundays",
};

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
      newEventRepeat: [repeatableOptions.None],
    };
  }

  componentDidMount() {
    const updateEvents = JSON.parse(
      window.localStorage.getItem("mapleHubNews")
    );

    if (!updateEvents) {
      return;
    }

    this.setState({
      ...this.state,
      events: updateEvents.sectionDetails.filter(
        (event) => event.eventTimes.length && event.eventTimes[1]
      ),
    });
  }

  eventSelectorOnChange = (_, newValue) => {
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

  setStartDate = (newEventStartDate) => {
    this.setState({
      ...this.state,
      newEventStartDate,
    });
  };

  setEndDate = (newEventEndDate) => {
    this.setState({
      ...this.state,
      newEventEndDate,
    });
  };

  eventRepeatLogic = (selectedDays) => {
    const latestDay = selectedDays[selectedDays.length - 1];
    const weekdays = [
      repeatableOptions.Mondays,
      repeatableOptions.Tuesdays,
      repeatableOptions.Wednesdays,
      repeatableOptions.Thursdays,
      repeatableOptions.Fridays,
    ];
    const weekends = [repeatableOptions.Saturdays, repeatableOptions.Sundays];
    let newEventRepeat = selectedDays;
    console.log(latestDay);

    if (latestDay === repeatableOptions.None) {
      newEventRepeat = [repeatableOptions.None];
      return newEventRepeat;
    }

    if (latestDay === repeatableOptions.Everyday) {
      newEventRepeat = [repeatableOptions.Everyday];
      return newEventRepeat;
    }

    if (latestDay === repeatableOptions.Weekdays) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          !weekdays.includes(day) &&
          ![repeatableOptions.None, repeatableOptions.Everyday].includes(day)
      );
      return newEventRepeat;
    }

    if (latestDay === repeatableOptions.Weekends) {
      newEventRepeat = selectedDays.filter(
        (day) =>
          !weekends.includes(day) &&
          ![repeatableOptions.None, repeatableOptions.Everyday].includes(day)
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

  render() {
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
              options={this.state.events}
              value={this.state.newEventName}
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
                value={this.state.newEventStartDate}
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
                value={this.state.newEventEndDate}
                onChange={this.setEndDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>

            <FormControl>
              <InputLabel>Repeat?</InputLabel>
              <Select
                labelId='demo-mutiple-name-label'
                multiple
                value={this.state.newEventRepeat}
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
            <StyledButton label='Add' />
          </AddEvents>
          <EventContainer>
            <EventList>
              <h2>Today's Missions</h2>
              <TodaysEvents>
                <EventRow>
                  <span>Name</span>
                  <span>Completed?</span>
                  <span>Delete</span>
                </EventRow>
              </TodaysEvents>
            </EventList>
            <Calendar
              localizer={localizer}
              events={[
                {
                  title: "hello",
                  start: new Date(),
                  end: new Date(),
                  allDay: true,
                },
              ]}
              startAccessor='start'
              endAccessor='end'
              style={{ height: 500 }}
            />
          </EventContainer>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 1024px;
  margin: 40px 0;
  /* border: 1px solid black; */
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin-top: 16px;
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

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 500px;
  width: 400px;
`;

const TodaysEvents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 8px 0;
`;

const EventRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  & > * {
    margin: 8px auto;
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
