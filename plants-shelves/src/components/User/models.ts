export interface Error {
  message: string;
  code: string;
}

export interface UserSettingsType {
  notificationsStartTime: string
  notificationsEndTime: string
  notificationsInterval: number
  timezone: string
}

export interface UserProfileType {
  email: string
}

export interface UserProfileData {
  me: UserProfileType
}

export interface UserSettingsData {
  userSettings: UserSettingsType
}

export interface LoginError extends Error {}
export interface ResetError extends Error {}


export interface FormErrors {
  [key: string]: Array<Error>
}

export interface UserState { token: string, username: string, refreshToken: string, expAt: number, userId: number}

export interface loginAction  { type: 'login', token: string, refreshToken: string, username: string, exp: number, userId: number }
export interface logOutAction { type: 'logout' }

export type UserReducerAction =
  | loginAction
  | logOutAction
