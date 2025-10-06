# Azure Function App Demo

A demonstration Azure Function App built with Node.js and Azure Functions v4.

## Functions Included

### HTTP Triggered Functions
1. **httpTrigger** - Basic HTTP trigger that accepts GET/POST requests
   - Endpoint: `/api/httpTrigger`
   - Parameters: `name` (query parameter or body)
   - Returns: JSON response with greeting message

2. **healthCheck** - Health check endpoint
   - Endpoint: `/api/health` 
   - Method: GET only
   - Returns: System health information

3. **demoApi** - RESTful API demonstration
   - Endpoint: `/api/{id?}`
   - Methods: GET, POST, PUT, DELETE
   - Demonstrates different HTTP methods with sample CRUD operations

### Timer Triggered Functions
1. **timerTrigger** - Scheduled function
   - Schedule: Every 5 minutes
   - Logs execution information

## Local Development

### Prerequisites
- Node.js 18+ 
- Azure Functions Core Tools v4
- Azure CLI (for deployment)

### Setup
```bash
npm install
```

### Run Locally
```bash
npm start
# or
func start
```

### Test Endpoints
Once running locally:
- Health Check: http://localhost:7071/api/health
- HTTP Trigger: http://localhost:7071/api/httpTrigger?name=YourName
- Demo API: http://localhost:7071/api/api (or /api/123 for specific ID)

## Deployment

This function app is configured for deployment to Azure Function App: `func-app-demo-8685`

### Manual Deployment
```bash
func azure functionapp publish func-app-demo-8685
```

### GitHub Actions Deployment
GitHub Actions workflow will be configured for automated deployment on push to main branch.

## Azure Resources

See `AZURE_RESOURCES.md` for details on the Azure resources created for this demo.

## Configuration

- **host.json**: Function app configuration
- **local.settings.json**: Local development settings (not deployed)
- **package.json**: Node.js dependencies and scripts

## Testing

Test the deployed function at:
- Base URL: https://func-app-demo-8685.azurewebsites.net
- Health: https://func-app-demo-8685.azurewebsites.net/api/health
- HTTP Trigger: https://func-app-demo-8685.azurewebsites.net/api/httpTrigger?name=Azure