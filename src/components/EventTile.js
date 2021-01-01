import React, { Component } from "react";

import styled from "styled-components";

import ArrowDown from "../icons/chevron-down-solid.svg";
import ArrowUp from "../icons/chevron-up-solid.svg";

const Container = styled.div`
  position: relative;
  flex: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "0 0 calc(100% - 32px)" : "0 0 calc(50% - 32px)"};
  height: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "500px" : "300px")};
  margin: 16px;
  padding: 16px;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 4px 5px 3px rgba(0, 0, 0, 0.25);
`;

const ContentContainer = styled.div`
  margin-left: 8px;
`;

const EventHeader = styled.h2`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 16px;
`;

const EventSubheader = styled.h3`
  display: inline-block;
  margin: 4px 4px 4px 0;
  font-weight: bold;
  font-size: 16px;
`;

const EventDetails = styled.p`
  display: inline;
  margin-left: 4px;
`;

const Footer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 45px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  vertical-align: center;
  border-top: 1px solid #d3d3d3;
`;

// TODO: do i need this?
const ArrowContainer = styled.div``;

const ArrowIcon = styled.img`
  width: 28px;
  height: 28px;
  padding: 3px;
  border-radius: 50%;
  transition: 0.1s linear all;

  &:hover {
    transform: scale(1.15);
    filter: drop-shadow(2px 2px 1px #d3d3d3);
  }
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

  /**
   * {
  "sectionDetails": {
    "orderId": 7,
    "eventName": "Reboot World Revamp",
    "requirements": "",
    "details": "\n<li>Zero can now be created in Reboot world during the <a href=\"https://maplestory.nexon.net/news/63875/v-219-awake-flicker-of-light-patch-notes#zero\" target=\"_blank\">Zero Creation</a> event. <br>\n<ul>\n<li>Please note that you must have a character that is Lv. 100 or above in Reboot world in order to create a Zero character.</li>\n</ul>\n</li>\n<li>Increased the chance to obtain equipment from defeating the following bosses in Reboot world:<br>\n<ul>\n<li>Lotus (Hard)</li>\n<li>Papulatus (Chaos)</li>...",
    "rewards": "",
    "eventType": null,
    "eventTimes": "[]",
    "pinned": false,
    "pinId": -1
  }
}
   */

  render() {
    const { isDetailsExpanded, eventDetails } = this.state;
    return (
      <Container isDetailsExpanded={isDetailsExpanded}>
        <EventHeader>{eventDetails.eventName}</EventHeader>
        <ContentContainer>
          <EventSubheader>Available after:</EventSubheader>
          <EventDetails>INSERT TIMES HERE</EventDetails>
          <br />
          <EventSubheader>Duration:</EventSubheader>
          <EventDetails>INSERT TIMES HERE</EventDetails>
          <br />
          <EventSubheader>Requirements:</EventSubheader>
          <EventDetails>
            {eventDetails.requirements.length
              ? eventDetails.requirements
              : "None"}
          </EventDetails>
          <DetailsContainer isDetailsExpanded={isDetailsExpanded}>
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
            DETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILSDETAILS
            <br />
          </DetailsContainer>
        </ContentContainer>
        <Footer>
          <span>Show Details</span>
          <ArrowContainer onClick={this.handleDetailsToggle.bind(this)}>
            <ArrowDownIcon
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowDown}
              alt=""
            />
            <ArrowUpIcon
              isDetailsExpanded={isDetailsExpanded}
              src={ArrowUp}
              alt=""
            />
          </ArrowContainer>
        </Footer>
      </Container>
    );
  }
}
