import React, { useState, FormEvent } from 'react';
import styles from './Login.module.css';
import { useAuth } from '../../context/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username.toLowerCase(), password);
        } catch {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{'{{APP_TITLE}}'}</h1>
                    <p className={styles.subtitle}>Sign in to continue</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <Message severity="error" text={error} className={styles.errorMsg} />
                    )}

                    <div className={styles.field}>
                        <label htmlFor="username" className={styles.label}>Username</label>
                        <InputText
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={styles.input}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        label={loading ? 'Signing in...' : 'Sign In'}
                        className={styles.submitBtn}
                        severity="info"
                        loading={loading}
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    );
};

export default Login;
