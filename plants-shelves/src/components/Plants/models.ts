export interface PlantType {
  id: number;
  name: string;
  scientificName: string;
  daysUntilNextWatering: number;
  daysBetweenWatering: number;
}

export interface PlantsData {
  plants: PlantType[];
}

export interface PlantData {
  plant: PlantType;
}


export interface GlobalState extends PlantsData { }

export type GlobalReducerAction =
  | { type: 'add', plant: PlantType }
  | { type: 'load', plants: PlantType[] }
  | { type: 'water', plant: PlantType };
