import React, { Component } from "react";
import styled from "styled-components";

import PingServer from "../serverUtils/PingServer";

import Colors from "./../common/Colors";

const statusWidth = 150;
const statusHeight = 16;

export default class ServerTile extends Component {
  constructor(props) {
    super(props);
    const { channelId, ip, port } = this.props;
    this.state = {
      channelId,
      ip,
      port,
      latency: 0,
      averageTenLatencies: [],
      intervalHandler: null,
      server: new PingServer(channelId, ip, port, this.forceRender),
    };
  }

  componentDidMount() {
    this.state.server.pingChannel();
    // refresh ping every 10 seconds
    const intervalHandler = setInterval(() => {
      this.state.server.pingChannel();
    }, 10000);
    this.setState({
      intervalHandler,
    });
  }

  componentWillUnmount() {
    this.state.server.unmount();
    clearInterval(this.state.intervalHandler);
  }

  forceRender = (latency, averageTenLatencies) => {
    this.setState({
      ...this.state,
      latency,
      averageTenLatencies,
    });
  };

  render() {
    const { channelId, averageTenLatencies, latency } = this.state;
    const { showStat, latencyThreshold } = this.props;

    const displayLatency = latency ? `Latency: ${latency}ms` : "Waiting...";
    const averageLatency = averageTenLatencies.length
      ? Math.floor(
          averageTenLatencies.reduce((sum, val) => sum + val) /
            averageTenLatencies.length
        )
      : latency;
    const displayAverageLatency = `Average: ${averageLatency}ms`;

    return (
      <Container>
        <ServerName>Ch. {channelId}</ServerName>
        <Latency isActive>{displayLatency}</Latency>
        <Latency isActive={showStat}>{displayAverageLatency}</Latency>
        <StatusBar isActive={!showStat}>
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
      return `${(1 - ratio) * (statusWidth - 10)}px`;
    }
  }};
  height: ${statusHeight}px;
  background: ${Colors.White};
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 0 10px 10px 0;
`;

const StatusBar = styled.div`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  position: relative;
  width: ${statusWidth}px;
  height: ${statusHeight}px;
  margin: 0 auto;
  background: linear-gradient(90deg, #75d965 0%, #ffb930 50%, #e81515 100%);
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

const ServerName = styled.h2`
  margin: 4px 8px 0;
  font-weight: normal;
`;

const Latency = styled.p`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  margin: 0 0 4px 8px;
`;
