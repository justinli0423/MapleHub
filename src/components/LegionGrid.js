import React, { useState } from "react";
import styled, { css } from "styled-components";
import { DropTarget, useDrop } from "react-dnd";
import { findDOMNode } from "react-dom";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";

import {
  numTilesHorizontal,
  LegionTileState,
} from "../legionUtils/LegionDetails";

import DroppableLegionClassTile from "./DroppableLegionClassTile";

/**
 *
 * @param {number} tileId
 * takes in the legion tile ID, and create a "hash"
 * so that you can have multiple of the same legion tiles
 * in memory without colliding
 */
const createNewTileId = (tileId) => {
  if (tileId.indexOf("#") === -1) {
    return tileId + "#" + Date.now();
  }
  return tileId.split("#")[0] + "#" + Date.now();
};

const LegionGrid = ({ grid, connectDropTarget, droppedTile }) => {
  let tileIndexCount = 0;
  const [overlayTiles, setOverlayTiles] = useState({});
  const [overlayTileIds, setOverlayTileIds] = useState([]);

  const updateLegionTilePosition = (legion, tileId, droppedPosition) => {
    const tileElement = overlayTiles[tileId];
    if (!tileElement || !droppedPosition) {
      return;
    }
    const prevOffsetTop = tileElement.position.y;
    const prevOffsetLeft = tileElement.position.x;
    const { offsetTop, offsetLeft } = droppedPosition;
    // round to the closest tile position, but shift left by 1 because of borders
    const x = Math.round((prevOffsetLeft + offsetLeft) / 25) * 25 - 1;
    const y = Math.round((prevOffsetTop + offsetTop) / 25) * 25;

    addNewOverlayTile(legion, { x, y }, tileId);
  };

  const [, dropRef] = useDrop({
    accept: ItemTypes.LEGION,
    drop: (item, monitor) => {
      const { x, y } = monitor.getDifferenceFromInitialOffset();
      const el = document.getElementById(droppedTile.id);
      if (el) {
        const tileOffset = el.getBoundingClientRect();
        const gridContainer = document.querySelector(
          "table#legionTableContainer"
        );
        const gridRect = gridContainer.getBoundingClientRect();
        const tileLeftOffset = tileOffset.left;
        const tileTopOffset = tileOffset.top;
        // subtract 1 from the offset to account for borders
        const viewportOffsetLeft =
          Math.round((x + tileLeftOffset - gridRect.x) / 25) * 25 - 1;
        const viewportOffsetTop =
          Math.round((y + tileTopOffset - gridRect.y) / 25) * 25;

        if (!item.isMapped) {
          // this is for dragging from the menu to the grid
          // i.e. first time using a tile
          // const offsetParent = elAtPosition.offsetParent;
          item.id = createNewTileId(item.id);
          addNewOverlayTile(
            { ...item },
            {
              x: viewportOffsetLeft,
              y: viewportOffsetTop,
            }
          );
        } else {
          // reusing a tile - need different coords calculation
          updateLegionTilePosition({ ...item }, droppedTile.id, {
            offsetTop: y,
            offsetLeft: x,
          });
        }
      }
    },
  });

  // tileId is for moving existing tiles instead of creating new ones
  const addNewOverlayTile = (legion, position, tileId = null) => {
    // remove the old data first to prevent duplicate in id array
    removeOverlayTile(tileId);
    setOverlayTiles({
      ...overlayTiles,
      [tileId ?? legion.id]: {
        position,
        legion,
      },
    });
    setOverlayTileIds([...overlayTileIds, tileId ?? legion.id]);
  };

  const removeOverlayTile = (tileId) => {
    const index = overlayTileIds.indexOf(tileId);
    if (index === -1) {
      return overlayTileIds;
    }
    const newOverlayTiles = { ...overlayTiles };
    const newOverlayTilesIds = overlayTileIds.filter((id) => id !== tileId);
    delete newOverlayTiles[tileId];
    setOverlayTileIds(newOverlayTilesIds);
    setOverlayTiles(newOverlayTiles);
    return newOverlayTilesIds;
  };

  const generateOverlayTiles = () => {
    return overlayTileIds.map((id) => {
      console.log(overlayTiles, overlayTileIds);
      const { position, legion } = overlayTiles[id];
      return <DroppableLegionClassTile position={position} legion={legion} />;
    });
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
