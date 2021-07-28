import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { GlobalState, PlantType } from './models';
import { GET_ALL_PLANTS, WATER_PLANT } from './queries';
import { PlantsCreate } from './PlantsCreate';

const newPlant: PlantType = {
  id: 1,
  name: "Aloe 1",
  scientificName: "Aloe Vera 1" ,
  daysUntilNextWatering: 0,
  daysBetweenWatering: 7
 };


const mocksWithPlant: any = [
  {
    request: {
      query: WATER_PLANT,
      variables: { name: newPlant.name, scientificName: newPlant.scientificName}
    },
    result: {
      data:  newPlant,
    },
  },
];

test('Component should render without failing', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <PlantsCreate action={() => {}}/>
    </MockedProvider>,
  );
});

test('Should be able to create a plant', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <PlantsCreate action={() => {}}/>
    </MockedProvider>,
  );
});