import React, { Component } from "react";
import styled, { keyframes, css } from "styled-components";

import { EventTypes } from "../common/Consts";

import ArrowDownIcon from "../icons/chevron-down-solid.svg";
import ArrowUpIcon from "../icons/chevron-up-solid.svg";

import MultiEventIcon from "../icons/tasks-solid.svg";
import ActiveEventIcon from "../icons/hourglass-start-solid.svg";
import FutureEventIcon from "../icons/fast-forward-solid.svg";
import PastEventIcon from "../icons/history-solid.svg";
import PermanentEventIcon from "../icons/infinity-solid.svg";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 24px;
  width: ${({isDetailsExpanded}) => isDetailsExpanded ? '900px' : '410px'};
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
  animation: ${({ isActiveTimedEvent }) =>
    isActiveTimedEvent
      ? css`
          ${rotate} 4s linear infinite
        `
      : "none"};
`;

// TODO: Animation on show/hide?
const DetailsContainer = styled.div`
  overflow-y: auto;
  max-height: 280px;
  width: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "calc(100% - 32px)" : 0};
  height: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "auto" : 0)};
  padding: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "16px 8px" : 0)};
  opacity: ${({ isDetailsExpanded }) => (isDetailsExpanded ? 1 : 0)};
  visibility: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "visible" : "hidden"};

  & > li {
    /* direct children: headers */
    font-size: 14px;
    font-weight: bold;

    & ul {
      font-size: 12px;
      font-weight: normal;
      text-indent: 16px;
    }
  }

  & img {
    max-width: 600px;
  }

  & br {
    display: none;
  }

  & em {
    display: inline;
  }

  & > span {
    padding-right: 4px;
  }
`;

const handleTruncateText = (text, isExpanded, length) => {
  if (text.length <= length || isExpanded) {
    return text;
  }
  const truncatedText = text.length > length ? text.substring(0, length) : text;
  const lastSpaceIndex = truncatedText.lastIndexOf(" ");
  return (
    truncatedText.substring(
      0,
      lastSpaceIndex === -1 ? length : lastSpaceIndex
    ) + "..."
  );
};

/**
 *
 * @param integer eventTimes
 * returns the first event cycle
 * either:
 * - first upcoming
 * - currently happening
 */
const findFirstActiveDate = (eventTimes) => {
  const currentTime = Date.now();
  return eventTimes.find(
    (time) =>
      time[0] > currentTime || (time[0] < currentTime && time[1] > currentTime)
  );
};

const handleEventProps = (details) => {
  const { eventType, eventTimes } = details;
  const currentTime = Date.now();
  let startDate,
    eventIcon,
    isEventActive,
    eventDuration,
    timeToConvert,
    firstActiveTime;
  switch (eventType) {
    case EventTypes.PATCH:
      // no times
      eventIcon = PermanentEventIcon;
      startDate = "Now";
      isEventActive = true;
      eventDuration = Infinity;
      break;
    case EventTypes.UPDATE:
      // 1 time
      timeToConvert = new Date(eventTimes[0]);
      eventIcon = PermanentEventIcon;
      startDate =
        timeToConvert.toLocaleDateString() +
        " at " +
        timeToConvert.toLocaleTimeString();
      isEventActive = true;
      eventDuration = Infinity;
      break;
    case EventTypes.SINGLE_EVENT:
      // duration
      timeToConvert = new Date(eventTimes[0]);
      startDate =
        timeToConvert.toLocaleDateString() +
        " at " +
        timeToConvert.toLocaleTimeString();
      isEventActive =
        eventTimes[0] <= currentTime && eventTimes[1] >= currentTime;
      eventDuration = findRemainingDuration(eventTimes);
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
      const totalActiveTime = [
        eventTimes[0][0],
        eventTimes[eventTimes.length - 1][1],
      ];
      firstActiveTime = findFirstActiveDate(eventTimes);
      eventDuration = findRemainingDuration(totalActiveTime);
      timeToConvert = new Date(findFirstActiveDate(eventTimes)[0]);
      startDate =
        timeToConvert.toLocaleDateString() +
        " at " +
        timeToConvert.toLocaleTimeString();
      eventIcon = eventTimes ? MultiEventIcon : PastEventIcon;
      if (
        totalActiveTime[0] <= currentTime &&
        totalActiveTime[1] >= currentTime
      ) {
        isEventActive = true;
      } else {
        isEventActive = false;
      }
      break;
    default:
      break;
  }
  return {
    startDate,
    isEventActive,
    eventIcon,
    eventDuration,
    // TODO: show in details when expanded as "next event period"
    firstActiveTime,
  };
};

const findRemainingDuration = (eventTimes) => {
  if (!eventTimes) {
    return -1;
  }
  let timeToConvert = -1;
  const currentTime = Date.now();
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
};

export default class EventTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDetails: this.props.eventDetails,
      isDetailsExpanded: false,
      isEventActive: true,
      eventDuration: 0,
      eventIcon: null,
      eventIconHash: Date.now(),
      startdate: "",
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      ...handleEventProps(this.state.eventDetails),
    });
  }

  handleDetailsToggle() {
    this.setState({
      ...this.state,
      isDetailsExpanded: !this.state.isDetailsExpanded,
    });
  }

  handleRenderDuration() {
    const { eventDuration } = this.state;
    switch (eventDuration) {
      case -1:
        return "Event Ended";
      case Infinity:
        return "Permanent";
      default:
        return eventDuration > 1
          ? `${eventDuration} days`
          : `${eventDuration} day`;
    }
  }

  handleRenderStartPeriodHeader() {
    const { eventDetails } = this.state;
    if (eventDetails.eventType === EventTypes.MULTIPLE_EVENTS) {
      return "Next Period Starting:";
    }
    return "Available Starting:";
  }

  render() {
    const {
      isDetailsExpanded,
      eventDetails,
      isEventActive,
      eventIcon,
      eventIconHash,
      startDate,
    } = this.state;
    return (
      <Container
        isDetailsExpanded={isDetailsExpanded}
        isEventActive={isEventActive}
      >
        <EventHeader isDetailsExpanded={isDetailsExpanded}>
          <EventIconContainer
            isActiveTimedEvent={
              isEventActive &&
              eventDetails.eventType === EventTypes.SINGLE_EVENT
            }
            src={`${eventIcon}?${eventIconHash}`}
          />
          {eventDetails.eventName}
        </EventHeader>
        <ContentContainer>
          <EventDetails>
            <Bold>{this.handleRenderStartPeriodHeader()}</Bold>
            {startDate}
          </EventDetails>
          <br />
          <EventDetails>
            <Bold>Duration Remaining:</Bold>
            {this.handleRenderDuration()}
          </EventDetails>
          <br />
          <EventDetails>
            <Bold>Requirements:</Bold>
            {eventDetails.requirements.length
              ? handleTruncateText(
                  eventDetails.requirements,
                  isDetailsExpanded,
                  80
                )
              : "None"}
          </EventDetails>
          <DetailsContainer
            isDetailsExpanded={isDetailsExpanded}
            dangerouslySetInnerHTML={{ __html: eventDetails.details }}
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
