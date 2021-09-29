import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation Register($email: String!, $username: String!, $password1: String!, $password2: String!) {
    register(email: $email, username: $username, password1: $password1, password2: $password2) {
      success,
      errors
    }
  }
`;

const LOG_IN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      success,
      errors,
      unarchiving,
      token,
      refreshToken,
      unarchiving,
      user {
        id,
        username,
      }
    }
  }
`;


const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(
      refreshToken: $refreshToken
    ) {
      success,
      errors,
      payload,
      refreshExpiresIn,
      token,
      refreshToken,
      user {
        id,
        username,
      }
    }
  }
`

export { CREATE_USER, LOG_IN, REFRESH_TOKEN }
