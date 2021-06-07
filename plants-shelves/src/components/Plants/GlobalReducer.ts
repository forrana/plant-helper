import { GlobalReducerAction, GlobalState } from './models'

const initialGlobalState: GlobalState  = { plants: [] };

const globalReducer = (state: GlobalState, action: GlobalReducerAction) => {
  switch (action.type) {
    case 'add':
      return { plants: [...state.plants, action.plant] };
    case 'load':
      return { plants: [...action.plants] };
    case 'update':
      const newPlants = [...state.plants]
      newPlants[action.index] = action.plant
      return { plants: newPlants }
    default:
      throw new Error();
  }
}

export { globalReducer, initialGlobalState };
