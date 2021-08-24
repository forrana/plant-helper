import React from 'react';
import { initialGlobalState, globalReducer } from '../GlobalReducer';
import { GlobalReducerAction, PlantType } from '../models';


test('Should add new plant to plants', () => {
    let initialState = { ...initialGlobalState }
    let plant: PlantType = {
        id: 1,
        name: "Aloe",
        scientificName: "Aloe Vera",
        daysUntilNextWatering: 7,
        daysBetweenWatering: 7,
        symbol: {
          userWideId: 1
        }
      }
    let action: GlobalReducerAction = { type: "add", plant: plant }
    let newState = globalReducer(initialState, action)
    expect(newState.plants.includes(plant))
})

test('Should load list of plants', () => {
    let initialState = { ...initialGlobalState }
    let plant: PlantType = {
        id: 1,
        name: "Aloe",
        scientificName: "Aloe Vera",
        daysUntilNextWatering: 7,
        daysBetweenWatering: 7,
        symbol: {
          userWideId: 1
        }
      }
    let action: GlobalReducerAction = { type: "load", plants: [plant] }
    let newState = globalReducer(initialState, action)
    expect(newState.plants.includes(plant))
})

test('Should update a plant', () => {
    let plant: PlantType = {
        id: 1,
        name: "Aloe",
        scientificName: "Aloe Vera",
        daysUntilNextWatering: 1,
        daysBetweenWatering: 7,
        symbol: {
          userWideId: 1
        }
      }
    let initialState = { ...initialGlobalState, plants: [plant] }
    let action: GlobalReducerAction = { type: "update", index: 0, plant: {...plant, daysUntilNextWatering: 7}}
    let newState = globalReducer(initialState, action)
    expect(newState.plants[0].daysUntilNextWatering == 7)
})

test('Should delete a plant', () => {
    let plant: PlantType = {
        id: 1,
        name: "Aloe",
        scientificName: "Aloe Vera",
        daysUntilNextWatering: 7,
        daysBetweenWatering: 7,
        symbol: {
          userWideId: 1
        }
      }
    let initialState = { ...initialGlobalState, plants: [plant]}
    let action: GlobalReducerAction = { type: "delete", index: 0 }
    let newState = globalReducer(initialState, action)
    expect(newState.plants).toHaveLength(0)
})