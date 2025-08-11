import React from 'react';

type Props = { onToggleTheme?: () => void; dark?: boolean };

const Header: React.FC<Props> = ({ onToggleTheme, dark }) => {
    return (
        <header className="site-header">
            <div className="container site-header-inner">
                <div className="brand">Rozare</div>
                <nav aria-label="Main">
                    <ul className="nav-list">
                        <li><a className="nav-link" href="/">Login</a></li>
                        <li><a className="nav-link" href="/dashboard">Dashboard</a></li>
                        <li><a className="nav-link" href="/landing#features">Features</a></li>
                    </ul>
                </nav>
        <button className="btn btn-outline theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
                    {dark ? 'Light' : 'Dark'}
                </button>
            </div>
        </header>
    );
};

export default Header;