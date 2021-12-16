import React, { useState } from 'react';
import { Input, Spinner } from 'reactstrap';
import { useMutation } from '@apollo/client';

import { RoomData, RoomType } from './models';
import { UPDATE_ROOM } from './queries';
import styles from "./RoomBadge.module.css"
import { usePlantsDispatch } from './PlantsDispatch';
import ErrorHandler from './ErrorHandler';

interface RoomBadgeProps {
  room?: RoomType
}

const RoomBadge: React.FC<RoomBadgeProps> = ({ room }) => {
  const dispatch = usePlantsDispatch()

  const [isEditMode, setIsEditMode] = useState(false);
  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const [groupName, setGroupName] = useState(room?.roomName || "");

  React.useEffect(() => {
    room && setGroupName(room?.roomName);
  }, [room])

  const handleGroupNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setGroupName(newValue);
  };

  const touchduration = 500;
  let timer: ReturnType<typeof setTimeout>;

  const onLongTouch = () => toggleEditMode()

  const touchStart = () => {
    timer = setTimeout(onLongTouch, touchduration);
  }

  const touchEnd = () => timer && clearTimeout(timer)

  const applyChanges = () => {
    if(room?.roomName !== groupName) {
      updateRoom({variables: {
        roomId: room?.id,
        roomName: groupName
      }})
    } else toggleEditMode()
  }

  const onKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      applyChanges()
    }
  }

  const [updateRoom, { loading, error }] = useMutation(UPDATE_ROOM, {
    onCompleted: (data: { updateRoom: RoomData }) => {
      dispatch({ type: 'updateRoom', room: data.updateRoom.room});
      toggleEditMode()
    },
    onError: (e) => console.error('Error updating plant:', e)
  });

  if (loading) return  <Spinner color="primary" />

  if(room) {
    if(isEditMode) {
      return (
        <>
        <Input
          type="text" name="groupName" id="groupName" placeholder="Group name"
          data-testid="plant-group-name-input"
          value={groupName}
          onChange={handleGroupNameInputChange}
          onDoubleClick={applyChanges}
          bsSize="sm"
          required
          onKeyUp={onKeyUp}
        />
        <ErrorHandler error={error} />
        </>
      )
    } else return (
      <>
      <div style={{ backgroundColor: room.colorBackground }} className={styles.customBadge} onDoubleClick={toggleEditMode}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
      >
        <b>{room.roomName}</b>
      </div>
      <ErrorHandler error={error} />
      </>
    )}

  return <></>
}

export default RoomBadge