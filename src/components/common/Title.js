import styled from "styled-components";

import Colors from "../../common/colors";
import { isMobile } from "../../common/MediaQueries";

const Header = styled.h1`
  padding: 72px 0 24px 0;

  font-size: 32px;
  font-weight: normal;

  ${isMobile} {
    font-size: 24px;
  }
`;

const Caption = styled.p`
  margin: 0 auto;
  max-width: 700px;
  line-height: 25px;

  ${isMobile} {
    padding: 0 24px;
    font-size: 16px;
  }
`;

const Container = styled.div`
  position: relative;
  color: #d3d3d3;
  color: ${Colors.BackgroundGrey};
  text-align: center;
  text-shadow: 3px 3px 0px black;
`;

function Title({ title, caption }) {
  return (
    <Container>
      <Header>{title}</Header>
      <Caption>{caption}</Caption>
    </Container>
  );
}

export default Title;
