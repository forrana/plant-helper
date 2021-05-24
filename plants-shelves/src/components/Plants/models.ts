export interface Plant {
  id: number;
  name: string;
  scientific_name: string;
}

export interface PlantData {
  plants: Plant[];
}
