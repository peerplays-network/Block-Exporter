import { FETCH_BTC_EXCHANGE_RATES } from '../actions/index';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_BTC_EXCHANGE_RATES:
			return Object.assign({}, state, {
				rates: action.payload.data
			});

		default:
			return state;
	}
}
