import styled from "styled-components";

import * as React from "react";

const Header = ({ src, children }) => {
  console.log(children);
  return (
    <Container>
      <Banner src={src} />
      <HeaderContainer>{children}</HeaderContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  text-align: center;
`;

const HeaderContainer = styled.div`
  height: 250px;
  width: 1024px;
  margin: 0 auto;
`;

const Banner = styled.img`
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  object-fit: cover;
  filter: blur(1.5px) grayscale(1) brightness(0.35);
`;

export default Header;
