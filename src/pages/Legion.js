import React, { Component } from "react";
import styled from "styled-components";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import LegionNav from "../components/LegionNav";

export default class Legion extends Component {
  render() {
    return (
      <>
        <Header src={process.env.PUBLIC_URL + "/legionbanner.jpg"}>
          <Title
            title="Legion Board Presets"
            caption="Save you legion presets here to easily switch in game."
          />
        </Header>
        <Container>
          <LegionNav callback={this.setLegionRank} />
          <LegionContainer></LegionContainer>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 1024px;
  margin: 40px auto;
`;

const LegionContainer = styled.div`
  position: relative;
`;
