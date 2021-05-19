import { gql } from '@apollo/client';
export const GET_CITY_BY_NAME = gql`
query {
  plants {
    id, name
  }
}
`;
