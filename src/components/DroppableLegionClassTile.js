import React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget, useDrop } from "react-dnd";

import { addLegionTile } from "../redux/actions";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";
import { Classes } from "../common/consts";
import { tileSize } from "../legionUtils/LegionDetails";

const DroppableLegionClassTile = ({
  addLegionTile,
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
      const originalX = item.position.x;
      const originalY = item.position.y;
      const x =
        Math.floor(
          (originalX + monitor.getDifferenceFromInitialOffset().x) / 25
        ) * 25;
      const y =
        Math.floor(
          (originalY + monitor.getDifferenceFromInitialOffset().y) / 25
        ) * 25;
      addLegionTile(
        { ...item },
        {
          x,
          y,
        }
      );
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
export default connect(null, {
  addLegionTile,
})(
  DropTarget(ItemTypes.LEGION, {}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    droppedTile: monitor.getItem(),
  }))(
    DragSource(
      ItemTypes.LEGION,
      {
        beginDrag: (props) => ({
          classes: props.legion.classes,
          position: props.position,
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
  )
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
