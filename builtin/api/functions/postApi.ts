import dayjs from "dayjs";
import * as fs from "node:fs";
import { ofetch } from "ofetch";
import * as toml from "toml";
import { encryptRsa } from "../../scripts/index";

const apiConfig = toml.parse(
	fs.readFileSync("configs/api.config.toml", "utf-8"),
);
const securityConfig = toml.parse(
	fs.readFileSync("configs/security.config.toml", "utf-8"),
);

const TOKEN_NAME = securityConfig.token.name;
const TOKEN_EXPIRATION = securityConfig.token.expiration;
const URL = apiConfig.backend.url;
const RETRY = apiConfig.request.retries;
const CODES = apiConfig.request.retry_codes;

export default async (api: string, body: { [key: string]: unknown }) => {
	const today = new Date();
	const todayUnix = dayjs(today).unix();
	const expiration = todayUnix + TOKEN_EXPIRATION;
	const aes = await encryptRsa(
		`${api.toString()}-${todayUnix.toString()}-${expiration.toString()}`,
	);

	const hash = `${TOKEN_NAME}=${aes}token`;
	try {
		await ofetch(URL + api, {
			headers: {
				Accept: "application/json",
				"Cache-Control": "no-cache",
				"Dasig-Token": hash,
			},
			retry: RETRY,
			retryDelay: 500,
			retryStatusCodes: CODES,
			method: "POST",
			body: body,
		});
		return true;
	} catch {
		return false;
	}
};
