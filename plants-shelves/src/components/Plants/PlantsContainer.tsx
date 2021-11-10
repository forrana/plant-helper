import React, { useContext, useState } from 'react';
import { Button } from 'reactstrap';
import { PlantsList } from './PlantsList'
import { GET_ALL_PLANTS, GET_ALL_ROOMS } from './queries'
import { useQuery } from '@apollo/client';
import PlantsDispatch from './PlantsDispatch'
import { PlantsData, RoomsData } from './models'
import { GlobalState } from './models'
import PlantsNavBar from './PlantsNavBar';
import ErrorHandler from './ErrorHandler';
import CreateModal from './CreateModal';
import LoadingScreen from './LoadingScreen';
import ManagePushSubscription from './ManagePushSubscription';

interface PlantsContainerProps {
  state: GlobalState
}

const WithNavBar = ({ children }: any) => {
  return (
    <>
      <ManagePushSubscription />
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

  const groupsQueryResult = useQuery<RoomsData>(
    GET_ALL_ROOMS,
    {
      onCompleted: (data: RoomsData) => {
        dispatch && dispatch({ type: 'loadRooms', rooms: data.rooms })
      },
      onError: (e) => console.error('Error getting rooms:', e)
    }
  );

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  if (error) {
    return  <ErrorHandler error={error} />
  }

  if (groupsQueryResult.error) {
    return  <ErrorHandler error={groupsQueryResult.error} />
  }
// TODO move LoadingScreen to container, use reducer to set it up from any place where loading is happening
  if (props.state.plants.length === 0) return (
    <WithNavBar>
      <main>
        <p data-testid="message-no-plants"> No plants yet, create the first one! </p>
        <Button onClick={toggleModal} outline color="primary" title="Add new plant" data-testid="empty-view-create-button">
          Create!
        </Button>
      </main>
      <CreateModal isOpen={modal} toggleAction={toggleModal} />
      <LoadingScreen isLoading={loading || groupsQueryResult.loading}/>
    </WithNavBar>
  )

  return (
    <>
      <WithNavBar>
        <main>
          <PlantsList plants={props.state.plants} rooms={props.state.rooms}/>
        </main>
      </WithNavBar>
    </>
  )


}

export default PlantsContainer