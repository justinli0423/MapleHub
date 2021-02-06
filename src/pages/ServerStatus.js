import React, { Component } from "react";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Title from "../components/common/Title";
import Header from "../components/common/Header";
import { isMobile, MediaQueries } from "../common/MediaQueries";
import DefaultButton from "../components/common/DefaultButton";
import ServerTile from "../components/ServerTile";

import { Worlds, WorldIds } from "../serverUtils/ServerDetails";

const mediaQueries = new MediaQueries();

export default class ServerStatus extends Component {
  constructor() {
    super();
    this.state = {
      showAverage: true,
      latencyThreshold: 1200,
      timer: null,
      selectedWorld: WorldIds[1], // default reboot xd
    };
  }

  toggleShowAverage = () => {
    this.setState({
      showAverage: !this.state.showAverage,
    });
  };

  handleLatencyThreshold = (latencyThreshold) => {
    if (
      !latencyThreshold ||
      isNaN(parseInt(latencyThreshold)) ||
      latencyThreshold < 700
    ) {
      alert("Value should be more than 700ms.");
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
    }, 1000);

    this.setState({
      timer: newTimer,
    });
  };

  handleWorldChange = (_, newWorld) => {
    if (!newWorld) {
      return;
    }
    this.setState({
      ...this.state,
      selectedWorld: newWorld,
    });
  };

  render() {
    const { latencyThreshold, showAverage, selectedWorld } = this.state;

    const caption = mediaQueries.isMobile
      ? "Find how good (or bad) your channel latency is."
      : "The response times below will show both the average of the last 10 pings as well as the last ping. Pings will trigger itself every 10 seconds against each channel asynchronously.";
    return (
      <>
        <Header src={process.env.PUBLIC_URL + "/serverstatusbanner.jpg"}>
          <Title title='Server Status' caption={caption} />
        </Header>
        <Container>
          <StatusContainer>
            <StyledToggleButtonGroup
              value={selectedWorld}
              exclusive
              onChange={this.handleWorldChange}
            >
              {WorldIds.map((id) => (
                <StyledToggleButton value={Worlds[id].name}>
                  <WorldImg src={Worlds[id].img} />
                  <h3>{Worlds[id].name}</h3>
                </StyledToggleButton>
              ))}
            </StyledToggleButtonGroup>
            <HeaderContainer>
              <ServerName>
                <Icon src={Worlds[selectedWorld].img} />
                <IconLabel>{Worlds[selectedWorld].name}</IconLabel>
              </ServerName>
              <ControlsContainer>
                <TextField
                  label='Latency Threshold (ms)'
                  style={{
                    marginRight: "24px",
                    height: "56px",
                    width: "180px",
                  }}
                  defaultValue={latencyThreshold}
                  onChange={this.deboundInput}
                />
                <StyledButton
                  label={showAverage ? "Toggle Last Latency" : "Toggle Average"}
                  callback={this.toggleShowAverage}
                />
              </ControlsContainer>
            </HeaderContainer>
            <ServerContainer>
              {Worlds[selectedWorld].serverDetails.map((server, i) => (
                <ServerTile
                  key={i}
                  channelId={server.channelId}
                  ip={server.ip}
                  port={server.port}
                  latencyThreshold={latencyThreshold}
                  showAverage={showAverage}
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

  ${isMobile} {
    width: 100%;
  }
`;

const StatusContainer = styled.div`
  margin: 24px 8px 0;

  ${isMobile} {
    margin-top: 8px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 54px;

  ${isMobile} {
    margin: 0 8px;
  }
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

  ${isMobile} {
    display: none;
  }
`;

const IconLabel = styled.h2`
  margin: 0 16px;
  text-transform: capitalize;
`;

const StyledButton = styled(DefaultButton)`
  margin: 0;
  width: 230px;
`;

const Icon = styled.img`
  width: 79px;
  height: 88px;

  ${isMobile} {
    width: 30px;
    height: 34px;
  }
`;

const ServerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 900px;
  margin: 24px auto;

  ${isMobile} {
    width: 100%;
  }
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  width: 900px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 24px 56px;

  ${isMobile} {
    margin: 24px 0;
    width: 100%;
  }
`;

const WorldImg = styled.img`
  width: 18px;
  height: 20px;
  padding: 0 4px;
`;

const StyledToggleButton = styled(ToggleButton)`
  flex: 1 0 16%;

  ${isMobile} {
    h3 {
      display: none;
    }
  }
`;
