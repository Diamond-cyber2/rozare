import React from 'react';

const Wallet: React.FC = () => {
  return (
    <div>
      <h2 className="hero-title">المحفظة</h2>
      <div className="grid">
        <div className="card">الرصيد: $0.00</div>
        <div className="card">نقاط: 0</div>
      </div>
    </div>
  );
};

export default Wallet;
