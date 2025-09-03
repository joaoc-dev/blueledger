using System.Text.Json;
using Azure.Identity;
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BlueLedger.Function;

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
    [BlobOutput("%ResultBlobContainerName%/{name}.json", Connection = "storage-account-blueledger-connection-string")]
    public async Task<string> Run(
    [BlobTrigger("%BlobContainerName%/{name}", Connection = "storage-account-blueledger-connection-string")] byte[] myBlob,
    string name)
    {
        _logger.LogInformation("Processing uploaded file: {name}", name);
        string documentIntelligenceEndpoint = _config["DocumentIntelligenceEndpoint"] ?? "";
        DefaultAzureCredential credential = new();

        _logger.LogInformation("Sending document to Azure Document Intelligence...");

        DocumentAnalysisClient documentAnalysisClient = new(new Uri(documentIntelligenceEndpoint), credential);

        // Create a MemoryStream from the byte array
        using MemoryStream stream = new MemoryStream(myBlob);

        var operation = await documentAnalysisClient.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-receipt", stream);
        var result = operation.Value;

        _logger.LogInformation("Finished analyzing document");
        // Serialize result
        JsonSerializerOptions jsonSerializerOptions = new() { WriteIndented = true };
        var jsonOutput = JsonSerializer.Serialize(result, jsonSerializerOptions);

        _logger.LogInformation("Uploading json");
        return jsonOutput;
    }
}
