import { NavLink, Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>

            <nav className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
                <span className="fs-4 fw-bold mb-4 border-bottom pb-2">Hub Gestionale</span>

                <ul className="nav nav-pills flex-column mb-auto gap-2">
                    <li className="nav-item">
                        <NavLink to="/" end className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/assicurazioni" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-shield-check me-2"></i> Assicurazioni
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/studio-legale" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-balance-scale me-2"></i> Studio Legale
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/personale" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-person-badge me-2"></i> Area Personale
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mail" className={({ isActive }) => `nav-link text-white ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-envelope me-2"></i> Mail & PEC
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <main className="flex-grow-1 bg-light overflow-auto">
                <Outlet />
            </main>

        </div>
    );
}