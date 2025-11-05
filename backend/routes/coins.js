const express = require("express");
const axios = require("axios");
const CurrentData = require("../models/CurrentData");
const HistoryData = require("../models/HistoryData");
const router = express.Router();

const COINGECKO_API = process.env.COINGECKO_API;

// helper to map CoinGecko response
function mapCoin(coin) {
  return {
    coinId: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    price: coin.current_price,
    marketCap: coin.market_cap,
    change24h: coin.price_change_percentage_24h,
    lastUpdated: new Date(coin.last_updated),
  };
}

// GET /api/coins
router.get("/coins", async (req, res) => {
  try {
    const { data } = await axios.get(COINGECKO_API);
    const mapped = data.map(mapCoin);

    // Upsert CurrentData: overwrite existing docs (easy approach: bulk write)
    const bulkOps = mapped.map((c) => ({
      updateOne: {
        filter: { coinId: c.coinId },
        update: { $set: c },
        upsert: true,
      },
    }));
    if (bulkOps.length) await CurrentData.bulkWrite(bulkOps);

    res.json({ success: true, coins: mapped, lastSync: new Date() });
  } catch (err) {
    console.error("GET /api/coins error", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;

