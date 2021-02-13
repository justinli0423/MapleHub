import {
  numTilesHorizontal,
  numTilesVertical,
  LegionTileState,
} from "./LegionDetails";

class LegionStore {
  isMouseDown = false;
  legionRank = null;
  grid = [];
  firstTileState = 0;

  constructor(forceRender) {
    this.forceRender = forceRender;
  }

  updateLegionGrid = (legionRank = null) => {
    const grid = [];
    if (!legionRank || !legionRank.gridCoords) {
      for (let i = 0; i < numTilesVertical; i++) {
        grid.push([]);
        for (let j = 0; j < numTilesHorizontal; j++) {
          grid[i].push(LegionTileState.AVAILABLE);
        }
      }
    } else {
      const { gridCoords } = legionRank;
      const activeGridCoords = [];
      const activeLegionTiles = {};
      for (let i = 0; i < gridCoords.length; i++) {
        const newArray = Array(gridCoords[i][1] - gridCoords[i][0] + 1).fill(
          LegionTileState.AVAILABLE
        );
        const startIndex = gridCoords[i][0];
        activeGridCoords.push(...newArray.map((_, i) => i + startIndex));
      }
      activeGridCoords.forEach((coords) => {
        Object.assign(activeLegionTiles, {
          [coords]: coords,
        });
      });
      for (let i = 0; i < numTilesVertical; i++) {
        grid.push([]);
        for (let j = 0; j < numTilesHorizontal; j++) {
          const index = i * 22 + j;
          grid[i].push(
            activeLegionTiles[index]
              ? LegionTileState.AVAILABLE
              : LegionTileState.DISABLED
          );
        }
      }
    }

    this.grid = grid;
    this.forceRender();
  };

  toggleMouseEvent = (ev, isMouseDown) => {
    ev.preventDefault();
    this.isMouseDown = isMouseDown;

    this.forceRender();
  };

  toggleLegionTile = (ev, i, j, isClick = false) => {
    ev.preventDefault();
    if (
      (!isClick && (this.grid[i][j] === -1 || !this.isMouseDown)) ||
      this.grid[i][j] === -1
    ) {
      return;
    }

    if (isClick) {
      this.firstTileState = this.grid[i][j] ? 0 : 1;
    }

    this.grid[i][j] = this.firstTileState;

    this.forceRender();
  };
}

export default LegionStore;
