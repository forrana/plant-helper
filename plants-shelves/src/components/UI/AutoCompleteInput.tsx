import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Input, InputProps } from 'reactstrap';
import { PLANT_ENTRY_BY_FRAGMENT } from '../Plants/catalogQueries';
import { PlantSuggestion } from '../Plants/models';

interface PlantSuggestionsResponse {
  plantEntriesByNameFragment: Array<PlantSuggestion>
}

interface AutoCompleteInputProps extends InputProps {
  value: string
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = (props) => {
  const [options, setOptions] = useState<Array<PlantSuggestion>>([]);

  const isLongEnough = () => {
    let length = props?.value.length;
    if(length && length >= 3) return false;
    return true;
  }

  useQuery(PLANT_ENTRY_BY_FRAGMENT, {
    variables: { nameFragment: props.value },
    skip: isLongEnough(),
    onCompleted: (data: PlantSuggestionsResponse) => {
      setOptions(data.plantEntriesByNameFragment);
      console.log(data.plantEntriesByNameFragment);
    }
  })

    return (
      <>
        <Input
          {...props}
        />
        {
          options.map(
            option => option.nickName
          )
        }
      </>
    )
}

export default AutoCompleteInput
