import { StackItemType, ArgumentType } from '@rentfuse-labs/neo-wallet-adapter-base';
import { u, sc, wallet } from '@cityofzion/neon-js';

function isBase64(value: any) {
	const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	return base64regex.test(value);
}

// Make recursive if map, return value of the function
export function toStackItemValue(type: StackItemType, value: any) {
	switch (type) {
		case 'Map':
			// Value is an array of object with key and value that are stackitems
			const res: any = [];
			for (const _value of value) {
				res.push({key: toStackItemValue(_value.key.type, _value.key.value), value:toStackItemValue(_value.value.type, _value.value.value)});
			}
			return res;
		case 'ByteString':
			/*
			// NB: If the value is String or ByteArray, it is encoded by Base64
			const hexValue = u.base642hex(value);
			// if it's an address return it as a scripthash (littleEndian so reverse it)
			if (wallet.isScriptHash(u.reverseHex(hexValue))) {
				return wallet.getAddressFromScriptHash(u.reverseHex(hexValue));
			}
			if (!isNaN(u.HexString.fromHex(u.reverseHex(hexValue)).toNumber())) {
				return u.HexString.fromHex(u.reverseHex(hexValue)).toNumber();
			}
			// ToString -> u.hexstring2str(hexValue)
			// ToNumber -> u.HexString.fromHex(u.reverseHex(hexValue)).toNumber()
			// ToAddress (If scripthash) -> wallet.getAddressFromScriptHash(u.reverseHex(hexValue))
			*/
			return value;
		default:
			return value;
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
