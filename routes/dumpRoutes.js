const express = require('express');
const router = express.Router();
const { Parse } = require('parse/node');

router.post('/', async (req, res) => {
    try {
        let data = '';
        req.on('data', chunk => {
            data += chunk.toString();
        });

        const startTime = Date.now(); // Record start time

        req.on('end', async () => {
            const requestData = JSON.parse(data);
            const { selectedClasses } = requestData || {};
            if (!selectedClasses || selectedClasses.length === 0) {
                throw new Error('No classes selected. Please select at least one class to dump.');
            }

            const dumpData = await Parse.Cloud.run('dumpClasses', { classes: selectedClasses });

            const endTime = Date.now(); // Record end time
            const netTime = endTime - startTime; // Calculate net time

            console.log('Net time taken to dump:', netTime, 'ms'); // Log net time

            res.json({ dumpData, netTime });
        });
    } catch (error) {
        console.error('Error dumping data:', error);
        res.status(500).json({ error: 'Failed to dump data' });
    }
});

module.exports = router;
