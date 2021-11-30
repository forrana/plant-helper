import { useQuery } from '@apollo/client';
import React from 'react';
import { Button, InputProps } from 'reactstrap';
import { RoomType } from './models';
import { useDebounce } from './utils';
import AutoCompleteInput from '../UI/AutoCompleteInput';
import { ROOMS_BY_NAME_FRAGMENT } from './queries';


interface RoomsSuggestionsResponse {
  roomsByNameFragment: Array<RoomType>
}

interface AutoCompleteInputProps extends InputProps {
  value: string
  roomId?: number
  roomColor: string
  roomName: string
  badgeClassName: string
  removeAction: () => any
  setValue: (value: any) => any
}

const RoomNameInput: React.FC<AutoCompleteInputProps> = ({ roomId, roomColor, roomName, removeAction, badgeClassName, ...rest }) => {
  const SEARCH_DEBOUNCE_TIMEOUT = 500;

  const debounceValue = useDebounce(rest.value, SEARCH_DEBOUNCE_TIMEOUT);

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

  if(roomId) {
    return (
      <div
        className={badgeClassName}
        style={{ backgroundColor: roomColor }}
      >
        <b>{roomName}</b>
        <Button onClick={removeAction} outline><i className="icon icon-cross"></i></Button>
      </div>
    )

  } else {
    return (
      <AutoCompleteInput
        {...rest}
        useQLQuery={useQLQuery}
        renderOption={renderOption}
      />
    )
  }


}

export default RoomNameInput