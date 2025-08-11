import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';

const App: React.FC = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(prefersDark);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <div>
            <Header onToggleTheme={() => setDark((d) => !d)} dark={dark} />
            <Home dark={dark} />
        </div>
    );
};

export default App;