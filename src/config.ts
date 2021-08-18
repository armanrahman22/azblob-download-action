import { getInput, setFailed } from "@actions/core"
import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity"
import {
	BlobServiceClient,
	StorageSharedKeyCredential,
} from "@azure/storage-blob"

export interface Config {
	readonly client: BlobServiceClient
	readonly blobName: string
	readonly downloadPath: string
	readonly containerName: string
}

export interface Creds {
	readonly clientId: string
	readonly clientSecret: string
	readonly tenantId: string
}

export function loadConfigFromInputs(): Config {
	const account = getInput("storage-account-name")
	const accountKey = getInput("storage-account-key")
	const credsInput = getInput("creds")
	const connectionString = getInput("connection-string")
	const sas = getInput("sas")
	let creds: Creds
	let client: BlobServiceClient
	if (
		process.env.AZURE_TENANT_ID &&
		process.env.AZURE_CLIENT_ID &&
		process.env.AZURE_CLIENT_SECRET &&
		account
	) {
		const defaultAzureCredential = new DefaultAzureCredential()
		client = new BlobServiceClient(
			`https://${account}.blob.core.windows.net`,
			defaultAzureCredential,
		)
	}
	if (credsInput && account) {
		creds = JSON.parse(credsInput)
		const clientCredential = new ClientSecretCredential(
			creds.tenantId,
			creds.clientId,
			creds.clientSecret,
		)
		client = new BlobServiceClient(
			`https://${account}.blob.core.windows.net`,
			clientCredential,
		)
	} else if (connectionString) {
		client = BlobServiceClient.fromConnectionString(connectionString)
	} else if (account && accountKey) {
		const sharedKeyCredential = new StorageSharedKeyCredential(
			account,
			accountKey,
		)
		client = new BlobServiceClient(
			`https://${account}.blob.core.windows.net`,
			sharedKeyCredential,
		)
	} else if (sas && account) {
		client = new BlobServiceClient(
			`https://${account}.blob.core.windows.net${sas}`,
		)
	} else {
		setFailed(
			"Could not create a blob service client from any of the params provided",
		)
	}
	return {
		client,
		blobName: getInput("blob-name"),
		downloadPath: getInput("download-path"),
		containerName: getInput("container-name"),
	}
}
