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
  message: "User already exist.",
  code: "invalid_username"
}

const passwordError = {
  message: "Passwords doesn't match.",
  code: "invalid_password"
}


const emailError = {
  message: "Incorrect email.",
  code: "invalid_password"
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
          errors: null
        }
      }
    },
  },
];

const mocksWithPassword1Errors: any = [
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
            password1:[
              passwordError
            ]
          }
        }
      }
    }
  }
];

const mocksWithPassword2Errors: any = [
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
            password2:[
              passwordError
            ]
          }
        }
      }
    }
  }
];

const mocksWithEmailErrors: any = [
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
            email:[
              emailError
            ]
          }
        }
      }
    }
  }
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
            username:[
              error
            ]
          }
        }
      }
    }
  }
];

const mocksWithGenericErrors: any = [
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  expect(screen.getByLabelText("Password:")).not.toHaveValue(user.password1)
})

test('Show signup errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithErrors} addTypename={false}>
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

   expect(screen.getByTestId("signup-username-error")).toBeVisible()
 })


test('Show password1 errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithPassword1Errors} addTypename={false}>
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

   expect(screen.getByTestId("signup-password-1-error")).toBeVisible()
 })

 test('Show password2 errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithPassword2Errors} addTypename={false}>
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

   expect(screen.getByTestId("signup-password-2-error")).toBeVisible()
 })

 test('Show email errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithEmailErrors} addTypename={false}>
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

   expect(screen.getByTestId("signup-email-error")).toBeVisible()
 })

 test('Show generic errors', async () => {
  const { container } = render(
     <MemoryRouter>
       <MockedProvider mocks={mocksWithGenericErrors} addTypename={false}>
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
      screen.getByLabelText("Password:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.change(
      screen.getByLabelText("Password confirmation:"),
      { target: { value: user.password1 } }
    )
  });

  await act(async () => {
    fireEvent.click(
      screen.getByTestId("signup-submit-button")
    )
    await new Promise(resolve => setTimeout(resolve, 0));
  });

   expect(screen.getByTestId("signup-email-error")).toBeVisible()
 })