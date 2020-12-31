import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import styled from "styled-components";
import Home from '../pages/Home';

const Container = styled.div`
  z-index: 100000;
  position: sticky;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f6f6f6;
  border-bottom: 3px solid #e5e5e5;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 100%;

  span {
    height: 100%;
    padding: 40px 0;
  }
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
  position: relative;
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
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  /* border: 1px solid grey; */
`;

export default function Nav() {
  return (
    <Router>
      <Container>
        <LogoContainer>
          <LogoBar />
          <h1>MapleHub</h1>
          <Icon />
        </LogoContainer>
        <OptionsContainer>
          <StyledLink exact to="">
            <Item>
              <ActiveBar />
              Updates
            </Item>
          </StyledLink>
          <StyledLink to="/reminders">
            <Item>
              <ActiveBar />
              Reminders
            </Item>
          </StyledLink>
          <StyledLink to="/legion">
            <Item>
              <ActiveBar />
              Legion Board
            </Item>
          </StyledLink>
          <Item>
            <ActiveBar />
            Maple.gg
          </Item>
        </OptionsContainer>
      </Container>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <MainContainer>
        <Switch>
          <Route path="/legion">
            <Legion />
          </Route>
          <Route path="/reminders">
            <Reminders />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </MainContainer>
    </Router>
  );
}

function Legion() {
  return <h2>Legion Board</h2>;
}

function Reminders() {
  return <h2>Reminders</h2>;
}
