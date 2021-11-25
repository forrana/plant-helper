import { AlertReducerAction, AlertState,  } from './models'

const initialAlertState: AlertState  = { messages: [] };

const alertReducer = (state: AlertState, action: AlertReducerAction) => {
    switch (action.type) {
      case "addMessage":
        return { ...state, messages: [...state.messages, action.message] };
      case "removeMessage":
        const newMessages = state.messages;
        newMessages.pop();
        return { ...state, messages: newMessages }
    }
}

export {initialAlertState, alertReducer}