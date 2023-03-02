export interface PlantType {
  id: number;
  name: string;
  scientificName: string;
  daysUntilNextWatering: number;
  daysBetweenWatering: number;
  daysBetweenWateringGrowing: number;
  daysBetweenWateringDormant: number;
  symbol: SymbolType;
  daysPostpone: number;
  room: RoomType;
  owner: OwnerType;
}

export interface OwnerType {
  username: string
}

export interface SymbolType {
  userWideId: number
}

export interface RoomType {
  roomName: string
  id: number
  colorBackground: string
  plants?: PlantType[]
}

export interface PlantsData {
  plants: PlantType[];
}

export interface RoomsData {
  rooms: RoomType[];
}

export interface Subscription {
  endpoint: string,
  p256dh: string,
  auth: string,
  permission_given: boolean
}

export interface SubscriptionData {
  subscription: boolean
}

export interface PlantData {
  plant: PlantType;
}

export interface RoomData {
  room: RoomType;
}

export interface PlantSuggestion {
  nickName: string,
  nickNames: Array<string>,
  scientificName: string,
  daysBetweenWateringGrowingInt: number,
  daysBetweenWateringDormantInt: number
}

export interface PlantNickName {
  name: string,
  plantEntry: PlantSuggestion
}

export interface GlobalState extends PlantsData { rooms: RoomType[] }

export interface loadAction     { type: 'load', plants: PlantType[] }
export interface loadRoomsAction{ type: 'loadRooms', rooms: RoomType[] }
export interface addAction      { type: 'add', plant: PlantType }
export interface addRoomAction  { type: 'addRoom', room: RoomType}
export interface updateRoomAction { type: 'updateRoom', room: RoomType}
export interface updateAction   { type: 'update', plant: PlantType, index: number }
export interface deleteAction   { type: 'delete', index: number }

export type GlobalReducerAction =
  | addAction
  | addRoomAction
  | updateRoomAction
  | loadAction
  | loadRoomsAction
  | updateAction
  | deleteAction;
