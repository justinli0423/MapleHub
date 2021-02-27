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

const events = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TILE: {
      // will also update if the legion ID exists
      const { position, legion } = action.payload;
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
