import React from 'react';
import { Spinner } from 'reactstrap';
import styles from './LoadingScreen.module.css'

interface LoadingScreenProps {
    isLoading: Boolean,
    isFullScreen: Boolean
}

function LoadingScreen({isLoading, isFullScreen}: LoadingScreenProps) {
    const className = isFullScreen ? styles.containerFullScreen : styles.containerLocal;

    if(isLoading) return (
        <div className={className}>
            <Spinner color="primary" className={styles.spinner}/>
        </div>
    )
    return (<></>)
}

export default LoadingScreen;