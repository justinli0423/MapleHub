import React, { Component } from "react";
import styled from "styled-components";

import { EventTypes } from "../common/Consts";

import ArrowDownIcon from "../icons/chevron-down-solid.svg";
import ArrowUpIcon from "../icons/chevron-up-solid.svg";

import MultiEventIcon from "../icons/tasks-solid.svg";
import ActiveEventIcon from "../icons/hourglass-start-solid.svg";
import FutureEventIcon from "../icons/fast-forward-solid.svg";
import PastEventIcon from "../icons/history-solid.svg";
import PermanentEventIcon from "../icons/infinity-solid.svg";

const Container = styled.div`
  position: relative;
  flex: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "0 0 calc(100% - 32px)" : "0 0 calc(50% - 32px)"};
  height: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "500px" : "250px")};
  margin: 16px;
  padding: 16px;
  border-radius: 5px;
  background: ${({ isEventActive }) => (isEventActive ? "#ffffff" : "#e6e6e6")};
  box-shadow: 4px 5px 3px rgba(0, 0, 0, 0.25);
`;

const ContentContainer = styled.div`
  margin-left: 8px;
  line-height: 30px;
`;

const EventHeader = styled.h2`
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 24px;
`;

const EventDetails = styled.p`
  display: inline-block;
  margin-left: 4px;
  line-height: 25px;
`;

// TODO: shrink footer when out of focus (clicking outside the box)
const Footer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  height: 45px;
  width: 100%;
  padding: 0 16px;
  vertical-align: center;
  border-top: 1px solid #d3d3d3;

  &:hover {
    cursor: pointer;

    img {
      transform: scale(1.15);
      filter: drop-shadow(2px 2px 1px #d3d3d3);
    }
  }
`;

const Bold = styled.b`
  margin-right: 8px;
`;

const ArrowIcon = styled.img`
  width: 28px;
  height: 28px;
  padding: 3px;
  border-radius: 50%;
  transition: 0.1s linear all;
`;

const ArrowUpIconContainer = styled(ArrowIcon)`
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "block" : "none")};
`;

const ArrowDownIconContainer = styled(ArrowIcon)`
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "none" : "block")};
`;

const EventIconContainer = styled.img`
  margin: 0 8px 4px 0;
  height: 20px;
  width: 20px;
  vertical-align: middle;
`;

// TODO: Animation on show/hide?
const DetailsContainer = styled.div`
  opacity: ${({ isDetailsExpanded }) => (isDetailsExpanded ? 1 : 0)};
  visibility: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "visible" : "hidden"};
  width: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "auto" : 0)};
  height: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "auto" : 0)};
  margin: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "16px 8px" : 0)};
  max-height: 280px;
