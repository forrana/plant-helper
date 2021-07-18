import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import PlantsContainer from './PlantsContainer';
import { GlobalState } from './models';
import { GET_ALL_PLANTS } from './queries';

const mocks: any = [
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

test('Show loading screen during loading process', () => {
  const state: GlobalState = { plants: [] }
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <PlantsContainer state={state}/>
    </MockedProvider>,
  );
  const loadingScreen = screen.getByText(/Loading/i);
  expect(loadingScreen).toBeInTheDocument();
});

test('Show create button for new user', async () => {
  const state: GlobalState = { plants: [] }
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <PlantsContainer state={state}/>
    </MockedProvider>,
  );

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });


  const createButton = screen.getByText(/Create!/i);
  expect(createButton).toBeInTheDocument();
});

