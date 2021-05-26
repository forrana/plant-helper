export interface PlantType {
  id: number;
  name: string;
  scientificName: string;
  daysUntilNextWatering: number;

}

export interface PlantData {
  plants: PlantType[];
}
