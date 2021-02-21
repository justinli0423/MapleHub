import React from "react";
import styled, { css } from "styled-components";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget, useDrop } from "react-dnd";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";
import { Classes } from "../common/consts";
import { tileSize } from "../legionUtils/LegionDetails";

const DroppableLegionClassTile = ({
  position,
  legion,
  isDragging,
  droppedTile,
  connectDragSource,
  connectDropTarget,
}) => {
  const [, dropRef] = useDrop({
    accept: ItemTypes.LEGION,
    drop: (item, monitor) => {
      // TODO: deal with dropping tiles here
      if (!droppedTile) {
        return;
      }
      console.log(item);
      console.log(position);
      const el = document.getElementById(droppedTile.id);

    },
  });

  if (!position) {
    return null;
  }

  return (
    <Container
      x={position.x}
      y={position.y}
      key={`${position.x}#${position.y}`}
    >
      <LegionTable
        id={legion.id}
        ref={(instance) =>
          connectDropTarget(dropRef(connectDragSource(findDOMNode(instance))))
        }
      >
        <tbody>
          {legion.grid.map((row, j) => (
            <LegionPill key={j}>
              {row.map((cell, i) => (
                <LegionTile
                  key={i}
                  isDragging={isDragging}
                  isActive={!!cell}
                  classes={legion.classes}
                >
                  <CellSpacing />
                </LegionTile>
              ))}
            </LegionPill>
          ))}
        </tbody>
      </LegionTable>
    </Container>
  );
};

// This component will need to be drop and draggable
export default DropTarget(ItemTypes.LEGION, {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  droppedTile: monitor.getItem(),
}))(
  DragSource(
    ItemTypes.LEGION,
    {
      beginDrag: (props) => ({
        classes: props.legion.classes,
        grid: props.legion.grid,
        id: props.legion.id,
        isMapped: true,
      }),
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(DroppableLegionClassTile)
);

const Container = styled.tbody`
  position: absolute;
  ${({ x, y }) =>
    x >= 0 && y >= 0
      ? css`
          left: ${x}px;
          top: ${y}px;
        `
      : undefined};
`;

const LegionTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  margin: 8px 8px 0 16px;
  width: 100%;
  height: 100%;
  margin: 0;
`;

const LegionPill = styled.tr``;

const CellSpacing = styled.div`
  /* subtract 1 for border */
  height: ${tileSize - 1}px;
  width: ${tileSize - 1}px;
  background: transparent;
`;

const LegionTile = styled.td`
  margin: 0;
  padding: 0;
  border: ${({ isActive }) => (isActive ? "1px solid black" : "none")};
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  background: ${({ isActive, classes }) =>
    isActive
      ? classes.length > 1
        ? Colors.Legion[Classes.ALL]
        : Colors.Legion[classes[0]]
      : "transparent"};
`;
