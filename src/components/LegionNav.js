import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";

import Colors from "../common/Colors";

import { LegionDetails, LegionClasses } from "../legionUtils/LegionDetails";
import { Classes } from "../common/Consts";

export default class LegionNav extends React.Component {
  handleAutocompleteInputChange(ev, val) {
    // this.props.callback(val);
  }

  renderLegionPills() {
    return LegionClasses.map((legion, i) => (
      <LegionSection key={i}>
        <Details>
          {legion.classes.map((legionClass, i, arr) =>
            i === arr.length - 1 ? <>{legionClass} </> : <>{legionClass}/</>
          )}
          [Lv: {legion.levelReq}]:
        </Details>
        <LegionTable>
          <tbody>
            {legion.grid.map((row) => (
              <LegionPill>
                {row.map((cell) => (
                  <LegionTile isActive={!!cell} classes={legion.classes} />
                ))}
              </LegionPill>
            ))}
          </tbody>
        </LegionTable>
        <TextField
          label='Number'
          type='number'
          margin='dense'
          defaultValue={0}
          InputLabelProps={{
            shrink: true,
          }}
          style={{
            width: "60px",
            padding: 0,
          }}
        />
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
                  width: "420px",
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
  width: 1024px;
  margin-bottom: 24px;
`;

const LegionPillContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  margin-top: 8px;
`;

const LegionSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex: 1 0 30%;
  margin: 2px;
`;

const Details = styled.div`
  display: flex;
  align-items: flex-end;
  height: 42px;
  width: 190px;
  overflow: hidden;
  white-space: break-spaces;
  overflow-wrap: anywhere;
`;

const LegionTable = styled.table`
  border-collapse: collapse;
  margin: 8px 8px -20px 4px;
`;

const LegionPill = styled.tr`
  border-collapse: collapse;
`;

const LegionTile = styled.td`
  height: 5px;
  width: 5px;
  border: ${({ isActive }) => (isActive ? "1px solid black" : "none")};
  background: ${({ isActive, classes }) =>
    isActive
      ? classes.length > 1
        ? Colors.Legion[Classes.ALL]
        : Colors.Legion[classes[0]]
      : "transparent"};
`;
