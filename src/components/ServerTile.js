import React, { Component } from "react";
import styled from "styled-components";

import PingServer from "../serverUtils/PingServer";

import Colors from "./../common/Colors";

export default class ServerTile extends Component {
  constructor(props) {
    super(props);
    const { channelId, ip, port, latencyThreshold } = this.props;
    this.state = {
      channelId,
      ip,
      port,
      latencyThreshold,
      server: new PingServer(
        channelId,
        ip,
        port,
        latencyThreshold,
        this.forceRender
      ),
    };
  }

  componentDidMount() {
    this.state.server.pingChannel();
  }

  componentWillUnmount() {
    this.state.server.unmount();
  }

  forceRender = (latency, averageTenLatencies) => {
    this.setState({
      ...this.state,
      latency,
      averageTenLatencies,
    });
  };

  render() {
    const {
      channelId,
      latencyThreshold,
      averageTenLatencies,
      latency,
    } = this.state;
    return (
      <Container>
        <ServerName>Ch. {channelId}</ServerName>
        Latency: {latency}
        <StatusBar>
          <ActiveStatus threshold={latencyThreshold} latency={latency} />
        </StatusBar>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 172px;
  height: 80px;
  margin: 4px;
  color: ${Colors.White};
  background: ${Colors.Black};
  border-radius: 10px;
`;

const ActiveStatus = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ threshold, latency }) => {
    const ratio = latency / threshold;
    if (ratio >= 1) {
      return 0;
    } else {
      return `${(1 - ratio) * (160 - 10)}px`;
    }
  }};
  height: 18px;
  background: ${Colors.White};
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 0 10px 10px 0;
`;

const StatusBar = styled.div`
  position: relative;
  width: 160px;
  height: 18px;
  margin: 0 auto;
  background: linear-gradient(90deg, #75d965 0%, #ffb930 50%, #e81515 100%);
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  /* &::before {
    content: "";
    z-index: 1;
    position: absolute;
    left: 0;
    height: 100%;
    width: calc(80px + 10px);
    background: linear-gradient(90deg, #75d965 0%, #ffb930 50%, #e81515 100%);
    border-radius: 10px;
  }

  &::after {
    content: "";
    position: absolute;
    right: 0;
    height: 100%;
    width: calc(160px - 80px);

    border-radius: 0 10px 10px 0;
  } */
`;

const ServerName = styled.h2`
  margin: 8px;
  font-weight: normal;
`;
