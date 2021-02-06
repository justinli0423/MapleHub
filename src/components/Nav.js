import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import styled from "styled-components";
import moment from "moment";

import Home from "../pages/Home";
import ServerStatus from "../pages/ServerStatus";
import Legion from "../pages/Legion";
import Events from "../pages/Events";

import { isMobile, isTablet } from "../common/MediaQueries";

export default class Nav extends Component {
  constructor() {
    super();
    this.state = {
      intervalHandler: null,
      currTime: new Date(),
      menuAnchor: null,
    };
  }

  componentDidMount() {
    const timerHandler = setInterval(() => {
      this.setTimer();
    }, 1000);
    this.setState({
      ...this.state,
      timerHandler,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timerHandler);
  }

  setTimer = () => {
    this.setState({
      ...this.state,
      serverTime: new Date(),
    });
  };

  mobileMenuClick = (event) => {
    if (!event.currentTarget) {
      return;
    }

    this.setState({
      ...this.state,
      menuAnchor: event.currentTarget,
    });
  };

  mobileMenuClose = () => {
    this.setState({
      ...this.state,
      menuAnchor: null,
    });
  };

  render() {
    const { menuAnchor } = this.state;
    return (
      <Router>
        <Container>
          <LogoContainer>
            <LogoBar />
            <h1>MapleHub</h1>
            <Icon />
            <TimerContainer>
              {moment(this.state.serverTime)
                .utc()
                .format("ddd MMM Do, h:mm:ss a")}
            </TimerContainer>
          </LogoContainer>
          <OptionsContainer>
            <StyledLink exact to=''>
              <Item>
                <ActiveBar />
                Updates
              </Item>
            </StyledLink>
            <StyledLink to='/status'>
              <Item>
                <ActiveBar />
                Status
              </Item>
            </StyledLink>
            {/* <StyledLink exact to='/legion'>
              <Item>
                <ActiveBar />
                Legion Board
              </Item>
            </StyledLink> */}
            <StyledLink to='/reminders'>
              <Item>
                <ActiveBar />
                Reminders
              </Item>
            </StyledLink>
            {/* <Item>
              <ActiveBar />
              Maple.gg
            </Item> */}
          </OptionsContainer>
        </Container>

        <MobileContainer>
          <AppBar position='sticky' color='default'>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={this.mobileMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant='h6'>MapleHub</Typography> <Icon />
              <Menu
                id='simple-menu'
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={this.mobileMenuClose}
              >
                <MenuItem onClick={this.mobileMenuClose}>
                  <StyledLink exact to=''>
                    Updates
                  </StyledLink>
                </MenuItem>
                <MenuItem onClick={this.mobileMenuClose}>
                  <StyledLink to='/status'>Status</StyledLink>
                </MenuItem>
                {/* <MenuItem onClick={this.mobileMenuClose}>Legion Board</MenuItem> */}
              </Menu>
            </Toolbar>
          </AppBar>
        </MobileContainer>

        <MainContainer>
          <Switch>
            <Route path='/legion'>
              <Legion />
            </Route>
            <Route path='/status'>
              <ServerStatus />
            </Route>
            <Route path='/reminders'>
              <Events />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </MainContainer>
      </Router>
    );
  }
}

const Container = styled.div`
  z-index: 100000;
  position: sticky;
  top: 0;
  /* height: 100px; */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f6f6f6;
  border-bottom: 3px solid #e5e5e5;

  ${isMobile} {
    display: none;
  }
`;

const MobileContainer = styled.div`
  display: none;

  ${isMobile} {
    display: block;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 100%;
  margin-right: 24px;
`;

const LogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 40px 0 24px;

  h1 {
    font-weight: normal;
  }
`;

const Icon = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  margin-top: -40px;
  background: url("maple.png") no-repeat local center;
  background-size: 50px 50px;
`;

const LogoBar = styled.div`
  position: absolute;
  width: 6px;
  height: 50px;
  left: 0px;
  border-radius: 0 10px 10px 0;
  background: #b60d0d;
`;

const ActiveBar = styled.div`
  position: absolute;
  width: 100%;
  height: 6px;
  top: 0px;
  background: #b60d0d;
  border-radius: 0 0 10px 10px;
`;

const Item = styled.span`
  display: inline-block;
  position: relative;
  height: 100%;
  padding: 20px 0;
  margin: 0 48px;
  font-size: 12px;

  ${ActiveBar} {
    opacity: 0;
  }
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: black;

  &.active {
    ${ActiveBar} {
      opacity: 1;
    }
  }
`;

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid grey; */
`;

const TimerContainer = styled.div`
  width: 250px;
  margin-left: 16px;
`;
