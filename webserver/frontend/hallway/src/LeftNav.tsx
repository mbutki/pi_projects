import { Link } from '@tanstack/react-router';

import React from 'react';

const LeftNav: React.FC = () => {
    return (
        <aside className="leftnav">
            <nav>
                <ul>
                    <li>
                        <Link
                            to="/"
                            activeProps={{ className: "active" }}
                            activeOptions={{ exact: true }}
                        >
                            Sensors
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/videos"
                            activeProps={{ className: "active" }}
                        >
                            Videos
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/weather"
                            activeProps={{ className: "active" }}
                        >
                            Weather
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/devices"
                            activeProps={{ className: "active" }}
                        >
                            Devices
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/settings"
                            activeProps={{ className: "active" }}
                        >
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default LeftNav