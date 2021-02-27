import { ADD_TILE, REMOVE_TILE } from "../actionTypes";

const initialState = {
  overlayTiles: {},
  overlayTileIds: [],
};

/**
 *
 * @param {number} tileId
 * takes in the legion tile ID, and create a "hash"
 * so that you can have multiple of the same legion tiles
 * in memory without colliding
 */
const createUniqueTileId = (tileId) => {
  if (!tileId.includes("#")) {
    return tileId + "#" + Date.now();
  }
  return tileId;
};

/**
 *
 * @param {x, y} position
 * Checks if the tile position extends out of the current
 * legion grid - should not render if it does.
 * Since the position is relative we just need to check
 * if it is positive and within the area.
 * We allow -1 on horizontal alignment for border overlap purposes
 */
const isTileInGrid = (position, tile) => {
  // TODO: need to check for tile height as well
  const actualTileWidth =
    Math.max(...tile.map((row) => row.lastIndexOf(1))) + 1;
  const gridContainer = document.querySelector("table#legionTableContainer");
  const gridRect = gridContainer.getBoundingClientRect();

  console.log(actualTileWidth);
  return (
    position.x >= -1 &&
    position.x <= gridRect.width - 25 * actualTileWidth &&
    position.y >= 0 &&
    position.y <= gridRect.height
  );
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TILE: {
      // will also update if the legion ID exists
      const { position, legion } = action.payload;
      if (!isTileInGrid(position, legion.grid)) {
        return state;
      }
      legion.id = createUniqueTileId(legion.id);
      const overlayTileIds = state.overlayTileIds
        .filter((tileId) => tileId !== legion.id)
        .concat(legion.id);
      return {
        ...state,
        overlayTileIds,
        overlayTiles: {
          ...state.overlayTiles,
          [legion.id]: {
            position,
            legion,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default events;
