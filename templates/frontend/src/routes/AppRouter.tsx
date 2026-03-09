import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';

export const AppRouter: React.FC = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from;

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={user ? <Navigate to={from || '/dashboard'} replace /> : <Login />}
            />

            {user && <Route path="/dashboard/*" element={<Dashboard />} />}

            <Route
                path="/"
                element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
            />

            <Route
                path="*"
                element={
                    user
                        ? <NotFound />
                        : <Navigate state={{ from: location.pathname }} to="/login" replace />
                }
            />
        </Routes>
    );
};
