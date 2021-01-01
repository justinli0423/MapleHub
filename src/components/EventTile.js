import React, { Component } from "react";

import styled from "styled-components";

import ArrowDown from "../icons/chevron-down-solid.svg";
import ArrowUp from "../icons/chevron-up-solid.svg";

const Container = styled.div`
  position: relative;
  flex: ${({ isDetailsExpanded }) =>
    isDetailsExpanded ? "0 0 calc(90% + 52px)" : "0 0 45%"};
  height: ${({ isDetailsExpanded }) => (isDetailsExpanded ? "500px" : "230px")};
  margin: 16px;
  padding: 16px;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 4px 5px 3px rgba(0, 0, 0, 0.25);
`;

const EventHeader = styled.h2`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 16px;
`;

const EventSubheader = styled.h3`
  display: inline-block;
  margin: 4px 4px 4px 8px;
  font-weight: bold;
  font-size: 16px;
`;

const EventDetails = styled.p`
  display: inline;
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
      ...this.props.eventDetails,
      isDetailsExpanded: false,
    };
  }

  handleDetailsToggle() {
    this.setState({
      ...this.state,
      isDetailsExpanded: !this.state.isDetailsExpanded,
    });
  }

  render() {
    const { isDetailsExpanded } = this.state;
    return (
      <Container isDetailsExpanded={isDetailsExpanded}>
        <EventHeader>Event Title</EventHeader>
        <EventSubheader>Available after:</EventSubheader>
        <EventDetails>date and time</EventDetails>
        <br />
        <EventSubheader>Duration:</EventSubheader>
        <EventDetails>date and time</EventDetails>
        <br />
        <EventSubheader>Requirements:</EventSubheader>
        <EventDetails>date and time</EventDetails>
        <br />
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
