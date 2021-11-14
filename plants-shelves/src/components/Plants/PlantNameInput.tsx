import { useQuery } from '@apollo/client';
import React from 'react';
import { InputProps } from 'reactstrap';
import { PlantNickName } from './models';
import { useDebounce } from './utils';
import AutoCompleteInput from '../UI/AutoCompleteInput';
import { PLANT_ENTRY_BY_NICK_NAME_FRAGMENT } from './catalogQueries';

interface PlantSuggestionsResponse {
  nickNameEntriesByNameFragment: Array<PlantNickName>
}


interface AutoCompleteInputProps extends InputProps {
  value: string
  setValue: (value: any) => any
}

const PlantNameInput: React.FC<AutoCompleteInputProps> = (props) => {
  const SEARCH_DEBOUNCE_TIMEOUT = 500;

  const debounceValue = useDebounce(props.value, SEARCH_DEBOUNCE_TIMEOUT);

  const useQLQuery = (isSkipFetch: boolean, setOptions: (params: any) => any) => useQuery(PLANT_ENTRY_BY_NICK_NAME_FRAGMENT, {
    variables: { nameFragment: debounceValue },
    skip: isSkipFetch,
    onCompleted: (data: PlantSuggestionsResponse) => {
      setOptions(data.nickNameEntriesByNameFragment);
    }
  })

  const renderOption = (option: PlantNickName) => (
    <>
      {option.name} <small className="text-muted">({option.plantEntry.scientificName})</small>
    </>
  )

  return (
    <AutoCompleteInput
      {...props}
      useQLQuery={useQLQuery}
      renderOption={renderOption}
    />
  )
}

export default PlantNameInput