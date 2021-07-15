import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from 'reactstrap';
import { PlantsList } from './PlantsList'
import { GET_ALL_PLANTS } from './queries'
import { useQuery } from '@apollo/client';
import PlantsDispatch from './PlantsDispatch'
import { PlantsData } from './models'
import { GlobalState } from './models'
import PlantsNavBar from './PlantsNavBar';

interface PlantsContainerProps {
  state: GlobalState
}

function PlantsContainer(props: PlantsContainerProps) {
  const dispatch = useContext(PlantsDispatch);

  const { loading, data, error } = useQuery<PlantsData>(
    GET_ALL_PLANTS,
    {
      onCompleted: (data: PlantsData) => {
        dispatch && dispatch({ type: 'load', plants: data.plants })
      }
    }
  );

  const history = useHistory();
  const goToCreatePage = () => history.push("/create");


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  if (data?.plants?.length === 0) return (
    <>
      <PlantsNavBar />
      <main>
        <p> No plants yet, create the first one! </p>
        <Button onClick={goToCreatePage} outline color="primary" title="Add new plant">
          Create!
        </Button>
      </main>
    </>
  )

  return (
    <>
      <PlantsNavBar />
      <main>
        <PlantsList plants={props.state.plants} />
      </main>
    </>
  )


}

export default PlantsContainer
