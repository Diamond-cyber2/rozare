import React from 'react';

const Themes: React.FC = () => {
  return (
    <div>
      <h2 className="hero-title">الثيمات</h2>
      <div className="grid">
        <div className="card">كلاسيك غولد</div>
        <div className="card">داكن أنيق</div>
      </div>
    </div>
  );
};

export default Themes;
