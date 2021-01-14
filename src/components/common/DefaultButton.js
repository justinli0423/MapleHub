import styled from "styled-components";

import { Button } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";

import Colors from "../../common/Colors";

const StyledButton = styled(Button)`
  color: white;
  margin: 24px 0 40px;
  font-size: 16px;
  font-weight: normal;
  background: ${Colors.MapleRed};
`;

function DefaultButton({
  className,
  label = "Button",
  callback = () => {
    console.log("callback");
  },
}) {
  return (
    <StylesProvider injectFirst>
      <StyledButton
        variant='contained'
        onClick={callback}
        className={className}
      >
        {label}
      </StyledButton>
    </StylesProvider>
  );
}

export default DefaultButton;
