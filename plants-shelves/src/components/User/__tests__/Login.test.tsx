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

const error = {
  message: "Please, enter valid credentials.",
  code: "invalid_credentials"
}

const genericErrorMessage = "Something went wrong"

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
  },
];

const mocksWithErrors: any = [
  {
    request: {
      query: LOG_IN,
      variables: {
        username: user.username,
        password: user.password
      }
    },
    result:{
      data: {
        tokenAuth: {
          errors: {
            nonFieldErrors:[
              error
            ]
          }
        }
      }
    }
  },
  {
    request: {
      query: LOG_IN,
      variables: {
        username: "error",
        password: user.password
      }
    },
    error:{
      message: genericErrorMessage
    }
  }
];

const mocksWithEmptyToken: any = [
  {
    request: {
      query: LOG_IN,
      variables: { username: user.username, password: user.password }
    },
    result: {
      data: {
        tokenAuth: {
          user: user,
          token: null
        }
      }
    },
  },
];


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

test('Don\'t submit with empty fields', async () => {
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
       { target: { value: null } }
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

   expect(screen.getByLabelText("Password:")).toHaveValue(user.password)
 })

test('Show login errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithErrors} addTypename={false}>
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

   expect(screen.getByTestId("login-error-message")).toBeVisible()
 })

 test('Show error if there is no token returned', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithEmptyToken} addTypename={false}>
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

   expect(screen.getByTestId("login-error-message")).toBeVisible()
 })

 test('Show general error on server error', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithErrors} addTypename={false}>
       <Login />
       </MockedProvider>
     </MemoryRouter>,
   );

   await act(async () => {
     fireEvent.change(
       screen.getByLabelText("Login:"),
       { target: { value: "error" } }
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

   expect(screen.getByText(new RegExp(genericErrorMessage, "i"))).toBeVisible()
 })