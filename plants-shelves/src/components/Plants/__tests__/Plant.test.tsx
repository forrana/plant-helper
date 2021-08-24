import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { GlobalState, PlantType } from '../models';
import { DELETE_PLANT, GET_ALL_PLANTS, WATER_PLANT } from '../queries';
import { Plant } from '../Plant';
import { getRandomString } from '../utils'

const getPlantWithXDaysToWater = (days: number): PlantType => ({
  id: 1,
  name: "Aloe 1",
  scientificName: "Aloe Vera 1" ,
  daysUntilNextWatering: days,
  daysBetweenWatering: 7,
  symbol: {
    userWideId: 1
  }
})

const plantUnWatered: PlantType = getPlantWithXDaysToWater(0)
const plant1DayToWater: PlantType = getPlantWithXDaysToWater(1)
const plant4DaysToWater: PlantType = getPlantWithXDaysToWater(4)
const plant2DaysToWater: PlantType = getPlantWithXDaysToWater(2)
const plantWIthErrornousId: PlantType = {
  id: 100,
  name: "Aloe 1",
  scientificName: "Aloe Vera 1" ,
  daysUntilNextWatering: 7,
  daysBetweenWatering: 7,
  symbol: {
    userWideId: 1
  }
}

const errorMessage: string = `error-${getRandomString(10)}`

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
        plants: [plantUnWatered, plant1DayToWater],
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
  {
    request: {
      query: DELETE_PLANT,
      variables: { plantId: plantUnWatered.id }
    },
    result: {
      data: { ok: true },
    },
  },
  {
    request: {
      query: WATER_PLANT,
      variables: { plantId: plantWIthErrornousId.id }
    },
    error: {
      message: errorMessage
    },
  },
  {
    request: {
      query: DELETE_PLANT,
      variables: { plantId: plantWIthErrornousId.id }
    },
    error: {
      message: errorMessage
    },
  },
];

test('Should indicate water me', async () => {
  const {container} = render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );

  expect(container).toMatchSnapshot()
})

test('Should indicate 1 day to water', async () => {
  const {container} = render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plant1DayToWater} index={0}/>
    </MockedProvider>,
  );

  expect(container).toMatchSnapshot()
})

test('Should indicate 4 days to water', async () => {
  const {container} = render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plant4DaysToWater} index={0}/>
    </MockedProvider>,
  );

  expect(container).toMatchSnapshot()
})

test('Should indicate 2 days to water', async () => {
  const {container} = render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plant2DaysToWater} index={0}/>
    </MockedProvider>,
  );

  expect(container).toMatchSnapshot()
})

test('Should ask for watering', async () => {
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

test('Show confirmation modal on delete action', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );

  await act(async () => {
    fireEvent(
      screen.getByTitle('Remove'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  const deleteButton = screen.getByText(/Delete!/);
  expect(deleteButton).toBeVisible()
});

test('Hide confirmation modal after deletion', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantUnWatered} index={0}/>
    </MockedProvider>,
  );

  await act(async () => {
    fireEvent(
      screen.getByTitle('Remove'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  const deleteButton = screen.getByText(/Delete!/);
  expect(deleteButton).toBeVisible()

  await act(async () => {
    fireEvent(
      deleteButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  expect(deleteButton).not.toBeVisible()
});

test('Indicate deletion error', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantWIthErrornousId} index={0}/>
    </MockedProvider>,
  );

  await act(async () => {
    fireEvent(
      screen.getByTitle('Remove'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  await act(async () => {
    fireEvent(
      screen.getByText(/Delete!/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    )
  });

  const message = screen.getByText(new RegExp(errorMessage, "i"));
  expect(message).toBeVisible()
});

test('Indicate watering error', async () => {
  render(
    <MockedProvider mocks={mocksWithPlant} addTypename={false}>
      <Plant plant={plantWIthErrornousId} index={0}/>
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
  });

  const message = screen.getByText(new RegExp(errorMessage, "i"));
  expect(message).toBeVisible()

});
