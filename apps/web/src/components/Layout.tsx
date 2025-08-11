import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
  const { logout } = useAuth();
  return (
    <div className="container grid-2 pad-24">
  <aside className="card sticky h-fit">
        <nav>
          <ul className="nav-list col gap-10">
            <li><NavLink className="nav-link" to="/dashboard">اللوحة</NavLink></li>
            <li><NavLink className="nav-link" to="/products">المنتجات</NavLink></li>
            <li><NavLink className="nav-link" to="/orders">الطلبات</NavLink></li>
            <li><NavLink className="nav-link" to="/wallet">المحفظة</NavLink></li>
            <li><NavLink className="nav-link" to="/addons">الإضافات</NavLink></li>
            <li><NavLink className="nav-link" to="/themes">الثيمات</NavLink></li>
            <li><NavLink className="nav-link" to="/settings">الإعدادات</NavLink></li>
          </ul>
        </nav>
        <button className="btn mt-12 w-full" onClick={logout}>تسجيل الخروج</button>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

export default Layout;
