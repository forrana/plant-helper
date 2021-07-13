export interface Error {
  message: string;
  code: string;
}

export interface LoginError extends Error {}

export interface SignupErrors {
  [key: string]: Array<Error>
}
