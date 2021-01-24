import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { rrulestr } from "rrule";

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

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { toggleEvent, resetEvents } from "../redux/actions";
import {
  getActiveEventIds,
  getAllEventDetails,
  getEventsStore,
} from "../redux/selectors";

import Colors from "../common/colors";

import { todaysColumns } from "../todoUtils/consts";

class DailyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarEvents: [],
      selected: [],
      page: 0,
      rowsPerPage: 5,
      serverTime: Date.now(),
      timerHandler: null,
      isActiveResetDialog: false,
    };
  }

  componentDidMount() {
    const timerHandler = setInterval(() => {
      this.setTimer();
    }, 1000);
    this.setState({
      timerHandler,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timerHandler);
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

  handleCloseDialog = () => {
    this.setState({
      ...this.state,
      isActiveResetDialog: false,
    });
  };

  setTimer = () => {
    const { serverTime } = this.state;
    const curTime = Date.now();

    if (moment(curTime).utc().date() !== moment(serverTime).utc().date()) {
      this.setState({
        ...this.state,
        serverTime: new Date(),
        isActiveResetDialog: true,
      });
    } else {
      this.setState({
        ...this.state,
        serverTime: new Date(),
      });
    }
  };

  sortHandler = (id1, id2) => {
    const { calendarEvents } = this.props;
    const eventOneDates = rrulestr(calendarEvents[id1].rrule).all();
    const eventTwoDates = rrulestr(calendarEvents[id2].rrule).all();

    if (!calendarEvents[id1].isComplete && calendarEvents[id2].isComplete) {
      return -1;
    }
    if (!calendarEvents[id2].isComplete && calendarEvents[id1].isComplete) {
      return 1;
    }

    if (eventOneDates.length > 0 && eventTwoDates.length > 0) {
      // compare the first date: will always be the future date because past dates
      // gets filtered on render everytime
      return eventOneDates[0] - eventTwoDates[0];
    }

    return id1 - id2;
  };

  renderResetDialog() {
    return (
      <div>
        <Dialog
          open={this.state.isActiveResetDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{"Daily Reset"}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              It's a new day! Would you like to reset your dailies?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.props.resetEvents();
                this.handleCloseDialog();
              }}
              color='primary'
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  render() {
    const { page, rowsPerPage, selected, serverTime } = this.state;
    const { calendarEvents, eventIds } = this.props;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, eventIds.length - page * rowsPerPage);

    return (
      <div>
        {this.renderResetDialog()}
        <Paper>
          <Toolbar>
            {selected.length > 0 ? (
              <Typography color='inherit' variant='subtitle1' component='div'>
                {selected.length} selected
              </Typography>
            ) : (
              <Typography variant='h6' id='tableTitle' component='div'>
                The Daily Grind -{" "}
                {moment(serverTime).utc().format("ddd MMM Do, h:mm:ss a")}
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
                        selected.length > 0 && selected.length < eventIds.length
                      }
                      checked={
                        eventIds.length > 0 &&
                        selected.length === eventIds.length
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
                  .sort(this.sortHandler)
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
                          style={{
                            color: calendarEvents[eventId].isComplete
                              ? Colors.BackgroundGrey
                              : undefined,
                            textDecoration: calendarEvents[eventId].isComplete
                              ? "line-through"
                              : undefined,
                          }}
                        >
                          {calendarEvents[eventId].subject}
                        </TableCell>
                        <TableCell align='left'>{}</TableCell>
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
  const eventIds = getActiveEventIds(eventStore);
  return {
    calendarEvents,
    eventIds,
  };
};

export default connect(mapStateToProps, {
  toggleEvent,
  resetEvents,
})(DailyTable);
