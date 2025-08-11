import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="container pad-24">
      <h2 className="hero-title center">لوحة التحكم (تجريبية)</h2>
      <p className="hero-sub center">هذه عينة سريعة لتجربة التطبيق مباشرةً.</p>
      <div className="row-center gap-12 mt-16">
        <button className="btn" onClick={() => setCount((c) => c + 1)}>زيادة</button>
        <div className="count-box">العَدّاد: {count}</div>
        <a className="btn btn-outline" href="/landing">الصفحة التعريفية</a>
      </div>
    </div>
  );
};

export default Dashboard;
