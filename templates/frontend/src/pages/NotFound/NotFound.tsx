import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.code}>404</h1>
            <h2 className={styles.title}>Page Not Found</h2>
            <p className={styles.description}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <button className={styles.button} onClick={() => navigate('/dashboard')}>
                Go to Dashboard
            </button>
        </div>
    );
};

export default NotFound;
