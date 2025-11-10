import { Outlet, createRootRoute } from '@tanstack/react-router';

import LeftNav from '../LeftNav';
import ScreenSaver from '../ScreenSaver'

export const Route = createRootRoute({
    component: RootComponent,
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