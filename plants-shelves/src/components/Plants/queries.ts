import { gql } from '@apollo/client';
const GET_ALL_PLANTS = gql`
query {
  plants {
    id, name, scientificName, daysUntilNextWatering, daysBetweenWatering, daysBetweenWateringGrowing, daysBetweenWateringDormant, daysPostpone
    symbol {
      userWideId
    }
    room {
      id,
      roomName
    }
  }
}
`;

const GET_ALL_ROOMS = gql`
  query {
    rooms {
      id, roomName
    }
  }
`;
const ROOMS_BY_NAME_FRAGMENT = gql`
  query RoomsByNameFragment($nameFragment: String!) {
    roomsByNameFragment(nameFragment: $nameFragment) {
      id, roomName
    }
  }
`;

const ADD_PLANT = gql`
  mutation CreatePlant($plantName: String!, $scientificName: String!, $daysBetweenWateringGrowing: Int!, $daysBetweenWateringDormant: Int!) {
    createPlant(plantName: $plantName, scientificName: $scientificName, daysBetweenWateringGrowing: $daysBetweenWateringGrowing, daysBetweenWateringDormant: $daysBetweenWateringDormant) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering, daysBetweenWateringGrowing, daysBetweenWateringDormant, daysPostpone
        symbol {
          userWideId
        }
        room {
          id,
          roomName
        }
      }
    }
  }
`;

const WATER_PLANT = gql`
  mutation WaterPlant($plantId: ID!) {
    waterPlant(plantId: $plantId) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering, daysBetweenWateringGrowing, daysBetweenWateringDormant, daysPostpone
        symbol {
          userWideId
        }
        room {
          id,
          roomName
        }
      }
    }
  }
`;

const POSTPONE_WATERING = gql`
  mutation PostponeWatering($plantId: ID!, $postponeDays: Int!) {
    postponeWatering(plantId: $plantId, days: $postponeDays) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering, daysBetweenWateringGrowing, daysBetweenWateringDormant, daysPostpone
        symbol {
          userWideId
        }
        room {
          id,
          roomName
        }
      }
    }
  }
`;

const UPDATE_PLANT = gql`
  mutation UpdatePlant($plantId: ID!, $plantName: String!, $scientificName: String!, $daysBetweenWateringGrowing: Int!, $daysBetweenWateringDormant: Int!, $postponeDays: Int!, $groupName: String) {
    updatePlant(plantId: $plantId, plantName: $plantName, scientificName: $scientificName, daysBetweenWateringGrowing: $daysBetweenWateringGrowing, daysBetweenWateringDormant: $daysBetweenWateringDormant, postponeDays: $postponeDays, groupName: $groupName) {
      plant {
        id, name, scientificName, daysUntilNextWatering, daysBetweenWatering, daysBetweenWateringGrowing, daysBetweenWateringDormant, daysPostpone
        symbol {
          userWideId
        }
        room {
          id,
          roomName
        }
      }
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($plant1Id: ID!, $plant2Id: ID!) {
    createRoom(plant1Id: $plant1Id, plant2Id: $plant2Id) {
      ok
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

export {
  GET_ALL_PLANTS,
  GET_ALL_ROOMS,
  ADD_PLANT,
  WATER_PLANT,
  UPDATE_PLANT,
  DELETE_PLANT,
  CREATE_SUBSCRIPTION,
  GET_SUBSCRIPTION,
  POSTPONE_WATERING,
  CREATE_ROOM,
  ROOMS_BY_NAME_FRAGMENT
}
