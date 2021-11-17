import React, { useState } from 'react';
import { Input, InputProps, ListGroup, ListGroupItem } from 'reactstrap';
import { PlantNickName, RoomType } from '../Plants/models';
import styles from './AutoCompleteInput.module.css'

interface AutoCompleteInputProps extends InputProps {
  value: string
  setValue: (value: PlantNickName|RoomType) => any
  useQLQuery: (isSkipFetch: boolean, setOptions: (params: any) => any) => any
  renderOption: (option: any) => any
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = (props) => {
  const [options, setOptions] = useState<Array<PlantNickName>>([]);
  const [skipFetch, setSkipFetch] = useState<Boolean>(true);

  let {setValue, useQLQuery, renderOption, ...inputProps} = props;

  const isSkipFecth = () => {
    if(skipFetch) {
      return true;
    }
    let length = props?.value.length;
    if(length && length >= 3) return false;
    return true;
  }

  const handleInputEvent = () => {
    if(isSkipFecth()) setSkipFetch(false)
  }

  const handleOnClick = (suggestion: PlantNickName) => {
    setValue(suggestion);
    setSkipFetch(true);
    setOptions([]);
  }

  useQLQuery(isSkipFecth(), setOptions)

  if(props?.value.length < 3)
    return (
      <Input
        {...inputProps}
        onKeyUp={handleInputEvent}
      />
    )

  return (
    <>
      <Input
        {...inputProps}
        onKeyUp={handleInputEvent}
      />
      <ListGroup className={styles.option}>
        {
          options.map(
            (option, index) =>
            <ListGroupItem key={index} onClick={() => handleOnClick(option)}>
              {renderOption(option)}
            </ListGroupItem>
          )
        }
      </ListGroup>
    </>
  )
}

export default AutoCompleteInput