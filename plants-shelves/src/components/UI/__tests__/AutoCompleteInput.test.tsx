import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AutoCompleteInput from '../AutoCompleteInput';
import { PLANT_ENTRY_BY_FRAGMENT } from '../../Plants/catalogQueries';

const mockCallback = jest.fn((value:string) => null)
const mockOnChangeCallback = jest.fn((event:any) => null)


const mocks: any = [
    {
      request: {
        query: PLANT_ENTRY_BY_FRAGMENT,
        variables: { nameFragment: "Aloe" }
      },
      result: {
        data: {
          plantEntriesByNameFragment: [
            {
                nickName: "Aloe Vera",
                scientificName: "Aloe Vera"
            }
          ],
        }
      },
    },
  ];

test('Match snapshot', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AutoCompleteInput
            value=""
            setValue={mockCallback}
            onChange={mockOnChangeCallback}
            />
      </MockedProvider>,
    );

    expect(container).toMatchSnapshot()
  });

  test('Call onChange function', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AutoCompleteInput
            value=""
            setValue={mockCallback}
            onChange={mockOnChangeCallback}
            data-testid="plant-autocomplete-input"
            />
      </MockedProvider>,
    );
    fireEvent.change(
      screen.getByTestId("plant-autocomplete-input"),
      { target: { value: "Aloe" } }
    )

    expect(mockOnChangeCallback).toBeCalled()
  });

  test('Show autocomplete options', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AutoCompleteInput
            value="Aloe"
            setValue={mockCallback}
            onChange={mockOnChangeCallback}
            data-testid="plant-autocomplete-input"
            />
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(container.getByText(/Aloe Vera/)).toBeVisible()
  });

  test('Set value from autocomplete', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AutoCompleteInput
            value="Aloe"
            setValue={mockCallback}
            onChange={mockOnChangeCallback}
            data-testid="plant-autocomplete-input"
            />
      </MockedProvider>,
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    fireEvent.click(
      screen.getByText(/Aloe Vera/)
    )


    expect(mockCallback).toBeCalled()
  });
