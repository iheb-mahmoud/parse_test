// dashboard-config.js
require('dotenv').config();

const ParseDashboardConfig = {
  apps: [
    {
      serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
      appId: process.env.APP_ID || 'your_app_id',
      masterKey: process.env.MASTER_KEY || 'your_master_key',
      appName: 'Your App Name'
    }
  ],
  users: [
    {
      user: process.env.DASHBOARD_USER || 'admin',
      pass: process.env.DASHBOARD_PASS || 'password'
    }
  ]
};

module.exports = ParseDashboardConfig;
