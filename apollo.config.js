export default function ({$config}) {
	return {
		browserHttpEndpoint: $config.browserHttpEndpoint,
		httpEndpoint: $config.httpEndpoint
	}
}
