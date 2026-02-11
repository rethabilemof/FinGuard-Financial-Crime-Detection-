const { app } = require('@azure/functions');

app.http('TestTransaction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('TestTransaction function processing a request.');

        // Get transaction data from request
        const name = request.query.get('name') || 'Anonymous';
        const amount = parseFloat(request.query.get('amount')) || 0;
        const timestamp = request.query.get('timestamp') || new Date().toISOString();
        
        // Parse timestamp
        const transactionDate = new Date(timestamp);
        const hour = transactionDate.getUTCHours();
        const dayOfWeek = transactionDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

        // Detection results
        let alerts = [];
        let riskScore = 0;
        let isSuspicious = false;

        // RULE 1: Large Transaction Detection (FICA Compliance)
        if (amount > 10000) {
            alerts.push({
                rule: "Large Transaction",
                severity: "HIGH",
                message: `Transaction of R${amount} exceeds R10,000 FICA reporting threshold`
            });
            riskScore += 40;
            isSuspicious = true;
        }

        // RULE 2: Structuring Detection (Just Below Threshold)
        if (amount === 9999 || amount === 9998 || amount === 9997 || amount === 9996 || amount === 9995) {
            alerts.push({
                rule: "Structuring Pattern",
                severity: "HIGH",
                message: `Transaction of R${amount} is suspiciously just below the R10,000 reporting threshold`
            });
            riskScore += 35;
            isSuspicious = true;
        }

        // RULE 3: Round Number Suspicion
        if (amount >= 1000 && amount % 1000 === 0 && amount > 0) {
            alerts.push({
                rule: "Round Number",
                severity: "MEDIUM",
                message: `Exactly R${amount} - round numbers are statistically unusual and may indicate planning`
            });
            riskScore += 15;
            if (riskScore >= 30) isSuspicious = true;
        }

        // RULE 4: Midnight Hours (Late Night Transactions)
        if (hour >= 0 && hour <= 4) {
            alerts.push({
                rule: "Unusual Time",
                severity: "MEDIUM",
                message: `Transaction at ${hour}:00 UTC (midnight hours) - unusual timing`
            });
            riskScore += 20;
            if (riskScore >= 30) isSuspicious = true;
        }

        // RULE 5: Weekend Transactions
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            alerts.push({
                rule: "Weekend Activity",
                severity: "LOW",
                message: `Transaction on ${dayOfWeek === 0 ? 'Sunday' : 'Saturday'} - less common for business transactions`
            });
            riskScore += 10;
            if (riskScore >= 30) isSuspicious = true;
        }

        // RULE 6: Very Small Transactions (Potential Testing)
        if (amount > 0 && amount < 10) {
            alerts.push({
                rule: "Micro Transaction",
                severity: "LOW",
                message: `Very small amount (R${amount}) - may be testing account validity`
            });
            riskScore += 5;
        }

        // RULE 7: Extremely Large Transactions
        if (amount > 100000) {
            alerts.push({
                rule: "Extremely Large Transaction",
                severity: "CRITICAL",
                message: `Transaction of R${amount} is exceptionally large - requires immediate review`
            });
            riskScore += 50;
            isSuspicious = true;
        }

        // Cap risk score at 100
        riskScore = Math.min(riskScore, 100);

        // Determine overall risk level
        let riskLevel = "LOW";
        if (riskScore >= 70) riskLevel = "CRITICAL";
        else if (riskScore >= 50) riskLevel = "HIGH";
        else if (riskScore >= 30) riskLevel = "MEDIUM";

        // Generate summary message
        let summaryMessage = "";
        if (isSuspicious) {
            summaryMessage = `⚠️ SUSPICIOUS TRANSACTION DETECTED - Risk Level: ${riskLevel} (Score: ${riskScore}/100)`;
        } else {
            summaryMessage = `✅ Transaction appears normal - Risk Level: ${riskLevel} (Score: ${riskScore}/100)`;
        }

        // Return comprehensive response
        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transactionDetails: {
                    name: name,
                    amount: amount,
                    timestamp: timestamp,
                    hour: hour,
                    dayOfWeek: dayOfWeek === 0 ? "Sunday" : dayOfWeek === 6 ? "Saturday" : "Weekday"
                },
                analysis: {
                    suspicious: isSuspicious,
                    riskScore: riskScore,
                    riskLevel: riskLevel,
                    alertsTriggered: alerts.length,
                    summary: summaryMessage
                },
                alerts: alerts,
                recommendation: isSuspicious ? 
                    "RECOMMEND: Manual review and potential reporting to FIC" : 
                    "RECOMMEND: Transaction may proceed normally",
                analyzedAt: new Date().toISOString()
            })
        };
    }
});