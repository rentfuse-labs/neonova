import { StackItemType, ArgumentType } from '@rentfuse-labs/neo-wallet-adapter-base';
import { u, sc } from '@cityofzion/neon-js';

export function fromStackItem(type: StackItemType, value: any) {
	switch (type) {
		case 'ByteString':
			// NB: If the value is String or ByteArray, it is encoded by Base64
			const hexValue = u.base642hex(value);
			const strValue = u.hexstring2str(hexValue);

			return isNaN(+strValue) ? strValue : +strValue;
		default:
			return sc.ContractParam.boolean(value);
	}
}

// https://github.com/CityOfZion/neon-js/blob/v5.0.0-next.16/packages/neon-core/src/sc/ContractParam.ts
export function toInvocationArgument(type: ArgumentType, value: any) {
	const arg = { type, value };

	switch (type) {
		case 'Any':
			arg.value = null;
			break;
		case 'Boolean':
			// Does basic checks to convert value into a boolean. Value field will be a boolean.
			arg.value = sc.ContractParam.boolean(value).toJson().value;
			break;
		case 'Integer':
			// A value that can be parsed to a BigInteger. Numbers or numeric strings are accepted.
			arg.value = sc.ContractParam.integer(value).toJson().value;
			break;
		case 'ByteArray':
			// A string or HexString.
			arg.value = sc.ContractParam.byteArray(value).toJson().value;
			break;
		case 'String':
			// UTF8 string.
			arg.value = sc.ContractParam.string(value).toJson().value;
			break;
		case 'Hash160':
			// A 40 character (20 bytes) hexstring. Automatically converts an address to scripthash if provided.
			arg.value = sc.ContractParam.hash160(value).toJson().value;
			break;
		case 'Hash256':
			// A 64 character (32 bytes) hexstring.
			arg.value = sc.ContractParam.hash256(value).toJson().value;
			break;
		case 'PublicKey':
			// A public key (both encoding formats accepted)
			arg.value = sc.ContractParam.publicKey(value).toJson().value;
			break;
		case 'Signature':
			// TODO: NOT SUPPORTED
			break;
		case 'Array':
			// Pass an array as JSON [{type: 'String': value: 'blabla'}]
			arg.value = sc.ContractParam.fromJson(value).toJson().value;
			break;
		case 'Map':
			// TODO: NOT SUPPORTED
			break;
		case 'InteropInterface':
			// TODO: NOT SUPPORTED
			break;
		case 'Void':
			// Value field will be set to null.
			arg.value = null;
			break;
	}

	return arg;
}
