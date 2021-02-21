import { ADD_TILE, REMOVE_TILE } from "../actionTypes";

const initialState = {
  overlayTiles: {},
  overlayTileIds: [],
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TILE: {
      const { id, position, legion } = action.payload;
      const overlayTileIds = state.overlayTileIds.filter(
        (tileId) => tileId !== id
      );
      return {
        ...state,
        overlayTileIds,
        overlayTiles: {
          ...state.overlayTiles,
          [id]: {
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
