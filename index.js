require('dotenv').config();
const express = require('express');
const { ParseServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const ParseDashboardConfig = require('./dashboard-config');
const schemaRoute = require('./routes/schemaRoutes');
const dumpRoutes = require('./routes/dumpRoutes');

const app = express();
const port = process.env.PORT || 1337;

// Serve static files from the 'public' folder
app.use(express.static('public'));

const api = new ParseServer({
    databaseURI: process.env.MONGO_URI,
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    serverURL: process.env.SERVER_URL
});

app.use('/parse', api.app);

//dashboard init
const dashboard = new ParseDashboard(ParseDashboardConfig, { allowInsecureHTTP: true });

app.use('/dashboard', dashboard);

// Use the schema route
app.use('/fetch-schema', schemaRoute);

// Use the dump route
app.use('/dump', dumpRoutes);

// Start the Parse Server
(async () => {
    await api.start();
    console.log('Parse Server started');
    
    // Start the Express server
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})();
