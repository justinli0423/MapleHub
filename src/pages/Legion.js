import React, { Component } from "react";
import styled, { css } from "styled-components";
import Colors from "../common/Colors";

import Title from "../components/common/Title";
import Header from "../components/common/Header";

const tileSize = 30;
const numTilesWidth = 22;
const numTilesHeight = 20;
const verticalIndicies = [10, 32, 54];

export default class Legion extends Component {
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
          <GridContainer>
            {new Array(numTilesHeight * numTilesWidth).fill(0).map((_, i) => (
              <GridCell key={i} index={i}>
                {i}
              </GridCell>
            ))}
          </GridContainer>
        </Container>
      </>
    );
  }
}

const Container = styled.div`
  width: 1024px;
  margin: 40px auto;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: ${tileSize * numTilesWidth + 8}px;
  height: ${tileSize * numTilesHeight + 8}px;
  margin: 0 auto;
  padding: 4px;
  border-radius: 4px;
  background: ${Colors.Legion.Bronze};
`;

const GridCell = styled.div`
  flex: 1 0 4.5%;
  width: ${tileSize}px;
  height: ${tileSize}px;
  padding: 5px;
  font-size: 8px;
  color: white;

  ${({ index }) => {
    const defaultBorder = `0 0 0 1px ${Colors.Legion.FadedWhite}`;
    const highlightBorder = `1px solid white`;
    // hardcode horizontal outlines
    if (index === 120 || index === 340 || index === 224 || index === 235) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }

    if (index === 125) {

    }

    if (index === 147 || index === 230) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }

    // top-left quadrant
    if (index % 23 === 0 && index < 220) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }

    // bottom-right quadrant
    if ((index - 1) % 23 === 0 && index > 220) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-right: ${highlightBorder};
      `;
    }

    // top-right quadrant
    if (index % 21 === 0 && index < 220) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }

    // bottom-left quadrant
    if ((index + 1) % 21 === 0 && index > 220) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
        border-left: ${highlightBorder};
      `;
    }

    // vertical middle
    if (index % (10 + 22 * Math.floor(index / numTilesWidth)) === 0) {
      return css`
        box-shadow: ${defaultBorder};
        border-right: ${highlightBorder};
      `;
    }

    // horizontal middle
    if (index >= 220 && index <= 241) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
      `;
    }

    // top border of middle square
    if (index >= 115 && index <= 126) {
      return css`
        box-shadow: ${defaultBorder};
        border-top: ${highlightBorder};
      `;
    }

    // bottom border of middle square
    if (index >= 335 && index <= 346) {
      return css`
        box-shadow: ${defaultBorder};
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
        box-shadow: ${defaultBorder};
        border-right: ${highlightBorder};
      `;
    }

    // right border of middle square
    if (
      index % (15 + 22 * Math.floor(index / numTilesWidth)) === 0 &&
      index >= 114 &&
      index <= 312
    ) {
      return css`
        box-shadow: ${defaultBorder};
        border-right: ${highlightBorder};
      `;
    }

    return `box-shadow: 0 0 0 1px ${Colors.Legion.FadedWhite}`;
  }}
`;
