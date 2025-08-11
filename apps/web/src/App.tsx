import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Wallet from './pages/Wallet';
import Addons from './pages/Addons';
import Themes from './pages/Themes';
import Settings from './pages/Settings';
import Layout from './components/Layout';

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
                                <Route path="/" element={<Login />} />
                                <Route element={localStorage.getItem('token') ? <Layout /> : <Navigate to="/" replace /> }>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/orders" element={<Orders />} />
                                    <Route path="/wallet" element={<Wallet />} />
                                    <Route path="/addons" element={<Addons />} />
                                    <Route path="/themes" element={<Themes />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Route>
                                <Route path="/landing" element={<Home dark={dark} />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
        </div>
    );
};

export default App;