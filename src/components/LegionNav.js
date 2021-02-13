import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

import LegionClassTile from "./LegionClassTile";

import { LegionDetails, LegionClasses } from "../legionUtils/LegionDetails";

export default class LegionNav extends React.Component {
  handleAutocompleteInputChange(_, val) {
    this.props.callback(
      ...LegionDetails.filter(
        (details) => details.name.concat(` - [Lv: ${details.minLevel}]`) === val
      )
    );
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
        <LegionClassTile legion={legion} />
        {/* <TextField
          label='Number'
          type='number'
          margin='dense'
          disabled
          defaultValue={0}
          InputLabelProps={{
            shrink: true,
          }}
          style={{
            width: "60px",
            padding: 0,
          }}
        /> */}
      </LegionSection>
    ));
  }

  render() {
    return (
      <Container>
        <Autocomplete
          options={LegionDetails.map(
            (legion) => legion.name + ` - [Lv: ${legion.minLevel}]`
          )}
          onChange={this.handleAutocompleteInputChange.bind(this)}
          renderInput={(params) => (
            <TextField
              style={{
                width: "420px",
              }}
              label='Legion Rank'
              variant='outlined'
              {...params}
            />
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