import styled from "styled-components";

const DefaultButton = styled.button`
  width: 250px;
  height: 40px;
  margin: 24px 0 80px;
  color: white;
  background: transparent;
  border: 4px solid #b60d0d;
  border-radius: 22px;
  font-size: 16px;
  font-weight: normal;

  &:active, &:visited, &:focus {
    outline: none;
  }
`;

function Button({
  label = "Button",
  callback = () => {
    console.log("callback");
  },
}) {
  return <DefaultButton onClick={callback}>{label}</DefaultButton>;
}

export default Button;
