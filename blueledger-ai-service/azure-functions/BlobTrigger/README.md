# Azure Blob Trigger Function

## How It Works
1. Triggered by new blob upload
2. Processes document using Document Intelligence
3. Stores JSON results in result container

## Configuration

### Required Settings
- `BlobContainerName`: Source container for documents
- `ResultBlobContainerName`: Container for JSON results
- `DocumentIntelligenceEndpoint`: Document Intelligence service endpoint
- `storage-account-blueledger-connection-string`: Storage account connection

### Managed Identity Permissions
- Storage Blob Data Contributor role on storage account
- Cognitive Services User role on Document Intelligence

### Key Vault Integration
Store these values in Key Vault:
- `DocumentIntelligenceEndpoint`
- `storage-account-blueledger-connection-string`

Format: `@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/secret-name)` 