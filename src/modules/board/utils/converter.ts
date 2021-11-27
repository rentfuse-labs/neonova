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
	switch (type) {
		case 'Any':
			return sc.ContractParam.any(value);
		case 'Boolean':
			// Does basic checks to convert value into a boolean. Value field will be a boolean.
			return sc.ContractParam.boolean(value);
		case 'Integer':
			// A value that can be parsed to a BigInteger. Numbers or numeric strings are accepted.
			return sc.ContractParam.integer(value);
		case 'ByteArray':
			// A string or HexString.
			return sc.ContractParam.byteArray(value);
		case 'String':
			// UTF8 string.
			return sc.ContractParam.string(value);
		case 'Hash160':
			// A 40 character (20 bytes) hexstring. Automatically converts an address to scripthash if provided.
			return sc.ContractParam.hash160(value);
		case 'Hash256':
			// A 64 character (32 bytes) hexstring.
			return sc.ContractParam.hash256(value);
		case 'PublicKey':
			// A public key (both encoding formats accepted)
			return sc.ContractParam.publicKey(value);
		case 'Signature':
			// TODO: NOT SUPPORTED
			return sc.ContractParam.any(value);
		case 'Array':
			// Pass an array as JSON [{type: 'String': value: 'blabla'}]
			return sc.ContractParam.fromJson(value);
		case 'Map':
			// TODO: NOT SUPPORTED
			return sc.ContractParam.any(value);
		case 'InteropInterface':
			// TODO: NOT SUPPORTED
			return sc.ContractParam.any(value);
		case 'Void':
			// Value field will be set to null.
			return sc.ContractParam.void();
	}
}
