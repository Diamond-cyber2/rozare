import React from 'react';

type Props = { onToggleTheme?: () => void; dark?: boolean };

const Header: React.FC<Props> = ({ onToggleTheme, dark }) => {
    return (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <h1 style={{ margin: 0 }}>Rozare</h1>
            <nav>
                <ul style={{ display: 'flex', gap: 12, listStyle: 'none', margin: 0, padding: 0 }}>
                    <li><a href="/">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
            <button onClick={onToggleTheme} aria-label="Toggle theme">
                {dark ? 'Light' : 'Dark'}
            </button>
        </header>
    );
};

export default Header;