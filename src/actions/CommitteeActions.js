import axios from 'axios';

export const FETCH_COMMITTEE_LIST = 'FETCH_COMMITTEE_LIST';

export async function fetchCommittee() {
	try {
		const url = '/api/committee/';
		const request = await axios.get(url);
		const committeeList = request.data;
		//add rank to response object
		committeeList.map( (el, index) => {return el.rank = index+1;});

		return {
			type: FETCH_COMMITTEE_LIST,
			payload: committeeList
		};
	}
	catch(e) {
		console.log(e);
		return {
			type: FETCH_COMMITTEE_LIST,
			payload: []
		};
	}
}