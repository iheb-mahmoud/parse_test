// cloud/main.js

Parse.Cloud.define('fetchSchema', async () => {
    try {
        const schemas = await Parse.Schema.all();
        return schemas;
    } catch (error) {
        console.error('Error fetching schemas:', error);
        throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to fetch schemas');
    }
});

// Cloud function to dump selected classes
Parse.Cloud.define('dumpClasses', async (request) => {
    const { classes } = request.params;
    const dumpData = {};
    const promises = classes.map(async (className) => {
        const query = new Parse.Query(className);
        const results = await query.find({ useMasterKey: true });
        dumpData[className] = results.map(result => result.toJSON());
    });
    await Promise.all(promises);
    return dumpData;
});
