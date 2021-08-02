import React from 'react';
import { act, fireEvent, render, screen, Screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { LOG_IN } from '../queries';

const user = {
  username: "username",
  password: "password" ,
  token: "token"
 };

const mocksWithUser: any = [
  {
    request: {
      query: LOG_IN,
      variables: { username: user.username, password: user.password }
    },
    result: {
      data: {
        tokenAuth: {
          user: user,
          token: user.token
        }
      }
    },
  }
];

const mockCallback = jest.fn(() => null)

test('Match snapshot', async () => {
  const {container} = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithUser} addTypename={false}>
        <Login />
      </MockedProvider>
    </MemoryRouter>,
  );

  expect(container).toMatchSnapshot()
});

test('Allow to login', async () => {
 const { container } = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithUser} addTypename={false}>
      <Login />
      </MockedProvider>
    </MemoryRouter>,
  );

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Login:"),
      { target: { value: user.username } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password:"),
      { target: { value: user.password } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("login-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  expect(screen.getByLabelText("Password:")).not.toHaveValue(user.password)
})
