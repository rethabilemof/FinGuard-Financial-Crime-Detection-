# FinGuard - Financial Crime Detection System

A cloud-based intelligent system for detecting suspicious financial transactions using Azure Functions and advanced pattern recognition algorithms.

## 🎯 Overview

FinGuard is a real-time transaction monitoring system designed to identify potential money laundering, structuring, and other financial crimes. Built with Azure serverless architecture, it combines regulatory compliance requirements (FICA) with behavioral analysis to flag high-risk transactions.

**Live Demo:** Run locally at `http://localhost:7071/api/TestTransaction`

## 🚀 Key Features

### Detection Capabilities
- ✅ **FICA Compliance Monitoring** - Automatically flags transactions exceeding R10,000 reporting threshold
- ✅ **Structuring Detection** - Identifies attempts to evade reporting by splitting transactions (R9,999, R9,998, etc.)
- ✅ **Round Number Analysis** - Flags suspiciously perfect amounts that suggest planning
- ✅ **Temporal Pattern Detection** - Identifies unusual timing (midnight transactions, weekend activity)
- ✅ **Extreme Value Detection** - Critical alerts for transactions over R100,000
- ✅ **Micro-Transaction Flagging** - Detects potential account validation attempts

### Advanced Analytics
- 📊 **Risk Scoring System** - Assigns 0-100 risk scores based on multiple factors
- 🎚️ **Risk Level Classification** - Categorizes as LOW, MEDIUM, HIGH, or CRITICAL
- 📋 **Multi-Alert Tracking** - Single transaction can trigger multiple rules
- 💡 **Actionable Recommendations** - Provides clear guidance for compliance officers

## 🛠️ Technology Stack

- **Platform:** Azure Functions (Serverless)
- **Runtime:** Node.js 20
- **Language:** JavaScript
- **Architecture:** Event-driven, RESTful API
- **Development:** VS Code, Azure Functions Core Tools
- **Version Control:** Git & GitHub

## 📋 Prerequisites

