import React from 'react';
import { act, fireEvent, render, screen, Screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { PlantType } from '../models';
import { UPDATE_PLANT } from '../queries';
import { MemoryRouter } from 'react-router-dom';
import PlantsEdit from '../PlantsEdit';
import { getRandomString } from '../utils';

const plant: PlantType = {
  id: 1,
  name: "Aloe 1",
  scientificName: "Aloe Vera" ,
  daysUntilNextWatering: 0,
  daysBetweenWatering: 7
 };

const newName = getRandomString(10)
const newScName = getRandomString(10)

const mocksWithPlant: any = [
  {
    request: {
      query: UPDATE_PLANT,
      variables: { plantId: plant.id, plantName: newName, scientificName: newScName }
    },
    result: {
      data:  plant,
    },
  },
  {
    request: {
      query: UPDATE_PLANT,
      variables: { plantName: "error", scientificName: plant.scientificName}
    },
    error:
      { message: "Something went wrong" },
  },
];

const mockCallback = jest.fn(() => null)

test('Match snapshot', async () => {
  const {container} = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithPlant} addTypename={false}>
        <PlantsEdit plant={plant} index={0} action={mockCallback}/>
      </MockedProvider>
    </MemoryRouter>,
  );

  expect(container).toMatchSnapshot()
});

test('Allow to edit plant', async () => {
 render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <PlantsEdit plant={plant} index={0} action={mockCallback}/>
      </MockedProvider>
    </MemoryRouter>,
  );

  await act(async () => {
    fireEvent.change(
      screen.getByTestId("plant-name-input"),
      { target: { value: newName } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByTestId("plant-scientific-name-input"),
      { target: { value: newScName } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTitle(/Save/i)
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  expect(mockCallback).toBeCalledTimes(1)
});

test('Don\'t call action on error', async () => {
    render(
       <MemoryRouter>
         <MockedProvider mocks={mocksWithPlant} addTypename={false}>
         <PlantsEdit plant={plant} index={0} action={mockCallback}/>
         </MockedProvider>
       </MemoryRouter>,
     );

     await act(async () => {
       fireEvent.change(
         screen.getByTestId("plant-name-input"),
         { target: { value: "error" } }
       )
     });

     await act(async () => {
       fireEvent.click(
         screen.getByTitle(/Save/i)
       )
       await new Promise(resolve => setTimeout(resolve, 0));
     });

     expect(mockCallback).toBeCalledTimes(0)
});

test('Don\'t update with empty value', async () => {
    render(
       <MemoryRouter>
         <MockedProvider mocks={mocksWithPlant} addTypename={false}>
         <PlantsEdit plant={plant} index={0} action={mockCallback}/>
         </MockedProvider>
       </MemoryRouter>,
     );

     await act(async () => {
       fireEvent.change(
         screen.getByTestId("plant-name-input"),
         { target: { value: newName } }
       )
     });

     await act(async () => {
       fireEvent.change(
         screen.getByTestId("plant-scientific-name-input"),
         { target: { value: "" } }
       )
     });

     await act(async () => {
       fireEvent.click(
         screen.getByTitle(/Save/i)
       )
       await new Promise(resolve => setTimeout(resolve, 0));
     });

     expect(mockCallback).toBeCalledTimes(0)
});

