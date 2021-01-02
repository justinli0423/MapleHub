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
  background: #ffffff;
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
    switch (eventType) {
      case EventTypes.PATCH:
        // no times
        return 'Now';
      case EventTypes.UPDATE:
        // 1 time
        return new Date(eventTimes[0]).toDateString();
      case EventTypes.SINGLE_EVENT:
        // duration
        return new Date(eventTimes[0]).toDateString();
      case EventTypes.MULTIPLE_EVENTS:
        // multiple durations
        return new Date(eventTimes[0][0]).toDateString();
      default:
        break;
    }
  }

  /**
   * {
  "sectionDetails": {
    "orderId": 7,
    "eventName": "Reboot World Revamp",
    "requirements": "",
    "details": "\n<li>Zero can now be created in Reboot world during the <a href=\"https://maplestory.nexon.net/news/63875/v-219-awake-flicker-of-light-patch-notes#zero\" target=\"_blank\">Zero Creation</a> event. <br>\n<ul>\n<li>Please note that you must have a character that is Lv. 100 or above in Reboot world in order to create a Zero character.</li>\n</ul>\n</li>\n<li>Increased the chance to obtain equipment from defeating the following bosses in Reboot world:<br>\n<ul>\n<li>Lotus (Hard)</li>\n<li>Papulatus (Chaos)</li>...",
    "rewards": "",
    "eventType": null,
    "eventTimes": "[[]]",
    "pinned": false,
    "pinId": -1
  }
}
   */

  render() {
    const { isDetailsExpanded, eventDetails } = this.state;
    return (
      <Container isDetailsExpanded={isDetailsExpanded}>
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
            <Bold>Duration:</Bold>INSERT TIMES HERE
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
