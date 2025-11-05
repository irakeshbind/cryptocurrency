
import React, { useEffect, useState, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function formatNumber(n) {
  if (n === null || n === undefined) return '-';
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

  );
}
