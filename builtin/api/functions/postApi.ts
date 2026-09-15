import dayjs from "dayjs";
import { ofetch } from "ofetch";
import  encryptRsa from "../../scripts/functions/encryptRsa";
import api from "configs/api.config.mts"
import security from "configs/security.config.mts"

const TOKEN_NAME = security.token.name;
const TOKEN_EXPIRATION = security.token.expiration;
const URL = api.backend.url;
const RETRY = api.request.retries;
const CODES = api.request.retry_codes;

export default async (api: string, body: { [key: string]: unknown }) => {
	const today = new Date();
	const todayUnix = dayjs(today).unix();
	const expiration = todayUnix + TOKEN_EXPIRATION;
	const aes = encryptRsa(
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
