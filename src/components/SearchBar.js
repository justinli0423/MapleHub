import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";

const Container = styled.div`
  position: relative;
  width: calc(1024px - 32px);
  background: #fff;
  height: auto;
  margin: 16px auto 0;
`;

const StyledTextField = styled(TextField)`
  width: 300px;
`;

export default class SearchBar extends React.Component {
  handleAutocompleteInputChange(ev, val) {
    // default search to empty string
    this.props.callback(val ?? '');
  }

  render() {
    return (
      <Container>
        <Autocomplete
          id='free-solo-demo'
          options={this.props.sectionDetails.map((event) => event.eventName)}
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
      </Container>
    );
  }
}
