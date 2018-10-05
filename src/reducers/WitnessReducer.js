import { FETCH_WITNESS_LIST } from '../actions/WitnessActions';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_WITNESS_LIST:
			return Object.assign({}, state, {
				witnessList: action.payload
			});

		default:
			return state;
	}
}
