import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import PlantsContainer from './PlantsContainer';
import { GlobalState, PlantType } from './models';
import { GET_ALL_PLANTS, WATER_PLANT } from './queries';
import { Plant } from './Plant';

const plantUnWatered: PlantType = {
  id: 1,
  name: "Aloe 1", 
  scientificName: "Aloe Vera 1" ,
  daysUntilNextWatering: 0,
  daysBetweenWatering: 7
 };

const plantWatered: PlantType = {
  ...plantUnWatered, daysUntilNextWatering: 7
};
const mocksWithPlant: any = [
  {
    request: {
      query: GET_ALL_PLANTS,
    },
    result: {
      data: {
        plants: [plantUnWatered],
      },
    },
  },
  {
    request: {
      query: WATER_PLANT,
      variables: { plantId: plantUnWatered.id }
    },
    result: {
      data:  plantWatered,
    },
  },  
];

test('Plant should ask for watering', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );

  await act(async () => {
    fireEvent(
      screen.getByTitle('Water'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  const wateringText = screen.getByText(/Water me!/);
  expect(wateringText).toBeInTheDocument();
});

test('Watering button to be present', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );
  const wateringButton = screen.getByTitle('Water');
  expect(wateringButton).toBeInTheDocument();
});


test('Be able to enter into edit mode', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );

  const editButton = screen.getByTitle('Edit');

  await act(async () => {
    fireEvent(
      screen.getByTitle('Edit'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  const saveButton = screen.getByTitle(/Save!/);
  expect(saveButton).toBeInTheDocument();
});
