import { GlobalReducerAction, GlobalState } from './models'

const initialGlobalState: GlobalState  = { plants: [], rooms: [] };

const globalReducer = (state: GlobalState, action: GlobalReducerAction) => {
  switch (action.type) {
    case 'add':
      return { ...state, plants: [...state.plants, action.plant] };
    case 'addRoom':
      return { ...state, rooms: [...state.rooms, action.room] }
    case 'load':
      return { ...state, plants: [...action.plants] };
    case 'loadRooms':
      return { ...state, rooms: [...action.rooms] };
    case 'update':
      const newPlants = [...state.plants]
      newPlants[action.index] = action.plant
      return { ...state, plants: newPlants }
    case 'delete':
      const leftPlants = state.plants.filter( (plant, index) => index !== action.index )
      return { ...state, plants: leftPlants }
  }
}

export { globalReducer, initialGlobalState };
