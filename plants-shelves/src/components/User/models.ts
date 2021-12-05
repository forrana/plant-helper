export interface Error {
  message: string;
  code: string;
}

export interface UserSettingsType {
  notificationsStartTime: string
  notificationsEndTime: string
  timezone: string
}

export interface UserSettingsData {
  userSettings: UserSettingsType
}

export interface LoginError extends Error {}

export interface SignupErrors {
  [key: string]: Array<Error>
}

export interface UserState { token: string, username: string, refreshToken: string, expAt: number, userId: number}

export interface loginAction  { type: 'login', token: string, refreshToken: string, username: string, exp: number, userId: number }
export interface logOutAction { type: 'logout' }

export type UserReducerAction =
  | loginAction
  | logOutAction
