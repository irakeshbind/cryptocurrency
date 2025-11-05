require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const coinsRouter = require('./routes/coins');
const startCron = require('./cron/hourlySnapshot');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', coinsRouter);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

