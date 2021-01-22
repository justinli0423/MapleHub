import React, { Component } from "react";
import styled, { css } from "styled-components";

import LegionStore from "../legionUtils/LegionStore";

import Colors from "../common/colors";

import Title from "../components/common/Title";
import Header from "../components/common/Header";
import LegionNav from "../components/LegionNav";

const tileSize = 25;
const numTilesWidth = 22;
const numTilesHeight = 20;

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

  renderGrid() {
    const { grid, toggleLegionTile, toggleMouseEvent } = this.state.legionStore;
    let count = 0;
    return (
      <tbody onMouseLeave={(ev) => toggleMouseEvent(ev, false)}>
        {grid.map((row, i) => (
          <tr key={i}>
            {row.map((val, j) => {
              const cell = (
                <GridCell
                  key={count}
                  index={count}
                  val={val}
                  onMouseDown={(ev) => {
                    toggleLegionTile(ev, i, j, true);
                    toggleMouseEvent(ev, true);
                  }}
                  onMouseUp={(ev) => toggleMouseEvent(ev, false)}
                  onMouseOver={(ev) => toggleLegionTile(ev, i, j)}
                ></GridCell>
              );
              count++;
              return cell;
            })}
          </tr>
        ))}
      </tbody>
    );
  }

  render() {
    return (
      <>
        <Header src={process.env.PUBLIC_URL + "/legionbanner.jpg"}>
          <Title
            title='Legion Board Solver'
            caption='My attempt to brute force the legion grid :)'
          />
        </Header>
        <Container>
          <LegionNav callback={this.setLegionRank} />
          <LegionContainer>
            {this.renderTextOverlays()}
            <PaddingContainer>
              <GridContainer>{this.renderGrid()}</GridContainer>
            </PaddingContainer>
          </LegionContainer>
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

const GridContainer = styled.table`
  border-collapse: collapse;
  border-spacing: 0px;
  width: ${tileSize * numTilesWidth + 8}px;
  height: ${tileSize * numTilesHeight + 8}px;
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

const GridCell = styled.td`
  padding: ${tileSize / 2}px;
  font-size: 8px;
  color: white;
  background: ${({ val }) =>
    val === 0
      ? "transparent"
      : val < 1
      ? Colors.Legion.Disabled
      : Colors.Legion.Hover};

  ${({ index }) => {
    const defaultShadow = `0 0 0 0.5px ${Colors.Legion.FadedWhite}`;
    const highlightOpacity = 1 - Math.abs(index - 220) / 220;
    const highlightBorder = `1px solid rgba(214, 211, 203, ${highlightOpacity})`;
    // hardcode outlines
    if (index === 120 || index === 340 || index === 224 || index === 236) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }
    if (index === 324) {
      return css`
        box-shadow: ${defaultShadow};
        border-right: ${highlightBorder};
      `;
    }

    if (index === 418 || index === 439) {
      return css`
        box-shadow: ${defaultShadow};
        border-bottom: ${highlightBorder};
      `;
    }
    if (index === 126 || index === 230) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }
    // top-left quadrant
    if (index % 23 === 0 && index < 220) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }
    // bottom-right quadrant
    if ((index - 1) % 23 === 0 && index > 220) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }
    // top-right quadrant
    if (index % 21 === 0 && index < 220) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }
    // bottom-left quadrant
    if ((index + 1) % 21 === 0 && index > 220) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }
    // vertical middle
    if (index % (10 + 22 * Math.floor(index / numTilesWidth)) === 0) {
      return css`
        box-shadow: ${defaultShadow};
        border-right: ${highlightBorder};
      `;
    }
    // horizontal middle
    if (index >= 220 && index <= 241) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
      `;
    }
    // top border of middle square
    if (index >= 115 && index <= 126) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
      `;
    }
    // bottom border of middle square
    if (index >= 335 && index <= 346) {
      return css`
        box-shadow: ${defaultShadow};
        border-top: ${highlightBorder};
      `;
    }
    // left border of middle square
    if (
      index % (4 + 22 * Math.floor(index / numTilesWidth)) === 0 &&
      index % (8 + 22 * Math.floor(index / numTilesWidth)) &&
      index % (12 + 22 * Math.floor(index / numTilesWidth)) &&
      index % (16 + 22 * Math.floor(index / numTilesWidth)) &&
      index % (20 + 22 * Math.floor(index / numTilesWidth)) &&
      index >= 114 &&
      index <= 312
    ) {
      return css`
        box-shadow: ${defaultShadow};
        border-right: ${highlightBorder};
      `;
    }
    // right border of middle square
    if (
      index % (16 + 22 * Math.floor(index / numTilesWidth)) === 0 &&
      index >= 114 &&
      index <= 312
    ) {
      return css`
        box-shadow: ${defaultShadow};
        border-right: ${highlightBorder};
      `;
    }
    return css`
      box-shadow: 0 0 0 1px ${Colors.Legion.FadedWhite};
    `;
  }}
`;
