using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Identity;
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Azure.Storage.Blobs.Models;
using Google.Protobuf;

namespace Company.Function;

public class BlobTrigger
{
    private readonly ILogger<BlobTrigger> _logger;
    private readonly IConfiguration _config;

    public BlobTrigger(ILogger<BlobTrigger> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    [Function(nameof(BlobTrigger))]
    public async Task Run(
        [BlobTrigger("%BlobContainerName%/{name}", Connection = "storage-account-blueledger-connection-string")] Stream stream,
        string name)
    {
        _logger.LogInformation("Processing uploaded file: {name}", name);
        if (!name.Contains(".json"))
        {

            string documentIntelligenceEndpoint = _config["DocumentIntelligenceEndpoint"] ?? "";
            string storageAccountURL = _config["storageaccountblueledger_URL"] ?? "";
            string blobContainerName = _config["BlobContainerName"]??"";

            DefaultAzureCredential credential = new();

            _logger.LogInformation("Generating Blob URI SAS token");

            var blobServiceClient = new BlobServiceClient(new Uri(storageAccountURL), credential);
            var containerClient = blobServiceClient.GetBlobContainerClient(blobContainerName);
            var blobClient = containerClient.GetBlobClient(name);
            UserDelegationKey userDelegationKey = await StorageAccountAccessor.RequestUserDelegationKey(blobServiceClient);
            Uri blobSASRUI = StorageAccountAccessor.CreateUserDelegationSASContainer(blobClient, userDelegationKey);

            _logger.LogInformation("Sending document to Azure Document Intelligence...");

            DocumentAnalysisClient documentAnalysisClient = new(new Uri(documentIntelligenceEndpoint), credential);
            var operation = await documentAnalysisClient.AnalyzeDocumentFromUriAsync(WaitUntil.Completed, "prebuilt-receipt", blobSASRUI);
            var result = operation.Value;

            _logger.LogInformation("Uploading json");
            // Serialize result
            JsonSerializerOptions jsonSerializerOptions= new(){ WriteIndented = true };
            var jsonOutput = JsonSerializer.Serialize(result, jsonSerializerOptions);

            // Save the result as a .json file
            var jsonBlobClient = containerClient.GetBlobClient(Path.ChangeExtension(name, ".json"));
            using var outputStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(jsonOutput));
            await jsonBlobClient.UploadAsync(outputStream, overwrite: true);

            _logger.LogInformation("Analysis result saved as {0}", jsonBlobClient.Uri);
        }
    }
}