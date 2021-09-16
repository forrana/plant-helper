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
  mutation CreatePlant($plantName: String!, $scientificName: String!, $daysBetweenWatering: Int!) {
    createPlant(plantName: $plantName, scientificName: $scientificName, daysBetweenWatering: $daysBetweenWatering) {
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

const POSTPONE_WATERING = gql`
  mutation PostponeWatering($plantId: ID!, $postponeDays: Int!) {
    postponeWatering(plantId: $plantId, days: $postponeDays) {
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
  mutation UpdatePlant($plantId: ID!, $plantName: String!, $scientificName: String!, $daysBetweenWatering: Int!) {
    updatePlant(plantId: $plantId, plantName: $plantName, scientificName: $scientificName, daysBetweenWatering: $daysBetweenWatering) {
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

const GET_SUBSCRIPTION = gql`
  query {
    subscription
  }
`

const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($endpoint: String!, $p256dh: String!, $auth: String!, $permissionGiven: Boolean!) {
    createSubscription(endpoint: $endpoint, p256dh: $p256dh, auth: $auth, permissionGiven: $permissionGiven) {
      ok
    }
  }
`



export { GET_ALL_PLANTS, ADD_PLANT, WATER_PLANT, UPDATE_PLANT, DELETE_PLANT, CREATE_SUBSCRIPTION, GET_SUBSCRIPTION, POSTPONE_WATERING}
