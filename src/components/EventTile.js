import React, { Component } from "react";

import styled from "styled-components";

import ArrowDown from "../icons/chevron-down-solid.svg";
import ArrowUp from "../icons/chevron-up-solid.svg";

const Container = styled.div`
  position: relative;
  width: 450px;
  height: 230px;
  margin: 16px;
  padding: 16px;
  border-radius: 5px;
  background: #ffffff;
  box-shadow: 4px 5px 3px rgba(0, 0, 0, 0.25);
  flex: 0 0 45%;
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
const ArrowContainer = styled.div`
`;

const ArrowIcon = styled.img`
  width: 28px;
  height: 28px;
  padding: 3px;
  border-radius: 50%;

  &:hover {
    transform: scale(1.15);
    filter: drop-shadow( 2px 2px 1px #d3d3d3);
  }
`;

const ArrowUpIcon = styled(ArrowIcon)`
  display: none;
`;

const ArrowDownIcon = styled(ArrowIcon)`
  display: block;
`;

export default class EventTile extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.eventDetails;
    this.arrowDownRef = React.createRef();
    this.arrowUpRef = React.createRef();
  }

  render() {
    return (
      <Container>
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
        <Footer>
          <span>Show Details</span>
          <ArrowContainer>
            <ArrowDownIcon ref={this.arrowDownRef} src={ArrowDown} alt="" />
            <ArrowUpIcon ref={this.arrowUpRef} src={ArrowUp} alt="" />
          </ArrowContainer>
        </Footer>
      </Container>
    );
  }
}
