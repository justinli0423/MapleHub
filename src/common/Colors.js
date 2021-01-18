import { Classes } from "../common/Consts";

const Colors = {
  MapleRed: "#b60d0d",
  BackgroundGrey: "#d3d3d3",
  White: "#FFF",
  Black: "#3C3939",
  TrueBlack: "#000000",
  StatusBar: {
    Green: "#75d965",
    Yellow: "#ffb930",
    Red: "#e81515",
  },
  Legion: {
    Disabled: "#1f1e1c",
    Bronze: "radial-gradient(50% 50% at 50% 50%, #6a634b 0%, #2d2c29 100%)",
    Hover: '#968856',
    ContrastWhite: "#D6D3CB",
    FadedWhite: "rgba(124,116,86, 0.2)",
    [Classes.WARRIOR]: "#B35165",
    [Classes.MAGICIAN]: "#5391A9",
    [Classes.BOWMAN]: "#9EB576",
    [Classes.THIEF]: "#664EC5",
    [Classes.PIRATE]: "#7B7E7D",
    [Classes.XENON]: "#664EC5",
    [Classes.ALL]: "#B99D7B",
  },
};

export default Colors;
