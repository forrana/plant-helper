import React from 'react';
import { Spinner } from 'reactstrap';
import styles from './LoadingScreen.module.css'

interface LoadingScreenProps {
    isLoading: Boolean
}

function LoadingScreen(props: LoadingScreenProps) {
    if(props.isLoading) return (
        <div className={styles.container}>
            <Spinner color="primary" className={styles.spinner}/>
        </div>
    )
    return (<></>)
}

export default LoadingScreen;