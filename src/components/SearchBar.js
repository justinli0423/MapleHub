import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: calc(1024px - 32px);
  height: auto;
  margin: 16px auto 0;
`;

const StyledTextField = styled(TextField)`
  width: 300px;
`;

const FilterPillsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex: 1 0 50%;
`;

const FilterPill = styled.img`
  width: 20px;
`;

export default class SearchBar extends React.Component {
  handleAutocompleteInputChange(ev, val) {
    // default search to empty string
    this.props.callback(val ?? "");
  }

  render() {
    return (
      <Container>
        <Autocomplete
          options={this.props.searchObject.map((event) => event.eventName)}
          onChange={this.handleAutocompleteInputChange.bind(this)}
          renderInput={(params) => (
            <StylesProvider injectFirst>
              <StyledTextField
                {...params}
                label='Event Name'
                variant='outlined'
              />
            </StylesProvider>
          )}
        />
        <FilterPillsContainer>
          {this.props.filterPills.map((filter, i) => (
            <FilterPill key={i} src={filter.icon} alt={filter.tooltip}/>
          ))}
        </FilterPillsContainer>
      </Container>
    );
  }
}
