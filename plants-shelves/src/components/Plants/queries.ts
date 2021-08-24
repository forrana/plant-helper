import { gql } from '@apollo/client';
const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
    symbol {
      userWideId
    }
  }
}
`;

const ADD_PLANT = gql`
  mutation CreatePlant($plantName: String!, $scientificName: String!) {
    createPlant(plantName: $plantName, scientificName: $scientificName) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
        symbol {
          userWideId
        }
      }
    }
  }
`;

const WATER_PLANT = gql`
  mutation WaterPlant($plantId: ID!) {
    waterPlant(plantId: $plantId) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
        symbol {
          userWideId
        }
      }
    }
  }
`;

const UPDATE_PLANT = gql`
  mutation UpdatePlant($plantId: ID!, $plantName: String!, $scientificName: String!) {
    updatePlant(plantId: $plantId, plantName: $plantName, scientificName: $scientificName) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering
        symbol {
          userWideId
        }
      }
    }
  }
`;

const DELETE_PLANT = gql`
  mutation DeletePlant($plantId: ID!) {
    deletePlant(plantId: $plantId) {
      ok
    }
  }
`;



export { GET_ALL_PLANTS, ADD_PLANT, WATER_PLANT, UPDATE_PLANT, DELETE_PLANT }
