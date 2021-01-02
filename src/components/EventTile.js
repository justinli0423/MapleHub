import React, { Component } from "react";
import styled from "styled-components";

import { EventTypes, Keywords, NodeNames } from "../common/Consts";

import ArrowDown from "../icons/chevron-down-solid.svg";
import ArrowUp from "../icons/chevron-up-solid.svg";

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

const ArrowUpIcon = styled(ArrowIcon)`
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "block" : "none")};
`;

const ArrowDownIcon = styled(ArrowIcon)`
  display: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "none" : "block")};
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
    };
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
        timeToConvert = new Date(eventTimes[0][0]);
        return (
          timeToConvert.toLocaleDateString() +
          " at " +
          timeToConvert.toLocaleTimeString()
        );
      default:
        break;
    }
  }

  componentDidMount() {
    const { eventDetails } = this.state;
    this.setState({
      ...this.state,
      eventDuration: this.handleDuration(eventDetails),
    });
  }

  handleDuration(details) {
    const { eventType, eventTimes } = details;
    let timeToConvert;
    let currentTime = new Date();
    switch (eventType) {
      case EventTypes.PATCH:
        return Infinity;
      case EventTypes.UPDATE:
        return Infinity;
      case EventTypes.SINGLE_EVENT:
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
      case EventTypes.MULTIPLE_EVENTS:
        // multiple durations
        timeToConvert = new Date(eventTimes[0][0]);
        return (
          timeToConvert.toLocaleDateString() +
          " at " +
          timeToConvert.toLocaleTimeString()
        );
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
        return `${eventDuration} days`;
    }
  }

  render() {
    const { isDetailsExpanded, eventDetails, eventDuration } = this.state;
    return (
      <Container
        isDetailsExpanded={isDetailsExpanded}
        isEventActive={eventDuration >= 0}
      >
        <EventHeader>
          {this.handleTruncateText(eventDetails.eventName, 50)}
        </EventHeader>
        <ContentContainer>
          <EventDetails>
            <Bold>Available Starting:</Bold>
            {this.handleStartDates(eventDetails)}
          </EventDetails>
          <br />
          <EventDetails>
            <Bold>Remaining:</Bold>
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
            <ArrowDownIcon
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowDown}
              alt=''
            />
            <ArrowUpIcon
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowUp}
              alt=''
            />
          </div>
        </Footer>
      </Container>
    );
  }
}
