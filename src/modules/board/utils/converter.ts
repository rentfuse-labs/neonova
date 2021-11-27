import { StackItemType } from '@rentfuse-labs/neo-wallet-adapter-base';
import { u } from '@cityofzion/neon-js';

export function fromStackItem(type: StackItemType, value: any) {
	console.log(type, value);
	switch (type) {
		case 'ByteString':
			// NB: If the value is String or ByteArray, it is encoded by Base64
			const hexValue = u.base642hex(value);
			const strValue = u.hexstring2str(hexValue);

			return isNaN(+strValue) ? strValue : +strValue;
		default:
			return value;
	}
}
