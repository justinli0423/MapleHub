import React, { Component } from "react";
import styled from "styled-components";

import Title from "../components/common/Title";
import Button from "../components/common/DefaultButton";

import ServerTile from "../components/ServerTile";

import RebootPng from "../icons/reboot.png";

import ServerDetails from "../serverUtils/ServerDetails";

export default class ServerStatus extends Component {
  render() {
    return (
      <Container>
        <Title
          title='Server Status'
          caption='The response times below will show both the average of the last 10 pings as well  as the last ping. Pings will trigger itself every 10 seconds against each channel asynchronously'
        />
        <StatusContainer>
          <HeaderContainer>
            <ServerName>
              <Icon src={RebootPng} />
              <Header>Reboot</Header>
            </ServerName>
            <StyledButton label='Refresh Pings' />
          </HeaderContainer>
          <ServerContainer>
            {ServerDetails.map((server, i) => (
              <ServerTile
                channelId={server.channelId}
                ip={server.ip}
                port={server.port}
                key={i}
                latencyThreshold={1200}
              />
            ))}
          </ServerContainer>
        </StatusContainer>
      </Container>
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
`;

const ServerName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Header = styled.h2`
  margin: 0 8px;
`;

const Icon = styled.img`
  margin: 0 8px;
`;

const StyledButton = styled(Button)`
  margin: 0 16px;
`;

const ServerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 900px;
  margin: 32px auto;
`;
