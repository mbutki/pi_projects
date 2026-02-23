import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { checkAuthStatus, login } from '../api';

import LeftNav from '../LeftNav';
import ScreenSaver from '../ScreenSaver'

export const Route = createRootRoute({
    component: RootComponent,
    errorComponent: ({ error }) => {
        // Log the error but don't show the default error UI
        console.error('Route error:', error);
        // Return null to not render anything, or return a minimal error UI
        return null;
    },
});

function RootComponent() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus().then(res => {
            setIsAuthenticated(res.authenticated);
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await login(username, password);
        if (res.ok) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError(res.error || 'Login failed');
        }
    };

    if (isAuthenticated === null) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff' }}>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1e1e1e', minWidth: '300px' }}>
                    <h2 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Login</h2>
                    {error && <div style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</div>}
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: '#fff' }}
                    />
                    <button type="submit" style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#4CAF50', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <>
            <ScreenSaver>
                <div style={{ display: 'flex' }}>
                    <LeftNav />
                    <div style={{ flex: 1, padding: '20px' }}>
                        <Outlet />
                    </div>
                </div>
            </ScreenSaver>
        </>
    )
}
