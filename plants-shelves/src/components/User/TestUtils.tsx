import { render } from '@testing-library/react';
import React from 'react';
import UserDispatch from './UserDispatch';


const customRender = (ui: React.ReactChild, {providerProps, ...renderOptions}: any) => {
    return render(
      <UserDispatch.Provider {...providerProps}>{ui}</UserDispatch.Provider>,
      renderOptions,
    )
  }

export { customRender }