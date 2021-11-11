import React from 'react';

import { RoomType } from './models'
import styles from './Room.module.css';
import { PlantsList } from './PlantsList';
import { Badge } from 'reactstrap';

interface RoomProps { room: RoomType }

const Room: React.FC<RoomProps> = (props) => {
    if(props.room.plants) {
        return (
            <section className={styles.room} data-testid="room-container">
                <Badge color="dark" className={styles.badge}>{props.room.roomName}</Badge>
                <PlantsList plants={props.room.plants} rooms={[]}/>
            </section>
        )
    }

    return (<></>)
}

export { Room }
