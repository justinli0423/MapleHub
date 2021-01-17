import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";

import Colors from "../common/Colors";

import { LegionDetails, LegionClasses } from "../legionUtils/LegionDetails";

export default class LegionNav extends React.Component {
  handleAutocompleteInputChange(ev, val) {
    // this.props.callback(val);
  }

  renderLegionPills() {
    return LegionClasses.map((legion) => (
      <LegionSection>
        {legion.classes.map((legionClass, i, arr) =>
          i === arr.length - 1 ? <>{legionClass}: </> : <>{legionClass}, </>
        )}
        {legion.rank} [Lv: {legion.levelReq}]
        <LegionTable>
          <tbody>
            {legion.grid.map((row) => (
              <LegionPill>
                {row.map((cell) => (
                  <LegionTile isActive={!!cell} />
                ))}
              </LegionPill>
            ))}
          </tbody>
        </LegionTable>
      </LegionSection>
    ));
  }

  render() {
    return (
      <Container>
        <Autocomplete
          options={LegionDetails.map((event) => event.name)}
          onChange={this.handleAutocompleteInputChange.bind(this)}
          renderInput={(params) => (
            <StylesProvider injectFirst>
              <TextField
                style={{
                  width: "300px",
                }}
                label='Legion Level'
                variant='outlined'
                {...params}
              />
            </StylesProvider>
          )}
        />
        <LegionPillContainer>{this.renderLegionPills()}</LegionPillContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
`;

const LegionPillContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 8px;
  border: 1px solid black;
`;

const LegionSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 4px;
`;

const LegionTable = styled.table`
  border-collapse: collapse;
  margin-left: 8px;
`;

const LegionPill = styled.tr`
  /* height: 5px; */
  border-collapse: collapse;
`;

const LegionTile = styled.td`
  height: 4px;
  width: 4px;
  border: ${({ isActive }) => (isActive ? "1px solid black" : "none")};
  background: ${({ isActive }) => (isActive ? "blue" : "transparent")};
`;
