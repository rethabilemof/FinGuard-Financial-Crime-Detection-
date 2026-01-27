const { app } = require('@azure/functions');

app.http('TestTransaction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('TestTransaction function processing a request.');

        // Get transaction data from request
        const name = request.query.get('name') || 'Anonymous';
        const amount = parseFloat(request.query.get('amount')) || 0;

        // Simple suspicious pattern check
        let message = '';
        let isSuspicious = false;

        if (amount > 10000) {
            isSuspicious = true;
            message = `⚠️ ALERT: Large transaction of R${amount} from ${name} detected! This exceeds the R10,000 threshold.`;
        } else if (amount === 9999 || amount === 9998 || amount === 9997) {
            isSuspicious = true;
            message = `⚠️ ALERT: Possible structuring detected! Transaction of R${amount} from ${name} is just below the R10,000 reporting threshold.`;
        } else {
            message = `✅ Transaction of R${amount} from ${name} appears normal.`;
        }

        // Return response
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                amount: amount,
                suspicious: isSuspicious,
                message: message,
                timestamp: new Date().toISOString()
            })
        };
    }
});