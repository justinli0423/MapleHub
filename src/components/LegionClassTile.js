import React from "react";
import styled from "styled-components";
import { findDOMNode } from "react-dom";
import { DragSource } from "react-dnd";

import Colors from "../common/colors";
import ItemTypes from "../common/ItemTypes";
import { Classes } from "../common/consts";
import { tileSize } from "../legionUtils/LegionDetails";

const LegionClassTile = ({ legion, isDragging, connectDragSource }) => {
  return (
    <LegionTable
      id={legion.id}
      ref={(instance) => connectDragSource(findDOMNode(instance))}
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
  );
};

export default DragSource(
  ItemTypes.LEGION,
  {
    beginDrag: (props) => ({
      classes: props.legion.classes,
      grid: props.legion.grid,
      id: props.legion.id,
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
)(LegionClassTile);

const LegionTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  margin: 8px 8px 0 16px;
`;

const LegionPill = styled.tr``;

const CellSpacing = styled.div`
  height: ${tileSize / 2}px;
  width: ${tileSize / 2}px;
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
