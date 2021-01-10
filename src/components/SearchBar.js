import * as React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { StylesProvider } from "@material-ui/core/styles";

import Colors from "../common/Colors";

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
  cursor: pointer;
  width: ${({ isActive }) => (isActive ? "28px" : "20px")};
  height: ${({ isActive }) => (isActive ? "28px" : "20px")};
`;

const Tooltip = styled.div`
  opacity: 0;
  visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  height: 30px;
  padding: 4px;
  border-radius: 5px;
  background: ${Colors.BackgroundGrey};
  transition: visibility 0s, opacity 0.5s linear;
`;

const PillContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: ${({ isActive }) => (isActive ? "red" : "transparent")};

  &:hover ${FilterPill} {
    transform: scale(1.4);
  }

  &:hover ${Tooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

export default class SearchBar extends React.Component {
  handleAutocompleteInputChange(ev, val) {
    this.props.callback(val);
  }

  // TODO: design better filter pills (hover and active state) as well as the tooltip
  // currently the filter pills shift on hover... probably don't want zoom effect

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
            <PillContainer key={i}>
              <Tooltip>{filter.tooltip}</Tooltip>
              <FilterPill
                src={filter.icon}
                isActive={filter.isActive}
                onClick={() => {
                  filter.callback(filter.filterType);
                  filter.isActive = !filter.isActive;
                }}
              />
            </PillContainer>
          ))}
        </FilterPillsContainer>
      </Container>
    );
  }
}