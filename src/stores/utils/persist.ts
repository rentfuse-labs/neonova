import { applySnapshot, onSnapshot } from 'mobx-state-tree';

// Add local storage persist functionality by saving the store on each snapshot
// and setting a snapshot at the beginning if present
export function persist({
	store,
	onGetData,
	onSaveData,
}: {
	store: any;
	onGetData: () => any;
	onSaveData: (data: any) => void;
}) {
	// Take the local storage saved version of the store to apply it
	const data = onGetData();
	if (data !== null) {
		try {
			applySnapshot(store, data);
		} catch (error) {
			console.error(error);
		}
	}

	onSnapshot(store, (snapshot) => {
		try {
			onSaveData(snapshot);
		} catch (error) {
			console.error(error);
		}
	});
}
