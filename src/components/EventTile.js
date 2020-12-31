import { Component } from "react";

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

const ArrowContainer = styled.div`
  width: 15px;
  height: 15px;
`;

const ArrowUpIcon = styled.img`
  display: none;
`;

const ArrowDownIcon = styled.img`
  display: block;
`;

export default class EventTile extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.eventDetails;
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
            <ArrowDownIcon id="expand" src={ArrowDown} alt="" />
            <ArrowUpIcon id="expand" src={ArrowUp} alt="" />
          </ArrowContainer>
        </Footer>
      </Container>
    );
  }
}
