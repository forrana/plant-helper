import { GlobalReducerAction, GlobalState } from './models'

const initialGlobalState: GlobalState  = { plants: [], rooms: [] };

const globalReducer = (state: GlobalState, action: GlobalReducerAction) => {
  switch (action.type) {
    case 'add':
      return { ...state, plants: [...state.plants, action.plant] };
    case 'addRoom':
      return { ...state, rooms: [...state.rooms, action.room] }
    case 'updateRoom':
      const updatedRooms = [...state.rooms]
      const updatedRoomIndex = updatedRooms.findIndex(room => room.id === action.room.id)
      updatedRooms[updatedRoomIndex] = action.room
      return { ...state, rooms: updatedRooms }
    case 'load':
      return { ...state, plants: [...action.plants] };
    case 'loadRooms':
      return { ...state, rooms: [...action.rooms] };
    case 'update':
      const newPlants = [...state.plants];
      const newRooms = [...state.rooms];
      const newPlant = action.plant;
      if(newPlant.room) {
        const newRoom = newPlant.room;
        const newRoomInd = newRooms.findIndex(room => room.id === newRoom.id);
        if(newRoomInd >= 0) newRooms[newRoomInd] = newRoom;
        else newRooms.push(newRoom);
      }

      newPlants[action.index] = newPlant;
      return { ...state, plants: newPlants, rooms: newRooms }
    case 'delete':
      const leftPlants = state.plants.filter( (plant, index) => index !== action.index )
      return { ...state, plants: leftPlants }
  }
}

export { globalReducer, initialGlobalState };
