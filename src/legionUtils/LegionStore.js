import ReactDOM from "react-dom";
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

  setCellState(index, state = LegionTileState.OCCUPIED) {
    let count = 0;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (count === index) {
          this.grid[i][j] = state;
          console.log(this.grid[i][j], count);
          return;
        }
        count++;
      }
    }
  }

  updateLegionGrid = (legionRank = null) => {
    const grid = [];
    if (!legionRank || !legionRank.gridCoords) {
      for (let i = 0; i < numTilesVertical; i++) {
        grid.push([]);
        for (let j = 0; j < numTilesHorizontal; j++) {
          grid[i].push({
            state: LegionTileState.AVAILABLE,
            color: null,
          });
        }
      }
    } else {
      const { gridCoords } = legionRank;
      const activeGridCoords = [];
      const activeLegionTiles = {};
      for (let i = 0; i < gridCoords.length; i++) {
        const newArray = Array(gridCoords[i][1] - gridCoords[i][0] + 1).fill({
          state: LegionTileState.AVAILABLE,
          color: null,
        });
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
              ? {
                  state: LegionTileState.AVAILABLE,
                  color: null,
                }
              : {
                  state: LegionTileState.DISABLED,
                  color: null,
                }
          );
        }
      }
    }

    this.grid = grid;
    this.forceRender();
  };

  handleDroppedLegionTile = (legionTile, droppedTilePosition) => {
    console.log(legionTile, droppedTilePosition);
    const { classType, filledCells, id } = legionTile;
    let tileIndex = parseInt(droppedTilePosition.getAttribute("id"));

    if (isNaN(tileIndex)) {
      return;
    }

    console.log(filledCells, tileIndex);
    // treat dropped tile position as the first position for now
    // should check for out of bound states and disabled tiles
    filledCells.forEach((row) => {
      row.forEach((fillState) => {
        if (fillState === LegionTileState.OCCUPIED) {
          this.setCellState(tileIndex, LegionTileState.OCCUPIED);
        }
        tileIndex++;
      });
      tileIndex += numTilesHorizontal - row.length;
    });

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
