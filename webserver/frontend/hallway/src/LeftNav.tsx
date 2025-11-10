import { Link } from '@tanstack/react-router';

const LeftNav = () => {
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
                            Environment
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/videos/"
                            activeProps={{ className: "active" }}
                        >
                            Videos
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default LeftNav