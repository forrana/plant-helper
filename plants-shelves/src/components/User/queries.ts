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
      token,
      refreshToken,
    }
  }
`

const REVOKE_TOKEN = gql`
  mutation RevokeToken($refreshToken: String!){
    revokeToken(
      refreshToken: $refreshToken
    ) {
      success,
      errors
    }
  }
`

const PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(
      email: $email
    ) {
      success,
      errors
    }
  }
`

const PASSWORD_RESET = gql`
  mutation PasswordReset($token: String!, $password1: String!, $password2: String!){
    passwordReset(
      token: $token,
      newPassword1: $password1,
      newPassword2: $password2
    ) {
      success,
      errors
    }
  }
`

const PASSWORD_CHANGE = gql`
  mutation PasswordChange($oldPassword: String!, $newPassword1: String!, $newPassword2: String!){
    passwordChange(
      oldPassword: $oldPassword,
      newPassword1: $newPassword1,
      newPassword2: $newPassword2
    ) {
      success,
      errors,
      token,
      refreshToken
    }
  }
`

const UPSERT_USER_SETTINGS = gql`
  mutation UpsertUserSettings($startTime: String!, $endTime: String!, $interval: Int!, $timezone: String) {
    upsertUserSettings(startTime: $startTime, endTime: $endTime, interval: $interval, timezone: $timezone) {
      userSettings {
        notificationsStartTime, notificationsEndTime, notificationsInterval, timezone
      }
    }
  }
`

const GET_USER_SETTINGS = gql`
  query {
    userSettings {
      notificationsStartTime, notificationsEndTime, notificationsInterval, timezone
    }
  }
`;

const GET_USER_DATA = gql`
  query {
    me {
      email
    }
  }
`;

export {
  CREATE_USER,
  LOG_IN,
  REFRESH_TOKEN,
  UPSERT_USER_SETTINGS,
  GET_USER_SETTINGS,
  GET_USER_DATA,
  PASSWORD_RESET_EMAIL,
  PASSWORD_RESET,
  PASSWORD_CHANGE,
  REVOKE_TOKEN
}
