import { useState } from 'react';

import { Plant } from './Plant'
import { PlantsData } from './models'
import styles from './PlantsList.module.css';

interface PlantsListProps extends PlantsData {}

function PlantsList(props: PlantsListProps) {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    return (
      <section className={styles.plants}>
          <section className={styles.plantsList}>
            {
              props.plants.map((item, index) => <Plant plant={item} index={index} key={index} />)
            }
          </section>
      </section>
    )
}

export { PlantsList }
