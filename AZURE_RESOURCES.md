# Azure Resources Created

## Resource Group
- **Name**: `rg-function-app-demo`
- **Location**: `eastus`
- **Subscription**: Visual Studio Enterprise Subscription

## Storage Account
- **Name**: `stfunctionappdemo9494`
- **SKU**: Standard_LRS
- **Location**: eastus

## Function App
- **Name**: `func-app-demo-8685`
- **URL**: https://func-app-demo-8685.azurewebsites.net
- **Runtime**: Node.js 20
- **Functions Version**: 4
- **OS**: Linux
- **Plan**: Consumption Plan
- **Application Insights**: func-app-demo-8685

## Clean Up Commands
To delete all resources when done:
```bash
az group delete --name rg-function-app-demo --yes --no-wait
```