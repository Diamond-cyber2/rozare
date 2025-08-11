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
        document.body.style.background = dark ? '#0b0d12' : '#ffffff';
        document.body.style.color = dark ? '#f1f5f9' : '#0b0d12';
    }, [dark]);

    return (
        <div>
            <Header onToggleTheme={() => setDark((d) => !d)} dark={dark} />
            <Home dark={dark} />
        </div>
    );
};

export default App;