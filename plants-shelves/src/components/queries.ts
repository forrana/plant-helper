import { gql } from '@apollo/client';
const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name
  }
}
`;

const ADD_PLANT = gql`
  mutation AddPlant($name: String!, $scientific_name: String!) {
    addTodo(name: $name, scientific_name: $scientific_name) {
      id
      name
      scientific_name
    }
  }
`;

export { GET_ALL_PLANTS, ADD_PLANT }
