const { app } = require('@azure/functions');

// HTTP triggered function
app.http('httpTrigger', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request.');

        const name = request.query.get('name') || 
                    (await request.text()) || 
                    'World';

        const responseMessage = {
            message: `Hello, ${name}! This Azure Function executed successfully.`,
            timestamp: new Date().toISOString(),
            method: request.method,
            url: request.url,
            functionName: 'httpTrigger'
        };

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseMessage, null, 2)
        };
    }
});

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

// Stock data functions using yahoo-finance2
const yahooFinance = require('yahoo-finance2').default;

// Stock data function
app.http('stockData', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'stock/{symbol?}',
    handler: async (request, context) => {
        context.log('Stock data function called');

        try {
            const symbol = request.params.symbol || request.query.get('symbol') || 'AAPL';
            
            context.log(`Fetching data for symbol: ${symbol}`);

            // Get quote data
            const quote = await yahooFinance.quote(symbol);
            
            // Get historical data (last 5 days)
            const historical = await yahooFinance.historical(symbol, {
                period1: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1d'
            });

            const responseData = {
                symbol: symbol.toUpperCase(),
                timestamp: new Date().toISOString(),
                quote: {
                    regularMarketPrice: quote.regularMarketPrice,
                    regularMarketChange: quote.regularMarketChange,
                    regularMarketChangePercent: quote.regularMarketChangePercent,
                    regularMarketPreviousClose: quote.regularMarketPreviousClose,
                    regularMarketOpen: quote.regularMarketOpen,
                    regularMarketDayHigh: quote.regularMarketDayHigh,
                    regularMarketDayLow: quote.regularMarketDayLow,
                    regularMarketVolume: quote.regularMarketVolume,
                    marketCap: quote.marketCap,
                    shortName: quote.shortName,
                    longName: quote.longName,
                    currency: quote.currency,
                    exchange: quote.fullExchangeName
                },
                historical: historical.slice(-5).map(day => ({
                    date: day.date.toISOString().split('T')[0],
                    open: day.open,
                    high: day.high,
                    low: day.low,
                    close: day.close,
                    volume: day.volume
                })),
                dataSource: 'yahoo-finance2',
                functionName: 'stockData'
            };

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=60'
                },
                body: JSON.stringify(responseData, null, 2)
            };

        } catch (error) {
            context.log.error('Error fetching stock data:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Failed to fetch stock data',
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    functionName: 'stockData'
                }, null, 2)
            };
        }
    }
});

// Stock search function
app.http('stockSearch', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'stock/search/{query?}',
    handler: async (request, context) => {
        context.log('Stock search function called');

        try {
            const query = request.params.query || request.query.get('q') || 'Apple';
            
            context.log(`Searching for: ${query}`);

            const searchResults = await yahooFinance.search(query);
            
            const responseData = {
                query: query,
                timestamp: new Date().toISOString(),
                results: searchResults.quotes.slice(0, 10).map(quote => ({
                    symbol: quote.symbol,
                    shortname: quote.shortname,
                    longname: quote.longname,
                    exchange: quote.exchange,
                    quoteType: quote.quoteType,
                    market: quote.market
                })),
                totalResults: searchResults.quotes.length,
                dataSource: 'yahoo-finance2',
                functionName: 'stockSearch'
            };

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'max-age=300'
                },
                body: JSON.stringify(responseData, null, 2)
            };

        } catch (error) {
            context.log.error('Error searching stocks:', error);
            
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    error: 'Failed to search stocks',
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    functionName: 'stockSearch'
                }, null, 2)
            };
        }
    }
});