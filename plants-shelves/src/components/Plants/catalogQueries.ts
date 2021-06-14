import { gql } from '@apollo/client';


const PLANT_ENTRY_BY_FRAGMENT = gql`
  query PlantEntriesByNameFragment($nameFragment: String!) {
    plantEntriesByNameFragment(nameFragment: $nameFragment) {
      nickName
    }
  }
`;


export { PLANT_ENTRY_BY_FRAGMENT }
