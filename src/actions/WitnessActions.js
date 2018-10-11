import axios from 'axios';

export const FETCH_WITNESS_LIST = 'FETCH_WITNESS_LIST';

export async function fetchWitnesses() {
	try {
		const url = '/api/witnesses';
		const request = await axios.get(url);
		let sortedWitnessData = request.data;
		//add rank to response object
		!!sortedWitnessData ? sortedWitnessData.map( (el, index) => {return el.rank = index+1;}) : sortedWitnessData=[];
		return {
			type: FETCH_WITNESS_LIST,
			payload: sortedWitnessData
		};
	}
	catch(e) {
		console.log(e);
		return {
			type: FETCH_WITNESS_LIST,
			payload: []
		};
	}

	
}