import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Input, InputProps, ListGroup, ListGroupItem } from 'reactstrap';
import { PLANT_ENTRY_BY_NICK_NAME_FRAGMENT } from '../Plants/catalogQueries';
import { PlantNickName } from '../Plants/models';
import styles from './AutoCompleteInput.module.css'

interface PlantSuggestionsResponse {
  nickNameEntriesByNameFragment: Array<PlantNickName>
}

interface AutoCompleteInputProps extends InputProps {
  value: string
  setValue: (value: PlantNickName) => any
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = (props) => {
  const [options, setOptions] = useState<Array<PlantNickName>>([]);
  const [skipFetch, setSkipFetch] = useState<Boolean>(false);

  let {setValue, ...inputProps} = props;

  const isSkipFecth = () => {
    if(skipFetch) {
      return true;
    }
    let length = props?.value.length;
    if(length && length >= 3) return false;
    return true;
  }

  const handleInputOnClick = () => {
    if(isSkipFecth()) setSkipFetch(false)
  }

  const handleOnClick = (suggestion: PlantNickName) => {
    setValue(suggestion);
    setSkipFetch(true);
    setOptions([]);
  }

  useQuery(PLANT_ENTRY_BY_NICK_NAME_FRAGMENT, {
    variables: { nameFragment: props.value },
    skip: isSkipFecth(),
    onCompleted: (data: PlantSuggestionsResponse) => {
      setOptions(data.nickNameEntriesByNameFragment);
    }
  })
  if(props?.value.length < 3)
    return (
      <Input
        {...inputProps}
        onClick={handleInputOnClick}
      />
    )

  return (
    <>
      <Input
        {...inputProps}
        onClick={handleInputOnClick}
      />
      <ListGroup className={styles.option}>
        {
          options.map(
            (option, index) =>
            <ListGroupItem key={index} onClick={() => handleOnClick(option)}>
              {option.name} <small className="text-muted">({option.plantEntry.scientificName})</small>
            </ListGroupItem>
          )
        }
      </ListGroup>
    </>
  )
}

export default AutoCompleteInput
