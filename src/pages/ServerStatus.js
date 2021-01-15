import React, { Component } from "react";
import styled from "styled-components";
import { TextField } from "@material-ui/core";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import Button from "../components/common/DefaultButton";

import ServerTile from "../components/ServerTile";
import RebootPng from "../icons/reboot.png";

import ServerDetails from "../serverUtils/ServerDetails";

export default class ServerStatus extends Component {
  constructor() {
    super();
    this.state = {
      showStat: false,
      latencyThreshold: 1200,
      timer: null,
    };
  }

  toggleShowStat = () => {
    this.setState({
      showStat: !this.state.showStat,
    });
  };

  handleLatencyThreshold = (latencyThreshold) => {
    if (
      !latencyThreshold ||
      isNaN(parseInt(latencyThreshold)) ||
      latencyThreshold < 700
    ) {
      alert("Values should ideally be > 700");
      return;
    }
    this.setState({
      ...this.state,
      latencyThreshold,
    });
  };

  deboundInput = (ev) => {
    const value = ev.target.value;

    const { timer } = this.state;
    let newTimer;

    if (timer) {
      clearTimeout(timer);
    }

    newTimer = setTimeout(() => {
      this.handleLatencyThreshold(parseInt(value));
    }, 600);

    this.setState({
      timer: newTimer,
    });
  };

  renderHeader() {
    return (
      <Header src={process.env.PUBLIC_URL + "/serverstatusbanner.jpg"}>
        <Title
          title='Server Status'
          caption='The response times below will show both the average of the last 10 pings as well as the last ping. Pings will trigger itself every 10 seconds against each channel asynchronously.'
        />
      </Header>
    );
  }

  render() {
    const { latencyThreshold, showStat } = this.state;
    return (
      <>
        {this.renderHeader()}
        <Container>
          <StatusContainer>
            <HeaderContainer>
              <ServerName>
                <Icon src={RebootPng} />
                <IconLabel>Reboot</IconLabel>
              </ServerName>
              <ControlsContainer>
                <TextField
                  label='Latency Threshold'
                  style={{
                    marginRight: "24px",
                    height: "56px",
                  }}
                  defaultValue={latencyThreshold}
                  onChange={this.deboundInput}
                />
                <StyledButton
                  label='Toggle Average'
                  callback={this.toggleShowStat}
                />
              </ControlsContainer>
            </HeaderContainer>
            <ServerContainer>
              {ServerDetails.map((server, i) => (
                <ServerTile
                  channelId={server.channelId}
                  ip={server.ip}
                  port={server.port}
                  key={i}
                  latencyThreshold={latencyThreshold}
                  showStat={showStat}
                />
              ))}
            </ServerContainer>
          </StatusContainer>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  width: 1024px;
`;

const StatusContainer = styled.div`
  margin: 40px 8px 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 54px;
`;

const ServerName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const IconLabel = styled.h2`
  margin: 0 16px;
`;

const StyledButton = styled(Button)`
  margin: 0;
`;

const Icon = styled.img``;

const ServerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 900px;
  margin: 32px auto;
`;
