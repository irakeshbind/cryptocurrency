
import React, { useEffect, useState, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function formatNumber(n) {
  if (n === null || n === undefined) return '-';
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function CoinTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('marketCap');
  const [sortDir, setSortDir] = useState('desc');
  const [lastSync, setLastSync] = useState(null);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/coins`);
      const body = await res.json();
      if (body && body.coins) {
        setCoins(body.coins);
        setLastSync(new Date());
      }
    } catch (err) {
      console.error('fetchCoins', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();

    // Auto-refresh every 30 minutes (30 * 60 * 1000 ms)
    const interval = setInterval(fetchCoins, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  );
}
