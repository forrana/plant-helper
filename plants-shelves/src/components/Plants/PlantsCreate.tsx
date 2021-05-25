import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { ADD_PLANT } from '../queries'

function PlantsCreate() {
  let nameInput: HTMLInputElement | null, scientificNameInput: HTMLInputElement | null;
  const [addPlant, { data }] = useMutation(ADD_PLANT);

    return (
      <form onSubmit={e => {
          e.preventDefault();
          if(nameInput && scientificNameInput) {
            let name: string = nameInput.value;
            let scientificName: string = scientificNameInput.value;
            addPlant({ variables: { plantName: name, scientificName: scientificName } });
            nameInput.value = "";
            scientificNameInput.value = "";
          }

        }}
      >
        <label>
          Name:
          <input type="text" name="name" ref={node => {
            nameInput = node;
          }}/>
        </label>
        <label>
          Scientific name:
          <input type="text" name="scientificName" ref={node => {
            scientificNameInput = node;
          }}/>
        </label>
        <input type="submit" value="Add plant" />
      </form>
    )
}

export { PlantsCreate }