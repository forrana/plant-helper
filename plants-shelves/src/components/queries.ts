import { gql } from '@apollo/client';
export const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name
  }
}
`;
