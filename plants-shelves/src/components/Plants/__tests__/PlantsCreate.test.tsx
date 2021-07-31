import React from 'react';
import { act, fireEvent, render, screen, Screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { GlobalState, PlantType } from '../models';
import { ADD_PLANT } from '../queries';
import { PlantsCreate } from '../PlantsCreate';
import { MemoryRouter } from 'react-router-dom';

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
  {
    request: {
      query: ADD_PLANT,
      variables: { plantName: "error", scientificName: newPlant.scientificName}
    },
    error:
      { message: "Something went wrong" },
  },
];

const mockCallback = jest.fn(() => null)

const createPlant = async (screen: Screen) => {
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
}

test('Match snapshot', async () => {
  const {container} = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithPlant} addTypename={false}>
        <PlantsCreate action={mockCallback}/>
      </MockedProvider>
    </MemoryRouter>,
  );

  expect(container).toMatchSnapshot()
});

test('Allow to create plant', async () => {
 render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithPlant} addTypename={false}>
        <PlantsCreate action={mockCallback}/>
      </MockedProvider>
    </MemoryRouter>,
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

  expect(mockCallback).toBeCalledTimes(1)
});

test('Don\'t create plant with empty fields', async () => {
  render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithPlant} addTypename={false}>
         <PlantsCreate action={mockCallback}/>
       </MockedProvider>
     </MemoryRouter>,
   );

   await act(async () => {
     fireEvent.click(
       screen.getByText(/Add plant/i),
       { target: { value: newPlant.scientificName } }
     )
     await new Promise(resolve => setTimeout(resolve, 0));
   });

   expect(mockCallback).not.toBeCalled()
 });

 test('Don\'t create plant with error response', async () => {
  render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithPlant} addTypename={false}>
         <PlantsCreate action={mockCallback}/>
       </MockedProvider>
     </MemoryRouter>,
   );

   await act(async () => {
     fireEvent.click(
       screen.getByText(/Add plant/i),
       { target: { value: newPlant.scientificName } }
     )
     await new Promise(resolve => setTimeout(resolve, 0));
   });

   await act(async () => {
    fireEvent.change(
      screen.getByTestId("name-input"),
      { target: { value: "error" } }
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

   expect(mockCallback).not.toBeCalled()
 });