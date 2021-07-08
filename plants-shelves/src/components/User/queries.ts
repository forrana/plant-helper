import { gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation Register($email: String!, $username: String!, $password1: String!, $password2: String!) {
    register(email: $email, username: $username, password1: $password1, password2: $password2) {
      success,
      errors,
      token,
      refreshToken
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




export { CREATE_USER, LOG_IN }
