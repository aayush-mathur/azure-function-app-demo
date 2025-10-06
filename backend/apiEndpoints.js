const { app } = require('@azure/functions');

// Health check endpoint
app.http('healthCheck', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'health',
    handler: async (request, context) => {
        context.log('Health check endpoint called');

        const healthStatus = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.AZURE_FUNCTIONS_ENVIRONMENT || 'local',
            nodeVersion: process.version,
            uptime: process.uptime()
        };

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(healthStatus, null, 2)
        };
    }
});

// Demo API endpoint with different HTTP methods
app.http('demoApi', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    route: 'api/{id?}',
    handler: async (request, context) => {
        context.log(`API endpoint called with method: ${request.method}`);

        const id = request.params.id;
        const method = request.method;
        
        let responseData = {
            method: method,
            timestamp: new Date().toISOString(),
            endpoint: '/api'
        };

        switch (method) {
            case 'GET':
                responseData.message = id ? `Retrieved item with ID: ${id}` : 'Retrieved all items';
                responseData.data = id ? { id, name: `Item ${id}` } : [
                    { id: 1, name: 'Item 1' },
                    { id: 2, name: 'Item 2' },
                    { id: 3, name: 'Item 3' }
                ];
                break;
            
            case 'POST':
                const postData = await request.json().catch(() => ({}));
                responseData.message = 'Created new item';
                responseData.data = { id: Date.now(), ...postData };
                break;
            
            case 'PUT':
                const putData = await request.json().catch(() => ({}));
                responseData.message = id ? `Updated item with ID: ${id}` : 'Updated item';
                responseData.data = { id: id || Date.now(), ...putData };
                break;
            
            case 'DELETE':
                responseData.message = id ? `Deleted item with ID: ${id}` : 'Delete operation';
                responseData.data = { deleted: true, id };
                break;
        }

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseData, null, 2)
        };
    }
});