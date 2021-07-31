import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import { PlantsList } from './PlantsList'
import { GET_ALL_PLANTS } from './queries'
import { useQuery } from '@apollo/client';
import PlantsDispatch from './PlantsDispatch'
import { PlantsData } from './models'
import { GlobalState } from './models'
import PlantsNavBar from './PlantsNavBar';
import ErrorHandler from './ErrorHandler';
import CreateModal from './CreateModal';

interface PlantsContainerProps {
  state: GlobalState
}

const WithNavBar = ({ children }: any) => {
  return (
    <>
      <PlantsNavBar />
      {children}
    </>
  )
}

function PlantsContainer(props: PlantsContainerProps) {
  const dispatch = useContext(PlantsDispatch);
  // eslint-disable-next-line
  const { loading, data, error } = useQuery<PlantsData>(
    GET_ALL_PLANTS,
    {
      onCompleted: (data: PlantsData) => {
        dispatch && dispatch({ type: 'load', plants: data.plants })
      },
      onError: (e) => console.error('Error getting plants:', e)
    }
  );

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return  <ErrorHandler error={error} />
  }

  if (props.state.plants.length === 0) return (
    <WithNavBar>
      <main>
        <p data-testid="message-no-plants"> No plants yet, create the first one! </p>
        <Button onClick={toggleModal} outline color="primary" title="Add new plant" data-testid="empty-view-create-button">
          Create!
        </Button>
      </main>
      <CreateModal isOpen={modal} toggleAction={toggleModal} />
    </WithNavBar>
  )

  return (
    <>
      <WithNavBar>
        <main>
          <PlantsList plants={props.state.plants} />
        </main>
      </WithNavBar>
    </>
  )


}

export default PlantsContainer
