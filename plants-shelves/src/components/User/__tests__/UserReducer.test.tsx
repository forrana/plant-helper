import React from 'react';
import { getRandomString } from '../../Plants/utils';
import { UserReducerAction } from '../models';
import { getInitialState, initialUserState, userReducer, USER_STATE_STORAGE_KEY } from '../UserReducer';


test('Should log in user', () => {
    const initialState = { ...initialUserState }
    const loggedInState = { token: getRandomString(10), username: "username"}
    const action: UserReducerAction = { type: "login", ...loggedInState }
    const newState = userReducer(initialState, action)
    expect(newState.token === loggedInState.token)
})

test('Should logout user', () => {
    const initialState = { token: getRandomString(10), username: "username"}
    const action: UserReducerAction = { type: "logout" }
    const newState = userReducer(initialState, action)
    expect(newState.token.length === 0)
})

test('Should read state from localStorage', () => {
    const savedState = { token: getRandomString(10), username: "username"}
    localStorage.setItem(USER_STATE_STORAGE_KEY, JSON.stringify(savedState))
    expect(getInitialState().token === savedState.token)
})