- Node.js 20.x or higher
- Azure Functions Core Tools 4.x
- Git
- Azure account (optional for cloud deployment)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/rethabilemof/FinGuard.git
   cd FinGuard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   func start
   ```

4. **Access the API**
   ```
   http://localhost:7071/api/TestTransaction
   ```

## 📖 Usage Examples

### Basic Transaction Analysis
```
GET http://localhost:7071/api/TestTransaction?name=John&amount=5000
```

**Response:**
```json
{
  "transactionDetails": {
    "name": "John",
    "amount": 5000,
    "timestamp": "2026-02-10T15:45:30.123Z"
  },
  "analysis": {
    "suspicious": false,
    "riskScore": 15,
    "riskLevel": "LOW",
    "alertsTriggered": 1
  },
  "alerts": [
    {
      "rule": "Round Number",
      "severity": "MEDIUM",
      "message": "Exactly R5000 - round numbers are statistically unusual"
    }
  ],
  "recommendation": "RECOMMEND: Transaction may proceed normally"
}
```

### High-Risk Transaction
```
GET http://localhost:7071/api/TestTransaction?name=Sarah&amount=50000
```

**Response:**
```json
{
  "analysis": {
    "suspicious": true,
    "riskScore": 55,
    "riskLevel": "HIGH",
    "alertsTriggered": 2
  },
  "alerts": [
    {
      "rule": "Large Transaction",
      "severity": "HIGH",
      "message": "Transaction of R50000 exceeds R10,000 FICA reporting threshold"
    },
    {
      "rule": "Round Number",
      "severity": "MEDIUM",
      "message": "Exactly R50000 - round numbers are statistically unusual"
    }
  ],
  "recommendation": "RECOMMEND: Manual review and potential reporting to FIC"
}
```

### Structuring Pattern Detection
```
GET http://localhost:7071/api/TestTransaction?name=Mike&amount=9999
```

### Critical Multi-Factor Alert
```
GET http://localhost:7071/api/TestTransaction?name=Bob&amount=100000&timestamp=2026-02-02T02:00:00Z
```

## 🔍 Detection Rules

| Rule | Trigger Condition | Risk Points | Severity |
|------|------------------|-------------|----------|
| Large Transaction | Amount > R10,000 | +40 | HIGH |
| Structuring Pattern | Amount = R9,999, R9,998, R9,997, R9,996, R9,995 | +35 | HIGH |
| Extremely Large | Amount > R100,000 | +50 | CRITICAL |
| Round Number | Amount divisible by R1,000 | +15 | MEDIUM |
| Unusual Time | Transaction between 00:00-04:00 UTC | +20 | MEDIUM |
| Weekend Activity | Saturday or Sunday | +10 | LOW |
| Micro Transaction | Amount < R10 | +5 | LOW |

### Risk Level Thresholds
- **LOW:** 0-29 points
- **MEDIUM:** 30-49 points
- **HIGH:** 50-69 points
- **CRITICAL:** 70-100 points

## 🎓 Project Background

This project combines expertise from multiple domains:

- **Policing:** Understanding of criminal behavior patterns and investigation procedures
- **Finance & Taxation Law:** Knowledge of FICA (Financial Intelligence Centre Act) compliance requirements
- **Cloud Computing:** Azure Functions architecture and serverless deployment (AZ-204, AZ-400 certified)

### Real-World Applications
- Banks and financial institutions (FICA compliance)
- Fintech companies (fraud prevention)
- Accounting firms (client risk assessment)
- Law enforcement (money laundering investigation)
- Tax authorities (tax evasion detection)

## 🚧 Roadmap

### Phase 1: Core Detection ✅ (Complete)
- [x] Basic transaction analysis
- [x] Multi-rule detection engine
- [x] Risk scoring system
- [x] RESTful API

### Phase 2: Data Persistence (In Progress)
- [ ] Database integration (Azure SQL / SQLite)
- [ ] Transaction history storage
- [ ] Query capabilities

### Phase 3: Advanced Analytics (Planned)
- [ ] Velocity detection (multiple transactions tracking)
- [ ] Network analysis (connected accounts)
- [ ] Behavioral profiling
- [ ] Machine learning predictions

### Phase 4: User Interface (Planned)
- [ ] Web dashboard
- [ ] Data visualization (charts, graphs)
- [ ] Compliance reporting
- [ ] Alert notifications

## 📊 API Reference

### Endpoint
```
GET/POST /api/TestTransaction
```

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `name` | string | No | Transaction originator name | `John` |
| `amount` | number | Yes | Transaction amount (Rands) | `15000` |
| `timestamp` | ISO 8601 | No | Transaction timestamp | `2026-02-10T14:30:00Z` |

### Response Schema

```typescript
{
  transactionDetails: {
    name: string,
    amount: number,
    timestamp: string,
    hour: number,
    dayOfWeek: string
  },
  analysis: {
    suspicious: boolean,
    riskScore: number,      // 0-100
    riskLevel: string,      // LOW | MEDIUM | HIGH | CRITICAL
    alertsTriggered: number,
    summary: string
  },
  alerts: Array<{
    rule: string,
    severity: string,
    message: string
  }>,
  recommendation: string,
  analyzedAt: string
}
```

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests with improvements
- Share ideas for additional detection rules

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Rethabile Mofokeng**

Combining expertise in policing, financial law, and cloud computing to build intelligent financial crime prevention systems.

- GitHub: [@rethabilemof](https://github.com/rethabilemof)
- LinkedIn: [Rethabile Mofokeng](https://www.linkedin.com/in/rethabile-mofokeng-5230991b2)

## 🙏 Acknowledgments

- South African Financial Intelligence Centre (FIC) for FICA regulatory framework
- Azure Functions documentation and community
- Financial crime research and anti-money laundering best practices

---

**⚠️ Disclaimer:** This is an educational project demonstrating technical capabilities in financial crime detection. It should not be used as the sole mechanism for regulatory compliance without proper legal and compliance review.