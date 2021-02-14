import React, { Component } from "react";
import styled, { css } from "styled-components";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import LegionStore from "../legionUtils/LegionStore";

import Colors from "../common/colors";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import LegionNav from "../components/LegionNav";
import LegionGrid from "../components/LegionGrid";

import {
  tileSize,
  numTilesHorizontal,
  numTilesVertical,
} from "../legionUtils/LegionDetails";

export default class Legion extends Component {
  constructor() {
    super();
    this.state = {
      legionStore: new LegionStore(this.forceRenderGrid),
      gridCache: Date.now(),
    };
  }

  componentDidMount() {
    this.state.legionStore.updateLegionGrid();
  }

  forceRenderGrid = () => {
    this.setState({
      ...this.state,
      gridCache: Date.now(),
    });
  };

  setLegionRank = (legionRank) => {
    this.state.legionStore.updateLegionGrid(legionRank);
  };

  renderTextOverlays() {
    return (
      <>
        <TextOverlay top={60} left={350}>
          Abnormal Status <br /> Resistance
        </TextOverlay>
        <TextOverlay top={67} left={570}>
          Bonus EXP
        </TextOverlay>
        <TextOverlay top={180} left={685}>
          Critical Rate
        </TextOverlay>
        <TextOverlay top={362} left={685}>
          Boss Damage
        </TextOverlay>
        <TextOverlay top={445} left={570}>
          Knockback <br /> Resistance
        </TextOverlay>
        <TextOverlay top={445} left={380}>
          Buff <br /> Duration
        </TextOverlay>
        <TextOverlay top={362} left={245}>
          Ignore DEF
        </TextOverlay>
        <TextOverlay top={180} left={225}>
          Critical Damage
        </TextOverlay>
      </>
    );
  }

  render() {
    const { legionStore } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        <Header src={process.env.PUBLIC_URL + "/legionbanner.jpg"}>
          <Title
            title='Legion Board Solver'
            caption='Save you legion presets here to easily switch in game.'
          />
        </Header>
        <Container>
          <LegionNav callback={this.setLegionRank} />
          <LegionContainer>
            {this.renderTextOverlays()}
            <PaddingContainer>
              <GridContainer>
                <LegionGrid
                  grid={legionStore.grid}
                  handleDroppedLegionTile={legionStore.handleDroppedLegionTile}
                />
              </GridContainer>
            </PaddingContainer>
          </LegionContainer>
        </Container>
      </DndProvider>
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

const GridContainer = styled.table`
  border-collapse: collapse;
  border-spacing: 0px;
  width: ${tileSize * numTilesHorizontal + 8}px;
  height: ${tileSize * numTilesVertical + 8}px;
  margin: 0 auto;
`;

const TextOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  top: ${({ top }) => (top ? `${top}px` : 0)};
  left: ${({ left }) => (left ? `${left}px` : 0)};
  color: ${Colors.White};
  text-align: center;
  text-shadow: 3px 3px 0 ${Colors.TrueBlack};
`;

const PaddingContainer = styled.div`
  width: fit-content;
  margin: 0 auto;
  padding: 8px;
  border-radius: 4px;
  background: ${Colors.Legion.Bronze};
`;
