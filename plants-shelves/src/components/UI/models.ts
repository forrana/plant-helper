export interface MessageType { description: string, color: "danger" | "info" }

export interface AddMessage  { type: 'addMessage', message: MessageType }
export interface RemoveMessage  { type: 'removeMessage' }

export interface AlertState { messages: MessageType[] }

export type AlertReducerAction =
  | AddMessage
  | RemoveMessage