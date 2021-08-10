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
      },
      result: {
        data: {
            plantEntriesByNameFragment: [
                {
                    nickName: "Aloe",
                    scientificName: "Aloe Vera"
                }
            ],
        },
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

  test('Call onChange function', async () => {
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

    await act(async () => {
        fireEvent.change(
          screen.getByTestId("plant-autocomplete-input"),
          { target: { value: "Aloe" } }
        )
    });

    expect(mockOnChangeCallback).toBeCalled()
  });
