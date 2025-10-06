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

// Timer triggered function (commented out for local development)
// Uncomment for production deployment
// app.timer('timerTrigger', {
//     schedule: '0 */5 * * * *', // Every 5 minutes
//     handler: (myTimer, context) => {
//         context.log('Timer trigger function ran at:', new Date().toISOString());
//         
//         if (myTimer.isPastDue) {
//             context.log('Timer function is running late!');
//         }
//         
//         // Log some demo data
//         context.log('Demo timer function executed successfully', {
//             nextRun: myTimer.schedule?.next?.toString(),
//             lastRun: myTimer.schedule?.last?.toString()
//         });
//     }
// });