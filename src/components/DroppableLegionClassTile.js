import React, { Component } from "react";
import styled, { css } from "styled-components";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";
import { Classes } from "../common/consts";
import { tileSize } from "../legionUtils/LegionDetails";

class DroppableLegionClassTile extends Component {
  render() {
    const {
      position,
      legion,
      isMapped,
      isDragging,
      connectDragSource,
      connectDropTarget,
    } = this.props;

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
            connectDropTarget(connectDragSource(findDOMNode(instance)))
          }
          isMapped={isMapped}
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
                    isMapped={isMapped}
                  >
                    <CellSpacing isMapped={isMapped} />
                  </LegionTile>
                ))}
              </LegionPill>
            ))}
          </tbody>
        </LegionTable>
      </Container>
    );
  }
}

DroppableLegionClassTile = DragSource(
  ItemTypes.LEGION,
  {
    beginDrag: (props) => ({
      classes: props.legion.classes,
      grid: props.legion.grid,
      id: props.legion.id,
      isMapped: props.isMapped,
    }),
    endDrag: (props, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      // TODO: increment count of tiles here
    },
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(DroppableLegionClassTile);

DroppableLegionClassTile = DropTarget(ItemTypes.LEGION, {}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DroppableLegionClassTile);

export default DroppableLegionClassTile;

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

  ${({ isMapped }) =>
    isMapped
      ? css`
          width: 100%;
          height: 100%;
          margin: 0;
        `
      : undefined}
`;

const LegionPill = styled.tr``;

const CellSpacing = styled.div`
  height: ${tileSize / 2}px;
  width: ${tileSize / 2}px;
  background: transparent;

  ${({ isMapped }) =>
    !isMapped
      ? undefined
      : css`
          height: ${24}px;
          width: ${24}px;
        `};
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
