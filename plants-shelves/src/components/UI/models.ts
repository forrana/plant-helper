export interface ErrorType { description: string }

export interface AddError  { type: 'addError', error: ErrorType }
export interface RemoveError  { type: 'removeError' }

export interface AlertState { messages: ErrorType[] }

export type AlertReducerAction =
  | AddError
  | RemoveError