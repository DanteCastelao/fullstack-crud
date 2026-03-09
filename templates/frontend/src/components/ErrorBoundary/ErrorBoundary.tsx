import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary — catches JavaScript errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('ErrorBoundary caught:', error, info);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '400px' }}>
                        An unexpected error occurred. Please refresh the page and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--brand)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
