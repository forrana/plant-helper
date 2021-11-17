import React from 'react';

import { Plant } from './Plant'
import { PlantsData, RoomType } from './models'
import styles from './PlantsList.module.css';
// import { Room } from './Room';

interface PlantsListProps extends PlantsData { rooms: RoomType[] }
// {
//   props.rooms.map((item, index) => <div key={index}>{item.roomName}</div>)
// }

// {
//   roomsWithPlants.map((item, index) => <Room room={item} key={index} />)
// }

const PlantsList: React.FC<PlantsListProps> = (props) => {
    // const plantsWithoutGroup = props.rooms.length ? props.plants.filter(plant => !plant.room) : props.plants;
    // const roomsWithPlants = props.rooms.map(room => {
    //   const plants = props.plants.filter(plant => plant.room?.id === room.id);
    //   return { ...room, plants };
    // })
    return (
      <section className={styles.plants}>
          <section className={styles.plantsList} data-testid="plant-list-container">
            {
              props.plants.map((item, index) => <Plant plant={item} index={index} key={index} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
