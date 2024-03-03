const express = require('express');
const router = express.Router();
const { Parse } = require('parse/node');

router.get('/', async (req, res) => {
    try {
        const response = await Parse.Cloud.run('fetchSchema');
        res.json(response);
    } catch (error) {
        console.error('Error fetching schemas:', error);
        res.status(500).json({ error: 'Failed to fetch schemas' });
    }
});

module.exports = router;
