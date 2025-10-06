# Azure Function App Demo

A full-stack serverless demonstration built with React frontend and Azure Functions backend (Node.js v4).

## 🏗️ Architecture

- **Frontend**: React SPA hosted on Azure Static Web Apps
- **Backend**: Azure Functions with Node.js runtime
- **Data**: Real-time stock market data via yahoo-finance2
- **Deployment**: GitHub Actions CI/CD for both frontend and backend

## 🌐 Live Demo

- **Frontend**: https://brave-meadow-08cbc820f.2.azurestaticapps.net
- **Backend API**: https://func-app-demo-8685.azurewebsites.net

> **Note**: Frontend deployment requires the `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret to be configured.

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

4. **stockData** - Real-time stock data using yahoo-finance2
   - Endpoint: `/api/stock/{symbol?}`
   - Method: GET
   - Parameters: `symbol` (path or query parameter, defaults to AAPL)
   - Returns: Current quote data and 5-day historical data
   - Example: `/api/stock/MSFT` or `/api/stock?symbol=TSLA`

5. **stockSearch** - Stock symbol search
   - Endpoint: `/api/stock/search/{query?}`
   - Method: GET
   - Parameters: `query` (path parameter) or `q` (query parameter)
   - Returns: Search results for stock symbols
   - Example: `/api/stock/search/Microsoft` or `/api/stock/search?q=Tesla`

### Timer Triggered Functions
1. **timerTrigger** - Scheduled function (commented out for local development)
   - Schedule: Every 5 minutes
   - Logs execution information

## Development Challenges & Solutions

### 🔧 Challenge 1: Azure Functions v4 Project Structure
**Problem**: Initially created functions in a `src/functions/` directory, but Azure Functions v4 expects function files in the root directory.

**Error**: `Worker was unable to load entry point "index.js": File does not exist`

**Solution**: 
- Moved all function files to the root directory
- Created `index.js` as the main entry point that imports all function modules
- Updated project structure to match Azure Functions v4 requirements

### 🔧 Challenge 2: Timer Trigger Storage Issues in Local Development
**Problem**: Timer triggers require Azure Storage for scheduling, causing errors in local development.

**Error**: `Microsoft.Azure.WebJobs.Extensions.Timers.Storage: Could not create BlobContainerClient for ScheduleMonitor`

**Solution**: 
- Commented out timer trigger for local development
- Updated `local.settings.json` with `"AzureWebJobsStorage": "UseDevelopmentStorage=true"`
- Timer function works fine in Azure deployment where storage is properly configured

### 🔧 Challenge 3: GitHub Actions Workflow Failure
**Problem**: GitHub Actions workflow was failing during the test phase.

**Error**: `Error: no test specified` with exit code 1

**Solution**: 
- Updated `package.json` test script from `"test": "echo \"Error: no test specified\" && exit 1"` 
- Changed to `"test": "echo \"No tests specified - skipping test phase\""` (exit code 0)
- The issue was the `exit 1` command causing the workflow to fail, not the echo message

### 🔧 Challenge 4: Azure Functions Runtime Configuration
**Problem**: Initial `host.json` configuration included unnecessary custom handler settings.

**Solution**: 
- Removed `customHandler` configuration from `host.json`
- Used standard Node.js programming model for Azure Functions v4
- Kept essential configurations: logging, extension bundle, and timeout settings

### 🔧 Challenge 5: GitHub Actions Environment Mismatch
**Problem**: Workflow template was configured for Windows but Azure Function App was created on Linux.

**Solution**: 
- Changed GitHub Actions runner from `windows-latest` to `ubuntu-latest`
- Updated shell commands from `pwsh` to `bash`
- Ensured consistency between development environment and deployment target

## Tech Stack & Dependencies

### Frontend
- **React 18** - Modern JavaScript UI library
- **Azure Static Web Apps** - Hosting and global CDN
- **Responsive Design** - Mobile-first CSS Grid layout

### Backend
- **Azure Functions v4** - Serverless compute platform
- **Node.js 20** - JavaScript runtime

### Azure Resources
- **Resource Group**: `rg-function-app-demo`
- **Function App**: `func-app-demo-8685` (Linux, Node.js 20, Consumption Plan)
- **Static Web App**: `swa-function-app-demo` (React frontend hosting)
- **Storage Account**: `stfunctionappdemo9494`
- **Application Insights**: Enabled for monitoring

### Node.js Dependencies
- `@azure/functions` - Azure Functions Node.js library v4
- `yahoo-finance2` - Real-time stock market data
- `azure-functions-core-tools` - Local development tools

### Development Tools
- Azure CLI - Resource management and deployment
- GitHub Actions - CI/CD pipeline
- VS Code - Development environment

## Deployment Process

### 1. Manual Azure Resources Creation
```bash
# Create resource group
az group create --name rg-function-app-demo --location eastus

# Create storage account
az storage account create --name stfunctionappdemo9494 --location eastus --resource-group rg-function-app-demo --sku Standard_LRS

# Create function app (backend)
az functionapp create --resource-group rg-function-app-demo --consumption-plan-location eastus --runtime node --runtime-version 20 --functions-version 4 --name func-app-demo-8685 --storage-account stfunctionappdemo9494 --os-type Linux

# Create static web app (frontend)
az staticwebapp create --name swa-function-app-demo --resource-group rg-function-app-demo --location "East US 2"
```

### 2. GitHub Actions CI/CD Pipeline

#### Backend (Azure Functions)
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/main_func-app-demo-8685.yml`
- **Runner**: Ubuntu (Linux) to match Azure Function App OS
- **Steps**: 
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (`npm install`)
  4. Run tests (skipped - no tests defined)
  5. Deploy to Azure using publish profile

