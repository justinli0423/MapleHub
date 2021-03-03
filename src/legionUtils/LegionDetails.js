import { Classes, LegionRanks } from "../common/consts";
import allClasses60 from "./tileIcons/allClasses60.png";
import allClasses100 from "./tileIcons/allClasses100.png";
import bowman200 from "./tileIcons/bowman200.png";
import bowman250 from "./tileIcons/bowman250.png";
import mage200 from "./tileIcons/mage200.png";
import mage250 from "./tileIcons/mage250.png";
import mageBowThiefXenon140 from "./tileIcons/mageBowThiefXenon140.png";
import pirate200 from "./tileIcons/pirate200.png";
import pirate250 from "./tileIcons/pirate250.png";
import thief250 from "./tileIcons/pirate200.png";
import thiefXenon200 from "./tileIcons/thiefXenon200.png";
import warrior200 from "./tileIcons/warrior200.png";
import warrior250 from "./tileIcons/warrior250.png";
import warriorPirate140 from "./tileIcons/warriorPirate140.png";
import xenon250 from "./tileIcons/xenon250.png";

const Coords = {
  first: [
    [115, 126],
    [137, 148],
    [159, 170],
    [181, 192],
    [203, 214],
    [225, 236],
    [247, 258],
    [269, 280],
    [291, 302],
    [313, 324],
  ],
  second: [
    [92, 105],
    [114, 127],
    [136, 149],
    [158, 171],
    [180, 193],
    [202, 215],
    [224, 237],
    [246, 259],
    [268, 281],
    [290, 303],
    [312, 325],
    [334, 347],
  ],
  third: [
    [69, 84],
    [92 - 1, 105 + 1],
    [114 - 1, 127 + 1],
    [136 - 1, 149 + 1],
    [158 - 1, 171 + 1],
    [180 - 1, 193 + 1],
    [202 - 1, 215 + 1],
    [224 - 1, 237 + 1],
    [246 - 1, 259 + 1],
    [268 - 1, 281 + 1],
    [290 - 1, 303 + 1],
    [312 - 1, 325 + 1],
    [334 - 1, 347 + 1],
    [355, 370],
  ],
  forth: [
    [46, 63],
    [69 - 1, 84 + 1],
    [92 - 2, 105 + 2],
    [114 - 2, 127 + 2],
    [136 - 2, 149 + 2],
    [158 - 2, 171 + 2],
    [180 - 2, 193 + 2],
    [202 - 2, 215 + 2],
    [224 - 2, 237 + 2],
    [246 - 2, 259 + 2],
    [268 - 2, 281 + 2],
    [290 - 2, 303 + 2],
    [312 - 2, 325 + 2],
    [334 - 2, 347 + 2],
    [355 - 1, 370 + 1],
    [376, 393],
  ],
  fifth: [
    [23, 42],
    [46 - 1, 63 + 1],
    [69 - 2, 84 + 2],
    [92 - 3, 105 + 3],
    [114 - 3, 127 + 3],
    [136 - 3, 149 + 3],
    [158 - 3, 171 + 3],
    [180 - 3, 193 + 3],
    [202 - 3, 215 + 3],
    [224 - 3, 237 + 3],
    [246 - 3, 259 + 3],
    [268 - 3, 281 + 3],
    [290 - 3, 303 + 3],
    [312 - 3, 325 + 3],
    [334 - 3, 347 + 3],
    [355 - 2, 370 + 2],
    [376 - 1, 393 + 1],
    [397, 416],
  ],
};

