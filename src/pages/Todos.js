import React, { Component } from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";
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

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
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

  dateInputOnChange = (_, newValue) => {
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
      this.setState({
        ...this.state,
        newEventName: newValue,
      });
    }
  };

  dateFilterOptions = (options, params) => {
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

  dateGetOptionLabel = (option) => {
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
              onChange={this.dateInputOnChange}
              filterOptions={this.dateFilterOptions}
              getOptionLabel={this.dateGetOptionLabel}
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

            <Autocomplete
              options={["No", "Daily", "Weekly"]}
              onChange={() => {}}
              typeof={Date}
              renderInput={(params) => (
                <StylesProvider injectFirst>
                  <StyledTextField
                    label='Repeat?'
                    margin='dense'
                    width={150}
                    {...params}
                  />
                </StylesProvider>
              )}
            />
            <StyledButton label='Add' />
          </AddEvents>
          <EventContainer>
            <EventList>
              <h2>Today's Missions</h2>
              <TodaysEvents>
                <EventRow>
                  <span>Name</span>
                  <span>Completed</span>
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
