import { FETCH_OPERATIONS } from '../actions/TransactionActions';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_OPERATIONS:
			return Object.assign({}, state, {
				operations: action.payload
			});

		default:
			return state;
	}
}