#### Frontend (Static Web App)
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/azure-static-web-apps.yml`
- **Runner**: Ubuntu
- **Steps**:
  1. Checkout code
  2. Build React app (`npm run build`)
  3. Deploy to Azure Static Web Apps

### 3. Required GitHub Secrets
```bash
# Backend - Get Function App publish profile
az functionapp deployment list-publishing-profiles --name func-app-demo-8685 --resource-group rg-function-app-demo --xml

# Frontend - Get Static Web App deployment token
az staticwebapp secrets list --name swa-function-app-demo --query "properties.apiKey" --resource-group rg-function-app-demo
```

**Add these as GitHub repository secrets**:
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` - For backend deployment
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - For frontend deployment

## Project Structure

```
azure-function-app-demo/
├── .github/
│   └── workflows/
│       ├── main_func-app-demo-8685.yml    # Backend deployment
│       └── azure-static-web-apps.yml      # Frontend deployment
├── frontend/                               # React frontend application
│   ├── public/
│   │   └── index.html                     # HTML template
│   ├── src/
│   │   ├── App.js                         # Main React component
│   │   ├── App.css                        # Styling
│   │   └── index.js                       # React entry point
│   └── package.json                       # Frontend dependencies
├── .gitignore                             # Git ignore rules
├── AZURE_RESOURCES.md                     # Azure resources documentation
├── README.md                              # This file
├── apiEndpoints.js                        # REST API demo functions
├── demoFunctions.js                       # Basic HTTP and timer functions
├── stockFunctions.js                      # Stock market data functions
├── host.json                              # Function app configuration (includes CORS)
├── index.js                               # Main entry point
├── local.settings.json                    # Local development settings
├── package.json                           # Backend dependencies and scripts
└── package-lock.json                      # Dependency lock file
```

## Local Development

### Prerequisites
- Node.js 18+ 
- Azure Functions Core Tools v4
- Azure CLI (for deployment)

### Backend Setup
```bash
# Install backend dependencies
npm install

# Start Azure Functions locally
npm start
# or
func start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start React development server
npm start
```

### Full-Stack Local Development
1. **Terminal 1**: Start Azure Functions backend (`func start`)
2. **Terminal 2**: Start React frontend (`cd frontend && npm start`)
3. **Access**: Frontend at http://localhost:3000, Backend at http://localhost:7071

### Test Endpoints
**Backend API (http://localhost:7071)**:
- Health Check: http://localhost:7071/api/health
- HTTP Trigger: http://localhost:7071/api/httpTrigger?name=YourName
- Demo API: http://localhost:7071/api/api (or /api/123 for specific ID)
- Stock Data: http://localhost:7071/api/stock/AAPL
- Stock Search: http://localhost:7071/api/stock/search/Apple

**Frontend (http://localhost:3000)**:
- Interactive UI for all backend endpoints
- Real-time stock data visualization
- Search functionality

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

### Production Deployment
**Frontend**: https://brave-meadow-08cbc820f.2.azurestaticapps.net
- Interactive React UI
- Real-time stock data visualization
- Responsive design for mobile/desktop

**Backend API**: https://func-app-demo-8685.azurewebsites.net
- Health: https://func-app-demo-8685.azurewebsites.net/api/health
- HTTP Trigger: https://func-app-demo-8685.azurewebsites.net/api/httpTrigger?name=Azure
- Stock Data: https://func-app-demo-8685.azurewebsites.net/api/stock/AAPL
- Stock Search: https://func-app-demo-8685.azurewebsites.net/api/stock/search/Microsoft

## Lessons Learned & Best Practices

### ✅ Key Takeaways
1. **Azure Functions v4 Structure**: Functions must be in root directory with proper `index.js` entry point
2. **Exit Codes Matter**: GitHub Actions fails on any non-zero exit code - fix test scripts accordingly
3. **Environment Consistency**: Match GitHub Actions runner OS with Azure Function App OS (Linux vs Windows)
4. **Local vs Production**: Some features (like timer triggers) behave differently locally vs in Azure
5. **Error Handling**: Always implement proper error handling with appropriate HTTP status codes
6. **Caching**: Add cache headers for APIs that don't change frequently (stock data, etc.)

### 🚀 Production Recommendations
1. **Add proper tests** instead of skipping them
2. **Implement authentication** for sensitive endpoints
3. **Add rate limiting** for external API calls (yahoo-finance2)
4. **Set up monitoring** and alerts using Application Insights
5. **Use Azure Key Vault** for sensitive configuration
6. **Implement CORS** if accessed from web applications

### 🔄 CI/CD Best Practices
1. **Use environment-specific configurations** (dev/staging/prod)
2. **Implement proper testing strategy** (unit, integration, e2e)
3. **Add security scanning** to GitHub Actions workflow
4. **Use Azure RBAC** instead of publish profiles for enhanced security
5. **Implement blue-green deployments** for zero-downtime updates

### 📊 Monitoring & Observability
- **Application Insights**: Monitor function performance and errors
- **Custom logging**: Add structured logging for better debugging
- **Health checks**: Implement comprehensive health monitoring
- **Metrics**: Track custom business metrics (API usage, response times)

## Clean Up

To delete all Azure resources when done:
```bash
az group delete --name rg-function-app-demo --yes --no-wait
```

---

**Built with ❤️ using Azure Functions v4, Node.js 20, and GitHub Actions**