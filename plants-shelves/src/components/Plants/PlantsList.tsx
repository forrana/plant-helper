import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { Plant } from './Plant'
import { PlantsCreate } from './PlantsCreate'
import { PlantsData } from './models'
import styles from './PlantsList.module.css';
import uiStyles from '../UI/UIElements.module.css'

interface PlantsListProps extends PlantsData {}

function PlantsList(props: PlantsListProps) {
    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);


    return (
      <section className={styles.plants}>
          <section className={styles.controls}>
            <Button onClick={toggleModal} outline className={uiStyles.roundButton} color="primary" title="Add new plant">
              &#10133;
            </Button>
            <h1>Your plants: </h1>
          </section>
          <section className={styles.plantsList}>
            {
              props.plants.map((item, index) => <Plant plant={item} index={index} key={index} />)
            }
          </section>
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Create new plant </ModalHeader>
            <ModalBody>
              <PlantsCreate action={toggleModal} />
            </ModalBody>
          </Modal>

      </section>
    )
}

export { PlantsList }
