import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';
import { Sidebar as SidebarPrime } from 'primereact/sidebar';
import { Button } from 'primereact/button';

interface SidebarProps {
    activeItem: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [visible, setVisible] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const handleResize = (): void => {
            setMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = useCallback(async (): Promise<void> => {
        try {
            await logout();
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [logout, navigate]);

    const sidebarContent = (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <h2 className={styles.logo}>{'{{APP_TITLE}}'}</h2>
            </div>
            <div className={styles.navList}>
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`${styles.navItem} ${activeItem === 'dashboard' ? styles.active : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    {/* Add more navigation items here */}
                </div>
                <button onClick={handleLogout} className={styles.navItem}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );

    if (mobile) {
        return (
            <>
                {visible ? (
                    <SidebarPrime visible={visible} onHide={() => setVisible(false)}>
                        {sidebarContent}
                    </SidebarPrime>
                ) : (
                    <div className="h-screen p-3 absolute">
                        <Button severity="info" onClick={() => setVisible(true)}>
                            <Menu size={24} />
                        </Button>
                    </div>
                )}
            </>
        );
    }

    return <div>{sidebarContent}</div>;
};

export default Sidebar;
