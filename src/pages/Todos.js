import React, { Component } from "react";
import styled from "styled-components";
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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { DataGrid } from "@material-ui/data-grid";
import DateFnsUtils from "@date-io/date-fns";

import Colors from "../common/Colors";
import ics from "../common/ics";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Button from "../components/common/DefaultButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import FilterListIcon from "@material-ui/icons/FilterList";

import {
  repeatableOptions,
  rruleOptions,
  weekdays,
  weekends,
  todaysColumns,
  allEventsColumns,
} from "../todoUtils/consts";

const filter = createFilterOptions();
const cal = ics();

export default class Todos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvents: [],
      events: [],
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
      newEventRepeat: [repeatableOptions.Everyday],
      selected: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  componentDidMount() {
    const updateEvents = JSON.parse(
      window.localStorage.getItem("mapleHubNews")
    );
    const calendarEvents =
      JSON.parse(window.localStorage.getItem("mapleHubTodos")) ?? [];

    this.setState({
      ...this.state,
      calendarEvents,
      events: (updateEvents && updateEvents.sectionDetails.length
        ? updateEvents.sectionDetails
        : []
      ).filter((event) => event.eventTimes.length && event.eventTimes[1]),
    });
  }

  storeOnCache = () => {
    window.localStorage.setItem(
      "mapleHubTodos",
      JSON.stringify(this.state.calendarEvents)
    );
  };

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

  handleTodaysEventRows = () => {
    const { calendarEvents } = this.state;
    return calendarEvents.map((calEvent, i) => {
      return {
        id: i,
        eventTitle: calEvent.subject,
        isComplete: false,
      };
    });
  };

  handleAllEventRows = () => {
    const { calendarEvents } = this.state;
    return calendarEvents.map((calEvent, i) => {
      const occuranceString =
        calEvent.rrule.freq === "DAILY"
          ? "DAILY"
          : calEvent.rrule.byday.join(", ");

      return {
        id: i,
        eventTitle: calEvent.subject,
        occurences: occuranceString,
        endDate: new Date(calEvent.end).toDateString(),
      };
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

    const { calendarEvents } = this.state;
    const eventIsDaily =
      newEventRepeat[0] === repeatableOptions.Everyday ||
      newEventRepeat.length === 7;
    const actualEventName =
      typeof newEventName === "string" ? newEventName : newEventName.eventName;
    if (eventIsDaily) {
      calendarEvents.push({
        subject: actualEventName,
        description: "",
        location: "",
        begin: new Date(newEventStartDate),
        end: new Date(newEventEndDate),
        isComplete: false,
        rrule: {
          freq: "DAILY",
          until: new Date(newEventEndDate),
          interval: 1,
        },
      });
    } else {
      const repeatArr = newEventRepeat.map((event) => rruleOptions[event]);
      calendarEvents.push({
        subject: actualEventName,
        description: "",
        location: "",
        begin: new Date(newEventStartDate),
        end: new Date(newEventEndDate),
        isComplete: false,
        rrule: {
          freq: "WEEKLY",
          until: new Date(newEventEndDate),
          interval: 1,
          byday: repeatArr.flat(),
        },
      });
    }

    this.storeOnCache();

    this.setState({
      ...this.state,
      calendarEvents,
      newEventName: "",
      newEventStartDate: Date.now(),
      newEventEndDate: Date.now(),
      newEventRepeat: [repeatableOptions.Everyday],
    });
  };

  renderEnhancedTableToolbar = (numSelected) => {
    return (
      <Toolbar>
        {numSelected > 0 ? (
          <Typography color='inherit' variant='subtitle1' component='div'>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant='h6' id='tableTitle' component='div'>
            The Daily Grind
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title='Complete' onClick={this.completeEvents}>
            <IconButton aria-label='Complete'>
              <DoneAllIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  };

  handleSelectAllClick = (event) => {
    const isChecked = event.target.checked;

    this.setState({
      ...this.state,
      selected: isChecked
        ? this.state.calendarEvents.map((n) => n.subject)
        : [],
    });
  };

  handleClick = (_, subject) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(subject);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, subject);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({
      ...this.state,
      selected: newSelected,
    });
  };

  handleChangePage = (_, newPage) => {
    this.setState({
      ...this.state,
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      ...this.state,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  completeEvents = () => {
    const { selected, calendarEvents } = this.state;
    const calendarEventsCopy = [...calendarEvents];

    selected.forEach((selectedSubject) => {
      const event = calendarEventsCopy.find(
        (calEv) => calEv.subject === selectedSubject
      );
      if (event) {
        event.isComplete = !event.isComplete;
      }
    });

    this.setState({
      ...this.state,
      calendarEvents: calendarEventsCopy,
      selected: [],
    });

    this.storeOnCache();
  };

  render() {
    const {
      events,
      calendarEvents,
      page,
      newEventName,
      newEventStartDate,
      newEventEndDate,
      newEventRepeat,
      rowsPerPage,
      selected,
    } = this.state;

    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, calendarEvents.length - page * rowsPerPage);

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
                labelId='demo-mutiple-name-label'
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
            <div>
              <Paper>
                {this.renderEnhancedTableToolbar(selected.length)}
                <TableContainer>
                  <Table
                    aria-labelledby='tableTitle'
                    size={"medium"}
                    aria-label='enhanced table'
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell padding='checkbox'>
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < calendarEvents.length
                            }
                            checked={
                              calendarEvents.length > 0 &&
                              selected.length === calendarEvents.length
                            }
                            onChange={this.handleSelectAllClick}
                            inputProps={{ "aria-label": "select all events" }}
                          />
                        </TableCell>
                        {todaysColumns.map((headCell) => (
                          <TableCell
                            style={{
                              width: "800px",
                            }}
                            key={headCell.id}
                            align='left'
                          >
                            <b>{headCell.label}</b>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calendarEvents
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .sort((a, b) => {
                          if (!a.isComplete) {
                            return -1;
                          }
                          if (!b.isComplete) {
                            return 1;
                          }
                          return 0;
                        })
                        .map((event, index) => {
                          const isItemSelected =
                            selected.indexOf(event.subject) !== -1;
                          const labelId = `enhanced-table-checkbox-${index}`;

                          return (
                            <TableRow
                              hover
                              onClick={(_) =>
                                this.handleClick(_, event.subject)
                              }
                              role='checkbox'
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={event.subject}
                              selected={isItemSelected}
                            >
                              <TableCell padding='checkbox'>
                                <Checkbox
                                  checked={isItemSelected}
                                  inputProps={{ "aria-labelledby": labelId }}
                                />
                              </TableCell>
                              <TableCell
                                component='th'
                                id={labelId}
                                scope='row'
                                align='left'
                              >
                                {event.subject}
                              </TableCell>
                              <TableCell align='left'>
                                {event.isComplete ? "Yes" : "No"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 50 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component='div'
                  count={calendarEvents.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </EventContainer>
          <EventContainer>
            <TableHeader>Scheduled Events</TableHeader>
            <DataGrid
              rows={this.handleAllEventRows()}
              columns={allEventsColumns}
              pageSize={5}
              checkboxSelection
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
`;

const EventContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 48px 8px;
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

const TableHeader = styled.h2`
  margin: 8px auto;
  text-align: center;
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
