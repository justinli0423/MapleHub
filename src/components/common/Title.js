import styled from "styled-components";

const Header = styled.h1`
  padding: 72px 0 24px 0;
  font-size: 32px;
  font-weight: normal;
`;

const Caption = styled.p``;

const Container = styled.div`
  position: relative;
  text-align: center;
  color: #D3D3D3;
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
