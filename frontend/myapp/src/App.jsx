import React from 'react';
import CoinTable from './components/CoinTable';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1>Top 10 Cryptocurrencies</h1>
      <p style={{ color: '#666' }}>Auto-refresh every 30 minutes. Data source: CoinGecko</p>
      <CoinTable />
    </div>
  );
}
