import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";

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
import DoneAllIcon from "@material-ui/icons/DoneAll";

import DateFnsUtils from "@date-io/date-fns";

import Colors from "../common/colors";
import {
  LOCAL_STORAGE_EVENT_NOTES,
  LOCAL_STORAGE_EVENT_DETAILS,
} from "../common/consts";
import ics from "../common/ics";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Button from "../components/common/DefaultButton";

import { toggleEvent, restoreEvents } from "../redux/actions";
import {
  getAllEventDetails,
  getEventList,
  getEventsStore,
} from "../redux/selectors";

import { repeatableOptions, todaysColumns } from "../todoUtils/consts";

class DailyTable extends Component {
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

  handleClick = (_, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  handleSelectAllClick = (event) => {
    const isChecked = event.target.checked;

    this.setState({
      ...this.state,
      selected: isChecked ? this.props.eventIds : [],
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
    const { selected } = this.state;

    if (selected.length === this.props.eventIds.length) {
      const { selected } = this.state;

      const isNotAllcomplete =
        selected.filter((id) => !this.props.calendarEvents[id].isComplete)
          .length > 0;

      if (isNotAllcomplete) {
        selected.forEach((id) => {
          this.props.toggleEvent(id, true);
        });
      } else {
        selected.forEach((id) => {
          this.props.toggleEvent(id, false);
        });
      }
    } else {
      selected.forEach((id) => {
        this.props.toggleEvent(id);
      });
    }

    this.setState({
      ...this.state,
      selected: [],
    });
  };

  render() {
    const { page, rowsPerPage, selected } = this.state;
    const { calendarEvents, eventIds } = this.props;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, eventIds.length - page * rowsPerPage);

    return (
      <div>
        <Paper>
          <Toolbar>
            {selected.length > 0 ? (
              <Typography color='inherit' variant='subtitle1' component='div'>
                {selected.length} selected
              </Typography>
            ) : (
              <Typography variant='h6' id='tableTitle' component='div'>
                The Daily Grind
              </Typography>
            )}

            {selected.length > 0 ? (
              <Tooltip title='Complete' onClick={this.completeEvents}>
                <IconButton aria-label='Complete'>
                  <DoneAllIcon />
                </IconButton>
              </Tooltip>
            ) : null}
          </Toolbar>
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
                {eventIds
                  .sort((a, b) => {
                    if (
                      !calendarEvents[a].isComplete &&
                      calendarEvents[b].isComplete
                    ) {
                      return -1;
                    }
                    if (
                      !calendarEvents[b].isComplete &&
                      calendarEvents[a].isComplete
                    ) {
                      return 1;
                    }
                    return a - b;
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((eventId) => {
                    const isItemSelected = selected.indexOf(eventId) !== -1;
                    const labelId = `enhanced-table-checkbox-${eventId}`;
                    return (
                      <TableRow
                        hover
                        onClick={(_) => this.handleClick(_, eventId)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={eventId}
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
                          {calendarEvents[eventId].subject}
                        </TableCell>
                        <TableCell align='left'>
                          {calendarEvents[eventId].isComplete ? "Yes" : "No"}
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
            count={eventIds.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
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
  toggleEvent,
  restoreEvents,
})(DailyTable);
