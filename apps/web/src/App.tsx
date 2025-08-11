import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

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
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/landing" element={<Home dark={dark} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

export default App;