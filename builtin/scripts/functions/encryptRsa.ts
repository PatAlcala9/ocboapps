import { JSEncrypt } from "jsencrypt";
import security from "configs/security.config.mts"

const enc = new JSEncrypt();
const PUBLIC_KEY = security.rsa.public_key;

export default (message: string) => {
	enc.setPublicKey(PUBLIC_KEY);
	const encrypted = enc.encrypt(message).toString();
	const fixedEncrypted = encrypted.replace(/\//g, "~");

	return fixedEncrypted;
};
