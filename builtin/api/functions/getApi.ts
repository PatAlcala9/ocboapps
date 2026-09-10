import * as fs from "node:fs";
import { ofetch } from "ofetch";
import * as toml from "toml";

const config = toml.parse(fs.readFileSync("configs/api.config.toml", "utf-8"));
const URL = config.backend.backend_url;
const RETRY = config.request.request_retries;
const CODES = config.request.request_retry_codes;

export default async (
	api: string,
	value?: string | number,
	value2?: string | number,
) => {
	try {
		let fetch: { [key: string]: unknown };
		if (!value2) {
			if (!value) {
				fetch = await ofetch(URL + api, {
					parseResponse: JSON.parse,
					retry: RETRY,
					retryDelay: 500,
					retryStatusCodes: CODES,
				});
			} else {
				fetch = await ofetch(`${URL}${api}/${value}/fetch-data`, {
					parseResponse: JSON.parse,
					retry: RETRY,
					retryDelay: 500,
					retryStatusCodes: CODES,
				});
			}
		} else {
			fetch = await ofetch(`${URL}${api}/${value}/${value2}/fetch-data`, {
				parseResponse: JSON.parse,
				retry: RETRY,
				retryDelay: 500,
				retryStatusCodes: CODES,
			});
		}
		const result = fetch;
		return [result, null];
	} catch (error) {
		return [[], error];
	}
};
