import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

import PlantsContainer from '../PlantsContainer';
import { GlobalState, PlantType } from '../models';
import { GET_ALL_PLANTS } from '../queries';
import { getRandomString } from '../utils';

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
  daysBetweenWatering: 7,
  symbol: {
    userWideId: 1
  }
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
const errorMessage: string = getRandomString(10)

const mocksWithError: any = [
  {
    request: {
      query: GET_ALL_PLANTS,
    },
    error: {
        message: errorMessage

      },
  },
];

const mocksWithUnauthorizedError: any = [
  {
    request: {
      query: GET_ALL_PLANTS,
    },
    error: {
        message: "Unauthorized"
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

test('Show error', async () => {
  render(
    <MockedProvider mocks={mocksWithError} addTypename={false}>
      <PlantsContainer state={stateWithPlant}/>
    </MockedProvider>,
  );

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  const error = screen.getByText(new RegExp(errorMessage, "i"));

  expect(error).toBeInTheDocument();
});

test('Redirect on unautharized error', async () => {
  const {container} = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithUnauthorizedError} addTypename={false}>
        <PlantsContainer state={stateWithPlant}/>
      </MockedProvider>
    </MemoryRouter>,
  );

  expect(container).toHaveTextContent("Loading...")

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  expect(container).not.toHaveTextContent("Loading...")
});

