import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import styles from './Dashboard.module.css';
import { PrimeReactProvider } from 'primereact/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <PrimeReactProvider>
            <div className={styles.container}>
                <Sidebar activeItem="dashboard" />
                <main className={styles.content}>
                    <header className={styles.header}>
                        <h1>Welcome to {'{{APP_TITLE}}'}</h1>
                        <p className={styles.subtitle}>
                            Signed in as <strong>{user?.role}</strong>
                        </p>
                    </header>

                    <section className={styles.grid}>
                        <article className={styles.card}>
                            <div className={styles.cardIcon}>📊</div>
                            <h3>Dashboard</h3>
                            <p>View your data and analytics at a glance.</p>
                        </article>
                        <article className={styles.card}>
                            <div className={styles.cardIcon}>👥</div>
                            <h3>Manage Entities</h3>
                            <p>Add, edit, and manage your business entities.</p>
                        </article>
                        <article className={styles.card}>
                            <div className={styles.cardIcon}>📋</div>
                            <h3>Orders</h3>
                            <p>Track and manage orders with status workflows.</p>
                        </article>
                        <article className={styles.card}>
                            <div className={styles.cardIcon}>⚙️</div>
                            <h3>Settings</h3>
                            <p>Configure your application preferences.</p>
                        </article>
                    </section>
                </main>
            </div>
        </PrimeReactProvider>
    );
};

export default Dashboard;
