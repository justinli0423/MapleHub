import React, { useState } from "react";
import styled, { css } from "styled-components";
import { DropTarget, useDrop } from "react-dnd";
import { findDOMNode } from "react-dom";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";

import {
  tileSize,
  numTilesHorizontal,
  numTilesVertical,
  LegionTileState,
} from "../legionUtils/LegionDetails";

import LegionClassTile from "./LegionClassTile";

const LegionGrid = ({
  grid,
  handleDroppedLegionTile,
  connectDropTarget,
  droppedTile,
}) => {
  let tileIndexCount = 0;
  const [overlayTiles, setOverlayTiles] = useState({});
  const [overlayTileIds, setOverlayTileIds] = useState([]);
  const [, dropRef] = useDrop({
    accept: ItemTypes.LEGION,
    drop: (item, monitor) => {
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      const el = document.getElementById(droppedTile.id);
      if (el) {
        const tileOffset = el.getBoundingClientRect();
        const tileLeftOffset = tileOffset.left;
        const tileTopOffset = tileOffset.top;
        const viewportOffsetLeft = x + tileLeftOffset;
        const viewportOffsetTop = y + tileTopOffset;
        const elAtPosition = document.elementFromPoint(
          viewportOffsetLeft,
          viewportOffsetTop
        );
        if (!elAtPosition || !elAtPosition.offsetParent) {
          return;
        }

        const offsetParent = elAtPosition.offsetParent;
        addNewOverlayTile(
          { ...item },
          {
            x: offsetParent.offsetLeft,
            y: offsetParent.offsetTop,
          }
        );

        // remove this ... not useful.
        // handleDroppedLegionTile(droppedTile, elAtPosition);
      }
    },
  });

  const addNewOverlayTile = (legion, position) => {
    setOverlayTiles({
      ...overlayTiles,
      [overlayTileIds.length]: (
        <Container x={position.x} y={position.y}>
          <LegionClassTile legion={legion} isMapped />
        </Container>
      ),
    });
    setOverlayTileIds([...overlayTileIds, overlayTileIds.length]);
  };

  const generateOverlayTiles = () => {
    return overlayTileIds.map((ids) => overlayTiles[ids]);
  };

  return (
    <>
      {generateOverlayTiles()}
      <tbody
        ref={(instance) => connectDropTarget(dropRef(findDOMNode(instance)))}
      >
        {grid.map((row, i) => (
          <tr key={i}>
            {row.map((tileState) => {
              const cell = (
                <GridCell
                  key={tileIndexCount}
                  index={tileIndexCount}
                  id={tileIndexCount}
                  tileState={tileState}
                >
                  <CellSpacing />
                </GridCell>
              );
              tileIndexCount++;
              return cell;
            })}
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default DropTarget(ItemTypes.LEGION, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  droppedTile: monitor.getItem(),
  didDrop: monitor.didDrop(),
}))(LegionGrid);

const Container = styled.div`
  position: absolute;
  ${({ x, y }) =>
    x >= 0 && y >= 0
      ? css`
          left: ${x}px;
          top: ${y}px;
        `
      : undefined};
`;

const CellSpacing = styled.div`
  width: 24px;
  height: 24px;
  background: transparent;
`;

const GridCell = styled.td`
  margin: 0;
  padding: 0;
  background: ${({ tileState }) => {
    if (tileState.state === LegionTileState.AVAILABLE) {
      return "transparent";
    }
    if (tileState.state === LegionTileState.DISABLED) {
      return Colors.Legion.Disabled;
    }
    return Colors.Legion.Hover;
  }};
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
    if (index % (10 + 22 * Math.floor(index / numTilesHorizontal)) === 0) {
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
      index % (4 + 22 * Math.floor(index / numTilesHorizontal)) === 0 &&
      index % (8 + 22 * Math.floor(index / numTilesHorizontal)) &&
      index % (12 + 22 * Math.floor(index / numTilesHorizontal)) &&
      index % (16 + 22 * Math.floor(index / numTilesHorizontal)) &&
      index % (20 + 22 * Math.floor(index / numTilesHorizontal)) &&
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
      index % (16 + 22 * Math.floor(index / numTilesHorizontal)) === 0 &&
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
  }};

  &:hover {
    background: ${Colors.Legion.Hover};
  }
`;
