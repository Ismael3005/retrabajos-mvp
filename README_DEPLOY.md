README - Deploy instructions (summary)

Files included:
- index.html  (frontend)
- functionapp/RetrabajosHttp/function.json
- functionapp/RetrabajosHttp/index.js
- functionapp/RetrabajosHttp/package.json

Quick deploy (recommended: use VS Code / Azure Functions extension)
1) Create Azure Function App (Node 18) in your subscription (Consumption or App Service plan).
   - Choose a resource group, runtime: Node, version 18 LTS, Functions v4.
2) In the Function App's Configuration, add application settings:
   - AZURE_STORAGE_CONNECTION_STRING = <connection string of the storage account>
   - RETRABAJOS_CONTAINER = retrabajos
3) Deploy the function folder functionapp to the Function App.
   - With VS Code: open folder, use Azure Functions extension -> Deploy to Function App.
   - Or use 'func azure functionapp publish <APP_NAME>' (Azure Functions Core Tools).
4) Get the function URL (in Azure Portal: Function -> Get Function URL) it will look like:
   https://<APP_NAME>.azurewebsites.net/api/RetrabajosHttp?code=<key>
5) Edit index.html: set API_URL to the function URL from step 4.
6) Host index.html in Azure Static Web Apps or any web hosting (or open locally to test).
7) Test: submit form -> it will POST and create blobs in container 'retrabajos' of the storage account.

If you prefer security with Managed Identity:
- Create the Function App with System Assigned Managed Identity.
- In the Storage Account IAM, assign role 'Storage Blob Data Contributor' to the Function's principal.
- Remove AZURE_STORAGE_CONNECTION_STRING and use DefaultAzureCredential in the function (requires small change).

Notes:
- Do NOT expose storage connection strings in frontend code.
- For production, consider validation, auth (Azure AD), CORS and file size limits for uploads.
