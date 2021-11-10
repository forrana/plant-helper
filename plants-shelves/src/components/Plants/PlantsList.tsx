import React from 'react';

import { Plant } from './Plant'
import { PlantsData, RoomType } from './models'
import styles from './PlantsList.module.css';

interface PlantsListProps extends PlantsData { rooms: RoomType[] }
// {
//   props.rooms.map((item, index) => <div key={index}>{item.roomName}</div>)
// }

const PlantsList: React.FC<PlantsListProps> = (props) => {
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
