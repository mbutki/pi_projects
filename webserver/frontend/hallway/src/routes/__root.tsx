import { Outlet, createRootRoute } from '@tanstack/react-router';

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