const LegionDetails = [
  {
    name: "Nameless Legion Rank I",
    minLevel: 500,
    attackers: 9,
    gridCoords: Coords.first,
  },
  {
    name: "Nameless Legion Rank II",
    minLevel: 1000,
    attackers: 10,
    gridCoords: Coords.first,
  },
  {
    name: "Nameless Legion Rank III",
    minLevel: 1500,
    attackers: 11,
    gridCoords: Coords.first,
  },
  {
    name: "Nameless Legion Rank IV",
    minLevel: 2000,
    attackers: 12,
    gridCoords: Coords.second,
  },
  {
    name: "Nameless Legion Rank V",
    minLevel: 2500,
    attackers: 13,
    gridCoords: Coords.second,
  },
  {
    name: "Renowned Legion Rank I",
    minLevel: 3000,
    attackers: 18,
    gridCoords: Coords.third,
  },
  {
    name: "Renowned Legion Rank II",
    minLevel: 3500,
    attackers: 19,
    gridCoords: Coords.third,
  },
  {
    name: "Renowned Legion Rank III",
    minLevel: 4000,
    attackers: 20,
    gridCoords: Coords.forth,
  },
  {
    name: "Renowned Legion Rank IV",
    minLevel: 4500,
    attackers: 21,
    gridCoords: Coords.forth,
  },
  {
    name: "Renowned Legion Rank V",
    minLevel: 5000,
    attackers: 22,
    gridCoords: Coords.fifth,
  },
  {
    name: "Heroic Legion Rank I",
    minLevel: 5500,
    attackers: 27,
    gridCoords: Coords.fifth,
  },
  { name: "Heroic Legion Rank II", minLevel: 6000, attackers: 28 },
  { name: "Heroic Legion Rank III", minLevel: 6500, attackers: 29 },
  { name: "Heroic Legion Rank IV", minLevel: 7000, attackers: 30 },
  { name: "Heroic Legion Rank V", minLevel: 7500, attackers: 31 },
  { name: "Legendary Legion Rank I", minLevel: 8000, attackers: 36 },
  { name: "Legendary Legion Rank II", minLevel: 8500, attackers: 37 },
  { name: "Legendary Legion Rank III", minLevel: 9000, attackers: 38 },
  { name: "Legendary Legion Rank IV", minLevel: 9500, attackers: 39 },
  { name: "Legendary Legion Rank V", minLevel: 10000, attackers: 40 },
];

const LegionClasses = [
  {
    id: "allClasses60",
    rank: LegionRanks.B,
    icon: allClasses60,
    levelReq: 60,
    classes: [Classes.ALL],
    grid: [
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "allClasses100",
    rank: LegionRanks.A,
    icon: allClasses100,
    levelReq: 100,
    classes: [Classes.ALL],
    grid: [
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "mageBowThiefXenon140",
    rank: LegionRanks.S,
    icon: mageBowThiefXenon140,
    levelReq: 140,
    classes: [Classes.MAGICIAN, Classes.BOWMAN, Classes.THIEF, Classes.XENON],
    grid: [
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "warriorPirate140",
    rank: LegionRanks.S,
    icon: warriorPirate140,
    levelReq: 140,
    classes: [Classes.WARRIOR, Classes.PIRATE],
    grid: [
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "warrior200",
    rank: LegionRanks.SS,
    icon: warrior200,
    levelReq: 200,
    classes: [Classes.WARRIOR],
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "mage200",
    rank: LegionRanks.SS,
    icon: mage200,
    levelReq: 200,
    classes: [Classes.MAGICIAN],
    grid: [
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "bowman200",
    rank: LegionRanks.SS,
    icon: bowman200,
    levelReq: 200,
    classes: [Classes.BOWMAN],
    grid: [
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "thiefXenon200",
    rank: LegionRanks.SS,
    icon: thiefXenon200,
    levelReq: 200,
    classes: [Classes.THIEF, Classes.XENON],
    grid: [
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "pirate200",
    rank: LegionRanks.SS,
    icon: pirate200,
    levelReq: 200,
    classes: [Classes.PIRATE],
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
  },
  {
    id: "warrior250",
    rank: LegionRanks.SSS,
    icon: warrior250,
    levelReq: 250,
    classes: [Classes.WARRIOR],
    grid: [
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "mage250",
    rank: LegionRanks.SSS,
    icon: mage250,
    levelReq: 250,
    classes: [Classes.MAGICIAN],
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
    ],
  },
  {
    id: "bowman250",
    rank: LegionRanks.SSS,
    icon: bowman250,
    levelReq: 250,
    classes: [Classes.BOWMAN],
    grid: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "thief250",
    rank: LegionRanks.SSS,
    icon: thief250,
    levelReq: 250,
    classes: [Classes.THIEF],
    grid: [
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    id: "pirate250",
    rank: LegionRanks.SSS,
    icon: pirate250,
    levelReq: 250,
    classes: [Classes.PIRATE],
    grid: [
      [1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    id: "xenon250",
    rank: LegionRanks.SSS,
    icon: xenon250,
    levelReq: 250,
    classes: [Classes.XENON],
    grid: [
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
];

const tileSize = 25;
const numTilesHorizontal = 22;
const numTilesVertical = 20;

const LegionTileState = {
  DISABLED: -1,
  AVAILABLE: 0,
  OCCUPIED: 1,
  OVERLAPPED: 2,
};

export {
  LegionDetails,
  LegionClasses,
  tileSize,
  numTilesHorizontal,
  numTilesVertical,
  LegionTileState,
};
