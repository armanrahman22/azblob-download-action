import * as core from "@actions/core"
import { download } from "./download"
import { loadConfigFromInputs } from "./config"

async function main() {
	const config = loadConfigFromInputs()
	core.debug(`Config: ${config}`)

	const response = await download(
		config.client,
		config.containerName,
		config.blobName,
		config.downloadPath,
	)
	core.debug(`dowload response: ${response}`)
}

main().catch((e) => {
	core.debug(e.stack)
	core.error(e.message)
	core.setFailed(e.message)
})
