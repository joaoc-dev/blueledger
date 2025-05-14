using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Azure.Storage.Blobs.Models;

namespace Company.Function;

public static class StorageAccountAccessor
{
    public static async Task<UserDelegationKey> RequestUserDelegationKey(
    BlobServiceClient blobServiceClient, int nMinutes = 10)
    {
        // Get a user delegation key for the Blob service that's valid for 1 day
        UserDelegationKey userDelegationKey =
            await blobServiceClient.GetUserDelegationKeyAsync(
                DateTimeOffset.UtcNow,
                DateTimeOffset.UtcNow.AddMinutes(nMinutes));

        return userDelegationKey;
    }

    public static Uri CreateUserDelegationSASContainer(
        BlobClient blobClient,
        UserDelegationKey userDelegationKey, int nMinutes = 10)
    {
        // Create a SAS token for the container resource that's also valid for 1 day
        BlobSasBuilder sasBuilder = new()
        {
            BlobContainerName = blobClient.BlobContainerName,
            BlobName = blobClient.Name,
            Resource = "b",
            StartsOn = DateTimeOffset.UtcNow,
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(nMinutes)
        };

        // Specify the necessary permissions
        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        // Add the SAS token to the blob URI
        BlobUriBuilder uriBuilder = new(blobClient.Uri)
        {
            // Specify the user delegation key
            Sas = sasBuilder.ToSasQueryParameters(
                userDelegationKey,
                blobClient.AccountName)
        };

        return uriBuilder.ToUri();
    }
}