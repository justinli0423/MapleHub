import { Classes } from "./consts";

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
    Hover: "#968856",
    ContrastWhite: "#D6D3CB",
    FadedWhite: "rgba(124,116,86, 0.2)",
    [Classes.WARRIOR]: "rgba(179, 81, 101, 0.6)",
    [Classes.MAGICIAN]: "rgba(83, 145, 169, 0.6)",
    [Classes.BOWMAN]: "rgba(158, 181, 118, 0.6)",
    [Classes.THIEF]: "rgba(102, 78, 197, 0.6)",
    [Classes.PIRATE]: "rgba(123, 126, 125, 0.6)",
    [Classes.XENON]: "rgba(102, 78, 197, 0.6)",
    [Classes.ALL]: "rgba(185, 157, 123, 0.6)",
  },
};

export default Colors;
