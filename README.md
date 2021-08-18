# Azure Blob Download Action

This action downloads an azure blob to the specified destination

## Sample workflows to download Azure Blob

### with Azure Login Action

```yaml
# File: .github/workflows/workflow.yml

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # checkout the repo
      - uses: actions/checkout@master
      - uses: Azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - name: Azure Blob Storage - Download Blob
        uses: armanrahman22/azblob-download-action
        with:
          storage-account-name: "my-account-name"
          container-name: "my-blob-name"
          blob-name: "my-blob-name"
          download-path: "."
      - name: View Output
        run: |
          ls
          cat my-blob-name
```

### with connection string

```yaml
# File: .github/workflows/workflow.yml

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # checkout the repo
      - uses: actions/checkout@master
      - name: Azure Blob Storage - Download Blob
        uses: armanrahman22/azblob-download-action
        with:
          connection-string: "my-connection-string"
          container-name: "my-blob-name"
          blob-name: "my-blob-name"
          download-path: "."
      - name: View Output
        run: |
          ls
          cat my-blob-name
```

### with AZURE_CREDENTIALS secret

```yaml
# File: .github/workflows/workflow.yml

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # checkout the repo
      - uses: actions/checkout@master
      - name: Azure Blob Storage - Download Blob
        uses: armanrahman22/azblob-download-action
        with:
          storage-account-name: "my-storage-account-name"
          creds: ${{ secrets.AZURE_CREDENTIALS }}
          container-name: "my-blob-name"
          blob-name: "my-blob-name"
          download-path: "."
      - name: View Output
        run: |
          ls
          cat my-blob-name
```

## Configure Azure credentials

To fetch the credentials required to authenticate with Azure, run the following command to generate an Azure Service Principal (SPN) with Contributor permissions:

```sh
az ad sp create-for-rbac --name "myApp" --role contributor \
                            --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
                            --sdk-auth

  # Replace {subscription-id}, {resource-group} with the subscription, resource group details of your keyvault

  # The command should output a JSON object similar to this:

  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

Add the json output as [a secret](https://aka.ms/create-secrets-for-GitHub-workflows) (let's say with the name `AZURE_CREDENTIALS`) in the GitHub repository.
