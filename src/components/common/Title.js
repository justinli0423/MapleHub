import styled from "styled-components";

const Header = styled.h1`
  margin: 72px 0 24px 0;
  font-size: 32px;
  font-weight: normal;
`;

const Caption = styled.p``;

const Container = styled.div`
  text-align: center;
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
