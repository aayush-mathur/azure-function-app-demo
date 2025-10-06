const { app } = require('@azure/functions');
const yahooFinance = require('yahoo-finance2').default;

// Stock data function using yahoo-finance2
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
                period1: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                period2: new Date(), // today
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
                    'Cache-Control': 'max-age=60' // Cache for 1 minute
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

            // Search for stocks
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
                    'Cache-Control': 'max-age=300' // Cache for 5 minutes
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