import axios from 'axios';

export const FETCH_WITNESS_LIST = 'FETCH_WITNESS_LIST';

export async function fetchWitnesses() {
	const url = 'api/witnesses';
	const request = await axios.get(url);
	const sortedWitnessData = request.data;
	//add rank to response object
	sortedWitnessData.map( (el, index) => {return el.rank = index+1;});

	return {
		type: FETCH_WITNESS_LIST,
		payload: sortedWitnessData
	};
}