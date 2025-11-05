
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

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    let out = coins.filter(c => !qLower || c.name.toLowerCase().includes(qLower) || c.symbol.toLowerCase().includes(qLower));
    out.sort((a, b) => {
      let av = a[sortKey] ?? 0;
      let bv = b[sortKey] ?? 0;
      if (sortKey === 'name' || sortKey === 'symbol') {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      } else {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
    });
    return out;
  }, [coins, q, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or symbol..." style={{ padding: 8, minWidth: 240 }} />
        <button onClick={fetchCoins} style={{ padding: '8px 12px' }}>Refresh now</button>
        <div style={{ marginLeft: 'auto', color: '#555' }}>
          {loading ? 'Loading...' : lastSync ? `Last sync: ${lastSync.toLocaleString()}` : 'Not synced yet'}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>Coin</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('symbol')}>Symbol</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('price')}>Price (USD)</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('marketCap')}>Market Cap</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('change24h')}>24h %</th>
            <th>Last Updated</th>
          </tr>
        </thead>
       
      </table>
    </div>
  );
}
