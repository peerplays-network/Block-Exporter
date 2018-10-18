import axios from 'axios';

export const FETCH_CONTRACT_LIST = 'FETCH_CONTRACT_LIST';

export async function fetchContracts() {
	try {
		const url = '/api/contracts/';
		const request = await axios.get(url);
		const contractData = request.data;
		//add rank to response object
		contractData.map( (el, index) => {return el.rank = index+1;});

		return {
			type: FETCH_CONTRACT_LIST,
			payload: contractData
		};
	}
	catch(e) {
		console.log(e);
		return {
			type: FETCH_CONTRACT_LIST,
			payload: []
		};
	}
}