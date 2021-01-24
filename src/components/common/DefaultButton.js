import { Button } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";

import Colors from "../../common/colors";

// styled components not rendering consistently
// using inline instead
function DefaultButton({
  className,
  label = "Button",
  callback = () => {
    console.log("callback");
  },
}) {
  return (
    <Button
      variant='contained'
      onClick={callback}
      className={className}
      style={{
        color: "white",
        margin: "24px 0 40px",
        fontSize: "16px",
        padding: "6px 14px",
        fontWeight: "normal",
        borderRadius: "8px",
        background: Colors.MapleRed,
      }}
    >
      {label}
    </Button>
  );
}

export default DefaultButton;
