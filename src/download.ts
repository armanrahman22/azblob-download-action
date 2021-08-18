import {
	BlobDownloadResponseParsed,
	BlobServiceClient,
} from "@azure/storage-blob"
import * as core from "@actions/core"

export async function download(
	client: BlobServiceClient,
	containerName: string,
	blobName: string,
	downloadPath: string,
): Promise<BlobDownloadResponseParsed> {
	core.info(`Get blob ${blobName} from container "${containerName}" ...`)
	const containerClient = await client.getContainerClient(containerName)
	const blobClient = await containerClient.getBlobClient(blobName)
	return await blobClient.downloadToFile(downloadPath)
}
