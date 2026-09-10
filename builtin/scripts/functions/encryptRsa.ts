import { JSEncrypt } from "jsencrypt";
import * as fs from "node:fs";
import * as toml from "toml";

const config = toml.parse(
	fs.readFileSync("configs/security.config.toml", "utf-8"),
);
const enc = new JSEncrypt();
const PUBLIC_KEY = config.rsa.public_key;

export default (message: string) => {
	enc.setPublicKey(PUBLIC_KEY);
	const encrypted = enc.encrypt(message).toString();
	const fixedEncrypted = encrypted.replace(/\//g, "~");

	return fixedEncrypted;
};
