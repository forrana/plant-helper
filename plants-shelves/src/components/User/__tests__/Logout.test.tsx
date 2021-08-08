import React, { Dispatch } from 'react';
import { act, fireEvent, render, screen, Screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { MemoryRouter } from 'react-router-dom';
import Logout from '../Logout';
import UserDispatch from '../UserDispatch';


const customRender = (ui: React.ReactChild, {providerProps, ...renderOptions}: any) => {
    return render(
      <UserDispatch.Provider {...providerProps}>{ui}</UserDispatch.Provider>,
      renderOptions,
    )
  }

test('Match snapshot', async () => {
    const providerProps = {
        value: () => undefined,
      }

    const {container} = customRender(
      <MemoryRouter>
          <Logout />
      </MemoryRouter>,
      {providerProps}
    );

    expect(container).toMatchSnapshot()
  });