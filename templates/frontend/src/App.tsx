import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

function App(): React.JSX.Element {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
