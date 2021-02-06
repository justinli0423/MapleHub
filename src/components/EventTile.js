import React, { Component } from "react";
import styled, { keyframes, css } from "styled-components";

import { EventTypes, FilterTypes } from "../common/consts";
import Colors from "../common/colors";

import {
  isMobile,
  isTablet,
  isTabletOrBelow,
  MediaQueries,
} from "../common/MediaQueries";

import ArrowDownIcon from "../icons/chevron-down-solid.svg";
import ArrowUpIcon from "../icons/chevron-up-solid.svg";

import MultiEventIcon from "../icons/tasks-solid.svg";
import ActiveEventIcon from "../icons/hourglass-start-solid.svg";
import FutureEventIcon from "../icons/fast-forward-solid.svg";
import PastEventIcon from "../icons/history-solid.svg";
import PermanentEventIcon from "../icons/infinity-solid.svg";

const mediaQueries = new MediaQueries();

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
  }
  if (timeToConvert < 0) {
    return -1;
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

  handleDetailsToggle = () => {
    this.setState({
      ...this.state,
      isDetailsExpanded: !this.state.isDetailsExpanded,
    });
  };

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

    if (mediaQueries.isTabletOrBelow) {
      return "Starting:";
    }

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
          onClick={this.handleDetailsToggle}
          isDetailsExpanded={isDetailsExpanded}
        />
        <Container
          isDetailsExpanded={isDetailsExpanded}
          isEventActive={isEventActive}
          isFiltered={this.handleFilteredState()}
          isLargeMobileBox={eventDetails.requirements.length > 150}
        >
          <EventHeader isDetailsExpanded={isDetailsExpanded}>
            <EventIconContainer
              isActiveTimedEvent={
                isEventActive &&
                eventDetails.eventType === EventTypes.SINGLE_EVENT
              }
              src={`${eventIcon}`}
            />
            {mediaQueries.isMobile
              ? handleTruncateText(eventDetails.eventName, false, 24)
              : mediaQueries.isTablet
              ? handleTruncateText(eventDetails.eventName, false, 24)
              : eventDetails.eventName}
          </EventHeader>
          <ContentContainer>
            <EventDetails>
              <Bold>{this.handleRenderStartPeriodHeader()}</Bold>
              {startDate}
            </EventDetails>
            <EventDetails>
              <Bold>Duration Remaining:</Bold>
              {this.handleRenderDuration()}
            </EventDetails>
            <EventDetails>
              <Bold>Requirements:</Bold>
              {eventDetails.requirements.length
                ? handleTruncateText(
                    eventDetails.requirements,
                    isDetailsExpanded,
                    mediaQueries.isTabletOrBelow ? 30 : 80
                  )
                : "None"}
            </EventDetails>
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
            {isDetailsExpanded ? (
              <span>Hide Details</span>
            ) : (
              <span>Show Details</span>
            )}
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
  padding: 0 16px 16px;
  border-radius: 5px;
  background: ${({ isEventActive }) => (isEventActive ? "#ffffff" : "#e6e6e6")};
  box-shadow: 4px 5px 3px rgba(0, 0, 0, 0.25);

  ${isTablet} {
    height: ${({ isDetailsExpanded }) =>
      isDetailsExpanded ? "500px" : "200px"};
  }

  ${isMobile} {
    flex: unset;
    width: calc(100% - 32px);
    height: ${({ isDetailsExpanded, isLargeMobileBox }) =>
      isDetailsExpanded ? (isLargeMobileBox ? "800px" : "500px") : "200px"};
  }
`;

const ContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: calc(100% - 62px - 45px + 16px);
  margin-left: 8px;
  line-height: 30px;

  ${isTablet} {
    height: calc(100% - 54px - 40px);
  }

  ${isMobile} {
    height: calc(100% - 54px - 40px + 16px);
  }
`;

const EventHeader = styled.h2`
  overflow-x: hidden;
  width: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "900px" : "410px")};
  height: 30px;
  margin: 16px 0;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 24px;
  white-space: nowrap;

  ${isMobile} {
    width: 100%;
    margin: 16px 0 8px;
    font-size: 20px;
  }

  ${isTablet} {
    width: 100%;
    font-size: 20px;
  }
`;

const EventDetails = styled.p`
  display: inline-block;
  max-width: 900px;
  margin: 4px;
  line-height: 25px;

  ${isTabletOrBelow} {
    max-width: 700px;
    font-size: 14px;
    margin: 0 4px;
  }

  ${isMobile} {
    max-width: 300px;
  }
`;

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

  ${isMobile} {
    height: 40px;
    font-size: 16px;
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

  ${isMobile} {
    width: 20px;
    height: 20px;
  }
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

const DetailsContainer = styled.div`
  overflow-y: auto;
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "flex" : "none")};
  flex-direction: column;
  justify-content: flex-start;
  width: calc(100% - 16px);
  height: auto;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid ${Colors.BackgroundGrey};
  border-bottom: none;

  ${isMobile} {
    width: calc(100% - 8px);
  }
`;

const Details = styled.ul`
  list-style-position: outside;

  ${isMobile} {
    margin-top: 4px;
    padding-inline-start: 24px;
  }

  & > li {
    font-size: 14px;
    font-weight: normal;

    ul {
      font-size: 12px;
      font-weight: normal;

      ${isMobile} {
        padding-inline-start: 24px;
      }
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

  ${isTablet} {
    max-width: 650px;
  }

  ${isMobile} {
    max-width: 280px;
  }
`;

const Rewards = styled.div`
  display: ${({ isRewardsActive }) => (isRewardsActive ? "block" : "none")};
`;

const DetailsHeader = styled.h2`
  margin: 8px 4px;

  ${isMobile} {
    margin: 0 4px;
    font-size: 16px;
  }
`;

const RewardDetails = styled.ul`
  font-size: 12px;
  font-weight: normal;

  ${isMobile} {
    padding-inline-start: 24px;

    li > ul {
      padding-inline-start: 24px;
    }
  }
`;

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
