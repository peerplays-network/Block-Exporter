import TransactionApi from '../api/TransactionApi';

export const FETCH_OPERATIONS = 'FETCH_OPERATIONS';

export async function fetchOperations() {
	const operations = await TransactionApi.getOperations();
	console.log('FETCH operations called');
	try {
		return {
			type: FETCH_OPERATIONS,
			payload: operations.data ? operations.data : []
		};
	}
	catch(e) {
		console.log(e);
		return {
			type: FETCH_OPERATIONS,
			payload: []
		};
	}
}