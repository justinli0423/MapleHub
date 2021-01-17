import { Classes, LegionRanks } from "../common/Consts";

const LegionDetails = [
  { name: "Nameless Legion Rank I", minLevel: 500, attackers: 9 },
  { name: "Nameless Legion Rank II", minLevel: 1000, attackers: 10 },
  { name: "Nameless Legion Rank III", minLevel: 1500, attackers: 11 },
  { name: "Nameless Legion Rank IV", minLevel: 2000, attackers: 12 },
  { name: "Nameless Legion Rank V", minLevel: 2500, attackers: 13 },
  { name: "Renowned Legion Rank I", minLevel: 3000, attackers: 18 },
  { name: "Renowned Legion Rank II", minLevel: 3500, attackers: 19 },
  { name: "Renowned Legion Rank III", minLevel: 4000, attackers: 20 },
  { name: "Renowned Legion Rank IV", minLevel: 4500, attackers: 21 },
  { name: "Renowned Legion Rank V", minLevel: 5000, attackers: 22 },
  { name: "Heroic Legion Rank I", minLevel: 5500, attackers: 27 },
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
    rank: LegionRanks.B,
    levelReq: 60,
    classes: [Classes.ALL],
    grid: [
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.A,
    levelReq: 100,
    classes: [Classes.ALL],
    grid: [
      [0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.S,
    levelReq: 140,
    classes: [Classes.MAGICIAN, Classes.BOWMAN, Classes.THIEF, Classes.XENON],
    grid: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.S,
    levelReq: 140,
    classes: [Classes.WARRIOR, Classes.PIRATE],
    grid: [
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SS,
    levelReq: 200,
    classes: [Classes.WARRIOR],
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SS,
    levelReq: 200,
    classes: [Classes.MAGICIAN],
    grid: [
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SS,
    levelReq: 200,
    classes: [Classes.BOWMAN],
    grid: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SS,
    levelReq: 200,
    classes: [Classes.THIEF, Classes.XENON],
    grid: [
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SS,
    levelReq: 200,
    classes: [Classes.PIRATE],
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.WARRIOR],
    grid: [
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.MAGICIAN],
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.BOWMAN],
    grid: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.THIEF],
    grid: [
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.PIRATE],
    grid: [
      [1, 1, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ],
  },
  {
    rank: LegionRanks.SSS,
    levelReq: 250,
    classes: [Classes.XENON],
    grid: [
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
];

export { LegionDetails, LegionClasses };
