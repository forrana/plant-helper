export interface PlantType {
  id: number;
  name: string;
  scientificName: string;
  daysUntilNextWatering: number;
  daysBetweenWatering: number;
  symbol: SymbolType;
  daysPostpone: number;
}

export interface SymbolType {
  userWideId: number
}

export interface PlantsData {
  plants: PlantType[];
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

export interface PlantSuggestion {
  nickName: string
  scientificName: string
}

export interface GlobalState extends PlantsData { }

export interface loadAction { type: 'load', plants: PlantType[] }
export interface addAction { type: 'add', plant: PlantType }
export interface updateAction { type: 'update', plant: PlantType, index: number }
export interface deleteAction { type: 'delete', index: number }

export type GlobalReducerAction =
  | addAction
  | loadAction
  | updateAction
  | deleteAction;
