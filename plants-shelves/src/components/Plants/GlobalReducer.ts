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
    case 'delete':
      const leftPlants = state.plants.filter( (plant, index) => index !== action.index )
      return { plants: leftPlants }
    default:
      throw new Error();
  }
}

export { globalReducer, initialGlobalState };
