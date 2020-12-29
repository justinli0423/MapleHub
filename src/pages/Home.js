import { Component } from "react";
import Title from "../components/common/Title";
import Button from "../components/common/Button";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

export default class Home extends Component {
  renderBanner() {}

  renderHeader() {
    return (
      <Container>
        <Title
          title="All-In-One News Hub"
          caption="Click the button below if the News Hub is not updated!"
        />
        <Button label="Update News Hub" />
      </Container>
    );
  }

  render() {
    return this.renderHeader();
  }
}
