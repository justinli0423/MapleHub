import React, { Component } from "react";
import styled, { keyframes, css } from "styled-components";

import { EventTypes, FilterTypes } from "../common/consts";
import Colors from "../common/colors";

import ArrowDownIcon from "../icons/chevron-down-solid.svg";
import ArrowUpIcon from "../icons/chevron-up-solid.svg";

import MultiEventIcon from "../icons/tasks-solid.svg";
import ActiveEventIcon from "../icons/hourglass-start-solid.svg";
import FutureEventIcon from "../icons/fast-forward-solid.svg";
import PastEventIcon from "../icons/history-solid.svg";
import PermanentEventIcon from "../icons/infinity-solid.svg";

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
  return (
    eventTimes.find(
      (time) =>
        time[0] > currentTime ||
        (time[0] < currentTime && time[1] > currentTime)
    ) ?? eventTimes[eventTimes.length - 1]
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
  const currentTime = Date.now();
  let timeToConvert = -1;
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
      startDate: "",
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

  handleFilteredState() {
    const { eventDetails } = this.state;
    const { isFilterActive, filters, filterValue } = this.props;
    const filterKeys = Object.keys(filters);
    let shouldTileBeDisplayed = false;

    if (!isFilterActive && !filterValue) {
      return true;
    }

    // search bar takes precedence - ignore filter pills if event name is entered
    if (filterValue) {
      if (eventDetails.eventName === filterValue) {
        return true;
      }
      return false;
    }

    // check for type of event and event times
    filterKeys.forEach((key) => {
      const filterState = filters[key];
      if (!filterState) {
        return;
      }

      if (key === FilterTypes.UPDATES_PATCHES) {
        if (
          eventDetails.eventType === EventTypes.PATCH ||
          eventDetails.eventType === EventTypes.UPDATE
        ) {
          shouldTileBeDisplayed = true;
          return;
        }
      } else if (key === FilterTypes.MULTIPLE_EVENTS) {
        if (eventDetails.eventType === EventTypes.MULTIPLE_EVENTS) {
          shouldTileBeDisplayed = true;
          return;
        }
      } else if (key === FilterTypes.ACTIVE_EVENTS) {
        if (
          this.state.isEventActive &&
          this.state.eventDetails.eventType === EventTypes.SINGLE_EVENT
        ) {
          shouldTileBeDisplayed = true;
          return;
        }
      } else if (key === FilterTypes.PAST_EVENTS) {
        if (!this.state.isEventActive && this.state.eventDuration < 0) {
          shouldTileBeDisplayed = true;
          return;
        }
      } else if (key === FilterTypes.FUTURE_EVENTS) {
        if (
          !this.state.isEventActive &&
          this.state.eventDetails.eventTimes &&
          this.state.eventDetails.eventTimes[0] > Date.now()
        ) {
          shouldTileBeDisplayed = true;
          return;
        }
      }
    });

    return shouldTileBeDisplayed;
  }

  render() {
    const {
      isDetailsExpanded,
      eventDetails,
      isEventActive,
      eventIcon,
      startDate,
    } = this.state;
    return (
      <>
        <OverlayContainer
          onClick={this.handleDetailsToggle.bind(this)}
          isDetailsExpanded={isDetailsExpanded}
        />
        <Container
          isDetailsExpanded={isDetailsExpanded}
          isEventActive={isEventActive}
          isFiltered={this.handleFilteredState()}
        >
          <EventHeader isDetailsExpanded={isDetailsExpanded}>
            <EventIconContainer
              isActiveTimedEvent={
                isEventActive &&
                eventDetails.eventType === EventTypes.SINGLE_EVENT
              }
              src={`${eventIcon}`}
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
            {/* TODO: set Rewards */}
            <DetailsContainer isDetailsExpanded={isDetailsExpanded}>
              <DetailsHeader>Details: </DetailsHeader>
              <Details
                dangerouslySetInnerHTML={{ __html: eventDetails.details }}
              />
              <Rewards isRewardsActive={!!eventDetails.rewards.length}>
                <DetailsHeader>Rewards: </DetailsHeader>
                <RewardDetails
                  dangerouslySetInnerHTML={{ __html: eventDetails.rewards }}
                />
                {eventDetails.rewardImages.map((imgSrc, i) => (
                  <RewardImage key={i} src={imgSrc} alt='reward' />
                ))}
              </Rewards>
            </DetailsContainer>
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
      </>
    );
  }
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  z-index: ${({ isDetailsExpanded }) => (isDetailsExpanded ? 100 : "unset")};
  position: relative;
  display: ${({ isFiltered }) => (isFiltered ? "block" : "none")};
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
  width: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "900px" : "410px")};
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
  border-top: 1px solid ${Colors.BackgroundGrey};

  &:hover {
    cursor: pointer;

    img {
      transform: scale(1.15);
      filter: drop-shadow(2px 2px 1px ${Colors.BackgroundGrey});
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
`;

const Details = styled.ul`
  list-style-position: outside;
  & > li {
    font-size: 14px;
    font-weight: normal;

    & ul {
      font-size: 12px;
      font-weight: normal;
      text-indent: 16px;
    }
  }

  & > strong {
    display: block;
    margin-left: -16px;
    font-weight: bold;
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

const RewardImage = styled.img`
  max-width: 800px;
`;

const Rewards = styled.div`
  display: ${({ isRewardsActive }) => (isRewardsActive ? "block" : "none")};
`;

const DetailsHeader = styled.h2`
  margin: 8px 4px;
`;

const RewardDetails = styled.ul``;

const OverlayContainer = styled.div`
  z-index: 10;
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
`;
