export interface Error {
  message: string;
  code: string;
}

export interface LoginError extends Error {}

export interface SignupErrors {
  [key: string]: Array<Error>
}

export interface UserState { token: String, username: String }

export interface loginAction  { type: 'login', token: String, username: String }
export interface logOutAction { type: 'logout' }

export type UserReducerAction =
  | loginAction
  | logOutAction