`;

export default class EventTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDetails: this.props.eventDetails,
      isDetailsExpanded: false,
      isEventActive: false,
      eventDuration: 0,
      eventIcon: null,
      eventIconHash: Date.now()
    };
  }

  componentDidMount() {
    const { eventDetails } = this.state;
    const isEventActive = this.handleIsActiveEvent(eventDetails.eventTimes);
    const eventDuration = this.handleDuration(eventDetails);
    const eventIcon = this.handleEventTypeIcon();
    this.setState({
      ...this.state,
      eventDuration,
      isEventActive,
      eventIcon,
    });
  }

  handleDetailsToggle() {
    this.setState({
      ...this.state,
      isDetailsExpanded: !this.state.isDetailsExpanded,
    });
  }

  handleTruncateText(text, length = 50) {
    if (text.length <= length) {
      return text;
    }
    const truncatedText =
      text.length > length ? text.substring(0, length) : text;
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    return (
      truncatedText.substring(
        0,
        lastSpaceIndex === -1 ? length : lastSpaceIndex
      ) + "..."
    );
  }

  findFirstActiveDate(eventTimes) {
    const currentTime = new Date();
    return eventTimes.find(
      (time) =>
        time[0] > currentTime ||
        (time[0] < currentTime && time[1] > currentTime)
    );
  }

  handleStartDates(details) {
    const { eventType, eventTimes } = details;
    let timeToConvert;
    switch (eventType) {
      case EventTypes.PATCH:
        // no times
        return "Now";
      case EventTypes.UPDATE:
        // 1 time
        timeToConvert = new Date(eventTimes[0]);
        return (
          timeToConvert.toLocaleDateString() +
          " at " +
          timeToConvert.toLocaleTimeString()
        );
      case EventTypes.SINGLE_EVENT:
        // duration
        timeToConvert = new Date(eventTimes[0]);
        return (
          timeToConvert.toLocaleDateString() +
          " at " +
          timeToConvert.toLocaleTimeString()
        );
      case EventTypes.MULTIPLE_EVENTS:
        // multiple durations
        timeToConvert = new Date(this.findFirstActiveDate(eventTimes)[0]);
        return (
          timeToConvert.toLocaleDateString() +
          " at " +
          timeToConvert.toLocaleTimeString()
        );
      default:
        break;
    }
  }

  handleEventTypeIcon() {
    const { eventTimes, eventType } = this.state.eventDetails;
    let eventIcon = PermanentEventIcon;
    const currentTime = new Date();
    switch (eventType) {
      case EventTypes.SINGLE_EVENT:
        if (eventTimes[0] <= currentTime && eventTimes[1] >= currentTime) {
          eventIcon = ActiveEventIcon;
        }
        if (eventTimes[0] > currentTime) {
          eventIcon = FutureEventIcon;
        }
        if (eventTimes[1] < currentTime) {
          eventIcon = PastEventIcon;
        }
        break;
      case EventTypes.MULTIPLE_EVENTS:
        eventIcon = eventTimes ? MultiEventIcon : PastEventIcon;
        break;
      default:
        break;
    }
    return eventIcon;
  }

  handleIsActiveEvent(eventTimes) {
    const { eventType } = this.state.eventDetails;
    const currentTime = new Date();
    switch (eventType) {
      case EventTypes.PATCH:
        this.handleEventTypeIcon(eventTimes, eventType);
        return true;
      case EventTypes.UPDATE:
        this.handleEventTypeIcon(eventTimes, eventType);
        return true;
      case EventTypes.SINGLE_EVENT:
        const isActive =
          eventTimes[0] <= currentTime && eventTimes[1] >= currentTime;
        this.handleEventTypeIcon(eventTimes, eventType);
        return isActive;
      case EventTypes.MULTIPLE_EVENTS:
        // find first event that is either upcoming or active
        const firstActiveTime = this.findFirstActiveDate(eventTimes);
        if (!firstActiveTime) {
          this.handleEventTypeIcon(eventTimes, eventType);
          return false;
        }
        this.handleEventTypeIcon(eventTimes, eventType);
        return (
          firstActiveTime[0] <= currentTime && firstActiveTime[1] >= currentTime
        );
      default:
        break;
    }
  }

  findRemainingDuration(eventTimes) {
    if (!eventTimes) {
      return -1;
    }
    let timeToConvert = -1;
    const currentTime = new Date();
    if (eventTimes[0] > currentTime) {
      timeToConvert = eventTimes[1] - eventTimes[0];
    } else {
      timeToConvert = eventTimes[1] - currentTime;
      if (timeToConvert < 0) {
        return -1;
      }
    }
    const diffDays = Math.ceil(timeToConvert / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  handleDuration(details) {
    const { eventType, eventTimes } = details;
    switch (eventType) {
      case EventTypes.PATCH:
        return Infinity;
      case EventTypes.UPDATE:
        return Infinity;
      case EventTypes.SINGLE_EVENT:
        return this.findRemainingDuration(eventTimes);
      case EventTypes.MULTIPLE_EVENTS:
        // find first event that is either upcoming or active
        const firstActiveTime = this.findFirstActiveDate(eventTimes);
        return this.findRemainingDuration(firstActiveTime);
      default:
        break;
    }
  }

  handleRenderDuration() {
    const { eventDuration } = this.state;
    switch (eventDuration) {
      case -1:
        return "Ended";
      case Infinity:
        return "Permanent";
      default:
        return eventDuration > 1
          ? `${eventDuration} days`
          : `${eventDuration} day`;
    }
  }

  render() {
    const {
      isDetailsExpanded,
      eventDetails,
      isEventActive,
      eventIcon,
      eventIconHash
    } = this.state;
    return (
      <Container
        isDetailsExpanded={isDetailsExpanded}
        isEventActive={isEventActive}
      >
        <EventHeader>
          <EventIconContainer src={`${eventIcon}?${eventIconHash}`} key={eventIconHash} />
          {this.handleTruncateText(eventDetails.eventName, 50)}
        </EventHeader>
        <ContentContainer>
          <EventDetails>
            <Bold>Available Starting:</Bold>
            {this.handleStartDates(eventDetails)}
          </EventDetails>
          <br />
          <EventDetails>
            <Bold>Duration:</Bold>
            {this.handleRenderDuration()}
          </EventDetails>
          <br />
          <EventDetails>
            <Bold>Requirements:</Bold>
            {eventDetails.requirements.length
              ? this.handleTruncateText(eventDetails.requirements, 80)
              : "None"}
          </EventDetails>
          <DetailsContainer
            isDetailsExpanded={isDetailsExpanded}
          ></DetailsContainer>
        </ContentContainer>
        <Footer onClick={this.handleDetailsToggle.bind(this)}>
          <span>Show Details</span>
          <div>
            <ArrowDownIconContainer
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowDownIcon}
              alt=''
            />
            <ArrowUpIconContainer
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowUpIcon}
              alt=''
            />
          </div>
        </Footer>
      </Container>
    );
  }
}
