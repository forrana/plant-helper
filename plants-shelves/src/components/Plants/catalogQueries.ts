import { gql } from '@apollo/client';


const PLANT_ENTRY_BY_FRAGMENT = gql`
  query PlantEntriesByNameFragment($nameFragment: String!) {
    plantEntriesByNameFragment(nameFragment: $nameFragment) {
      nickName, nickNames, scientificName, daysBetweenWateringGrowingInt, daysBetweenWateringDormantInt
    }
  }
`;

const PLANT_ENTRY_BY_NICK_NAME_FRAGMENT = gql`
  query NickNameEntriesByNameFragment($nameFragment: String!) {
    nickNameEntriesByNameFragment(nameFragment: $nameFragment) {
      name, plantEntry {
        scientificName, daysBetweenWateringGrowingInt, daysBetweenWateringDormantInt
      }
    }
  }
`;


export { PLANT_ENTRY_BY_FRAGMENT, PLANT_ENTRY_BY_NICK_NAME_FRAGMENT }
