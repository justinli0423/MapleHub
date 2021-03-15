import React from "react";
import styled from "styled-components";

import Colors from "../common/colors";
import { Classes } from "../common/consts";
import { tileSize } from "../legionUtils/LegionDetails";

const LegionClassTile = ({ legion }) => {
  return (
    <LegionTable id={legion.id}>
      <tbody>
        {legion.grid.map((row, j) => (
          <LegionPill key={j}>
            {row.map((cell, i) => (
              <LegionTile key={i} isActive={!!cell} classes={legion.classes}>
                <CellSpacing />
              </LegionTile>
            ))}
          </LegionPill>
        ))}
      </tbody>
    </LegionTable>
  );
};

export default LegionClassTile;

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
  background: ${({ isActive, classes }) =>
    isActive
      ? classes.length > 1
        ? Colors.Legion[Classes.ALL]
        : Colors.Legion[classes[0]]
      : "transparent"};
`;
