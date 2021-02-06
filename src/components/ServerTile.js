import React, { Component } from "react";
import styled from "styled-components";

import PingServer from "../serverUtils/PingServer";

import Colors from "./../common/colors";
import { isMobile, isTablet } from "./../common/MediaQueries";

const statusWidth = 150;
const statusHeight = 16;

export default class ServerTile extends Component {
  constructor(props) {
    super(props);
    const { channelId, ip, port } = this.props;
    this.state = {
      latency: 0,
      averageTenLatencies: [],
      intervalHandler: null,
      server: new PingServer(channelId, ip, port, this.forceRender),
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.ip !== this.props.ip) {
      const { channelId, ip, port } = this.props;
      this.state.server.updateServerDomains(channelId, ip, port);
    }
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
    const { averageTenLatencies, latency } = this.state;
    const { channelId, showAverage, latencyThreshold } = this.props;

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
        <Latency isActive>
          {showAverage ? displayAverageLatency : displayLatency}
        </Latency>
        <StatusBar>
          <ActiveStatus
            threshold={latencyThreshold}
            latency={showAverage ? averageLatency : latency}
          />
        </StatusBar>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  width: 172px;
  height: 80px;
  margin: 4px;
  color: ${Colors.White};
  background: ${Colors.Black};
  border-radius: 10px;

  ${isTablet} {
    flex: 1 0 calc(25% - 8px);
  }

  ${isMobile} {
    flex: 1 0 calc(50% - 8px);
    width: unset;
  }
`;

const ActiveStatus = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${({ threshold, latency }) => {
    const ratio = latency / threshold;
    if (ratio >= 0.995) {
      return 0;
    } else {
      return `${Math.max(7, (1 - ratio) * (statusWidth - 10))}px`;
    }
  }};
  height: ${statusHeight}px;
  background: ${Colors.White};
  border-radius: 0 10px 10px 0;
`;

const StatusBar = styled.div`
  display: block;
  position: relative;
  width: ${statusWidth}px;
  height: ${statusHeight}px;
  margin: 0 auto;
  background: linear-gradient(
    90deg,
    ${Colors.StatusBar.Green} 0%,
    ${Colors.StatusBar.Yellow} 50%,
    ${Colors.StatusBar.Red} 100%
  );
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  ${isMobile} {
    width: calc(100% - 24px);
  }
`;

const ServerName = styled.h2`
  margin: 4px 8px 0;
  font-weight: normal;
`;

const Latency = styled.p`
  display: ${({ isActive }) => (isActive ? "block" : "none")};
  margin: 0 0 4px 8px;
  color: ${({ latency, threshold }) => {
    if (!latency) {
      return "unset";
    }
    return latency <= threshold * 0.33
      ? Colors.StatusBar.Green
      : latency <= threshold * 0.66
      ? Colors.StatusBar.Yellow
      : Colors.StatusBar.Red;
  }};
`;
