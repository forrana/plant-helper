import React from 'react';
import { act, fireEvent, render, screen, Screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { MemoryRouter } from 'react-router-dom';
import Signup from '../Signup';
import { CREATE_USER } from '../queries';

const user = {
  username: "username",
  password1: "password" ,
  password2: "password",
  email: "test@email.com"
 };

const error = {
  message: "Please, enter valid credentials.",
  code: "invalid_credentials"
}

const genericErrorMessage = "Something went wrong"

const mocksWithUser: any = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        ...user
      }
    },
    result: {
      data: {
        register: {
          success: true,
          errors: []
        }
      }
    },
  },
];

const mocksWithErrors: any = [
  {
    request: {
      query: CREATE_USER,
      variables: {
        ...user
      }
    },
    result:{
      data: {
        register: {
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
      query: CREATE_USER,
      variables: {
        ...user
      }
    },
    error:{
      message: genericErrorMessage
    }
  }
];

test('Match snapshot', async () => {
  const {container} = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithUser} addTypename={false}>
        <Signup />
      </MockedProvider>
    </MemoryRouter>,
  );

  expect(container).toMatchSnapshot()
});

test('Allow to signup', async () => {
 const { container } = render(
    <MemoryRouter>
      <MockedProvider mocks={mocksWithUser} addTypename={false}>
      <Signup />
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
      screen.getByLabelText("Email:"),
      { target: { value: user.email } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByPlaceholderText("Enter password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByPlaceholderText("Re-enter password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("login-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  expect(screen.getByLabelText("Password:")).not.toHaveValue(user.password1)
})

// test('Don\'t submit with empty fields', async () => {
//   const { container } = render(
//      <MemoryRouter>
//        <MockedProvider mocks={mocksWithUser} addTypename={false}>
//        <Signup />
//        </MockedProvider>
//      </MemoryRouter>,
//    );

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Login:"),
//        { target: { value: null } }
//      )
//    });

//    await act(async () => {
//      fireEvent.change(
//        screen.getByPlaceholderText("Enter password:"),
//        { target: { value: user.password1 } }
//      )
//    });

//    await act(async () => {
//      fireEvent.click(
//        screen.getByTestId("login-submit-button")
//      )
//      await new Promise(resolve => setTimeout(resolve, 0));
//    });

//    expect(screen.getByLabelText("Password:")).toHaveValue(user.password)
//  })

// test('Show login errors', async () => {
//   const { container } = render(
//      <MemoryRouter>
//        <MockedProvider mocks={mocksWithErrors} addTypename={false}>
//        <Signup />
//        </MockedProvider>
//      </MemoryRouter>,
//    );

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Login:"),
//        { target: { value: user.username } }
//      )
//    });

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Password:"),
//        { target: { value: user.password } }
//      )
//    });

//    await act(async () => {
//      fireEvent.click(
//        screen.getByTestId("login-submit-button")
//      )
//      await new Promise(resolve => setTimeout(resolve, 0));
//    });

//    expect(screen.getByTestId("login-error-message")).toBeVisible()
//  })

//  test('Show error if there is no token returned', async () => {
//   const { container } = render(
//      <MemoryRouter>
//        <MockedProvider mocks={mocksWithEmptyToken} addTypename={false}>
//        <Signup />
//        </MockedProvider>
//      </MemoryRouter>,
//    );

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Login:"),
//        { target: { value: user.username } }
//      )
//    });

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Password:"),
//        { target: { value: user.password } }
//      )
//    });

//    await act(async () => {
//      fireEvent.click(
//        screen.getByTestId("login-submit-button")
//      )
//      await new Promise(resolve => setTimeout(resolve, 0));
//    });

//    expect(screen.getByTestId("login-error-message")).toBeVisible()
//  })

//  test('Show general error on server error', async () => {
//   const { container } = render(
//      <MemoryRouter>
//        <MockedProvider mocks={mocksWithErrors} addTypename={false}>
//        <Signup />
//        </MockedProvider>
//      </MemoryRouter>,
//    );

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Login:"),
//        { target: { value: "error" } }
//      )
//    });

//    await act(async () => {
//      fireEvent.change(
//        screen.getByLabelText("Password:"),
//        { target: { value: user.password } }
//      )
//    });

//    await act(async () => {
//      fireEvent.click(
//        screen.getByTestId("login-submit-button")
//      )
//      await new Promise(resolve => setTimeout(resolve, 0));
//    });

//    expect(screen.getByText(new RegExp(genericErrorMessage, "i"))).toBeVisible()
//  })