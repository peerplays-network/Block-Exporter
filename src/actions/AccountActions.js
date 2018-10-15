import axios from 'axios';

export const FETCH_ACCOUNT_LIST = 'FETCH_ACCOUNT_LIST';

export async function fetchAccounts() {
	try {
		const url = '/api/accounts/';
		const request = await axios.get(url);
		const accountData = request.data;
		//add rank to response object
		accountData.map( (el, index) => {return el.rank = index+1;});

		return {
			type: FETCH_ACCOUNT_LIST,
			payload: accountData
		};
	}
	catch(e) {
		console.log(e);
		return {
			type: FETCH_ACCOUNT_LIST,
			payload: []
		};
	}
}