import { useQuery } from '@apollo/client';
import React from 'react';
import { InputProps } from 'reactstrap';
import { RoomType } from './models';
import { useDebounce } from './utils';
import AutoCompleteInput from '../UI/AutoCompleteInput';
import { ROOMS_BY_NAME_FRAGMENT } from './queries';


interface RoomsSuggestionsResponse {
  roomsByNameFragment: Array<RoomType>
}

interface AutoCompleteInputProps extends InputProps {
  value: string
  setValue: (value: any) => any
}

const RoomNameInput: React.FC<AutoCompleteInputProps> = (props) => {
  const SEARCH_DEBOUNCE_TIMEOUT = 500;

  const debounceValue = useDebounce(props.value, SEARCH_DEBOUNCE_TIMEOUT);

  const useQLQuery = (isSkipFetch: boolean, setOptions: (params: any) => any) => useQuery(ROOMS_BY_NAME_FRAGMENT, {
    variables: { nameFragment: debounceValue },
    skip: isSkipFetch,
    onCompleted: (data: RoomsSuggestionsResponse) => {
      setOptions(data.roomsByNameFragment);
    }
  })

  const renderOption = (option: RoomType) => (
    <>
      {option.roomName}
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

export default RoomNameInput