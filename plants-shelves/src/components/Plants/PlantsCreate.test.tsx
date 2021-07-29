import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { GlobalState, PlantType } from './models';
import { ADD_PLANT } from './queries';
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
      query: ADD_PLANT,
      variables: { plantName: newPlant.name, scientificName: newPlant.scientificName}
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

test('Should allow to create plant', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <PlantsCreate action={() => {}}/>
    </MockedProvider>,
  );

  await act(async () => {
    fireEvent.change(
      screen.getByTestId("name-input"),
      { target: { value: newPlant.name } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByTestId("sc-name-input"),
      { target: { value: newPlant.scientificName } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByText(/Add plant/i),
      { target: { value: newPlant.scientificName } }
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });
});