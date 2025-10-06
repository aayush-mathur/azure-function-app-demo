# Azure Resources Created

## Resource Group
- **Name**: `rg-function-app-demo`
- **Location**: `eastus`
- **Subscription**: Visual Studio Enterprise Subscription

## Storage Account
- **Name**: `stfunctionappdemo9494`
- **SKU**: Standard_LRS
- **Location**: eastus

## Function App (Backend API)
- **Name**: `func-app-demo-8685`
- **URL**: https://func-app-demo-8685.azurewebsites.net
- **Runtime**: Node.js 20
- **Functions Version**: 4
- **OS**: Linux
- **Plan**: Consumption Plan
- **Application Insights**: func-app-demo-8685

## Static Web App (Frontend)
- **Name**: `swa-function-app-demo`
- **URL**: https://brave-meadow-08cbc820f.2.azurestaticapps.net
- **Location**: East US 2
- **SKU**: Free tier
- **Source**: GitHub integration (azure-function-app-demo repository)
- **App Location**: `/frontend`
- **Build Output**: `build`

## Deployment Tokens
- **Static Web App API Token**: `a9251abbcd9d23f821ca328bba65abcbafc8b6dd93cb13def316440bac70cbf702-c7024326-4d28-43c3-b5ad-412c4b98477700f161008cbc820f`
  - Add this as `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub repository settings

## CORS Configuration
- **Function App CORS**: Configured to allow requests from:
  - `http://localhost:3000` (local development)
  - `https://brave-meadow-08cbc820f.2.azurestaticapps.net` (production)

## Clean Up Commands
To delete all resources when done:
```bash
az group delete --name rg-function-app-demo --yes --no-wait
```