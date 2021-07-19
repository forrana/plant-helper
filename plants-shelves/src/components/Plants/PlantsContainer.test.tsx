import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import PlantsContainer from './PlantsContainer';
import { GlobalState, PlantType } from './models';
import { GET_ALL_PLANTS } from './queries';

const emptyMocks: any = [
  {
    request: {
      query: GET_ALL_PLANTS,
    },
    result: {
      data: {
        plants: [],
      },
    },
  },
];
const emptyState: GlobalState = { plants: [] };
const plant: PlantType = { 
  id: 1,
  name: "Aloe 1", 
  scientificName: "Aloe Vera 1" ,
  daysUntilNextWatering: 6,
  daysBetweenWatering: 7
 };
const mocksWithPlant: any = [
  {
    request: {
      query: GET_ALL_PLANTS,
    },
    result: {
      data: {
        plants: [plant],
      },
    },
  },
];
const stateWithPlant: GlobalState = { plants: [plant] };


test('Show loading screen during loading process', () => {
  render(
    <MockedProvider mocks={emptyMocks} addTypename={false}>
      <PlantsContainer state={emptyState}/>
    </MockedProvider>,
  );
  const loadingScreen = screen.getByText(/Loading/i);
  expect(loadingScreen).toBeInTheDocument();
});

test('Show create button for new user', async () => {
  const state: GlobalState = { plants: [] }
  render(
    <MockedProvider mocks={emptyMocks} addTypename={false}>
      <PlantsContainer state={emptyState}/>
    </MockedProvider>,
  );

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });


  const createButton = screen.getByText(/Create!/i);
  expect(createButton).toBeInTheDocument();
});

test('Show existing plant', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <PlantsContainer state={stateWithPlant}/>
    </MockedProvider>,
  );

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });


  const plantName = screen.getByText(plant.name);
  expect(plantName).toBeInTheDocument();
});
