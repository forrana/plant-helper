import { gql } from '@apollo/client';
const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name, scientificName, daysUntilNextWatering
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

export { GET_ALL_PLANTS, ADD_PLANT }
