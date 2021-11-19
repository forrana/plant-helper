import React from 'react';
import { RoomType } from './models';
import styles from "./RoomBadge.module.css"

interface RoomBadgeProps {
  room?: RoomType
}

const RoomBadge: React.FC<RoomBadgeProps> = ({ room }) => {
  if(room) {
    return (
      <div style={{ backgroundColor: room.colorBackground }} className={styles.customBadge}>
      <b>{room?.roomName}</b>
    </div>)
  }

  return (<></>)
}

export default RoomBadge