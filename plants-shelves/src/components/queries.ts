import { gql } from '@apollo/client';
const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
  }
}
`;

const ADD_PLANT = gql`
  mutation CreatePlant($plantName: String!, $scientificName: String!) {
    createPlant(plantName: $plantName, scientificName: $scientificName) {
      plant {
        name,
        scientificName
      }
    }
  }
`;

const WATER_PLANT = gql`
  mutation WaterPlant($plantId: ID!) {
    waterPlant(plantId: $plantId) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
      }
    }
  }
`;


export { GET_ALL_PLANTS, ADD_PLANT, WATER_PLANT }
