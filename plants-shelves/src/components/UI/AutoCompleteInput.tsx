import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Input, InputProps, ListGroup, ListGroupItem } from 'reactstrap';
import { PLANT_ENTRY_BY_FRAGMENT } from '../Plants/catalogQueries';
import { PlantSuggestion } from '../Plants/models';
import styles from './AutoCompleteInput.module.css'

interface PlantSuggestionsResponse {
  plantEntriesByNameFragment: Array<PlantSuggestion>
}

interface AutoCompleteInputProps extends InputProps {
  value: string
  setValue: (value: string) => any
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = (props) => {
  const [options, setOptions] = useState<Array<PlantSuggestion>>([]);
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

  const handleOnClick = (nickName: string) => {
    setValue(nickName);
    setSkipFetch(true);
    setOptions([]);
  }

  useQuery(PLANT_ENTRY_BY_FRAGMENT, {
    variables: { nameFragment: props.value },
    skip: isSkipFecth(),
    onCompleted: (data: PlantSuggestionsResponse) => {
      setOptions(data.plantEntriesByNameFragment);
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
            (option, index) => <ListGroupItem key={index} onClick={() => handleOnClick(option.nickName)}>{option.nickName}</ListGroupItem>
          )
        }
      </ListGroup>
    </>
  )
}

export default AutoCompleteInput
