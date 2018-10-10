import { FETCH_ACCOUNT_LIST } from '../actions/AccountActions';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_ACCOUNT_LIST:
			return Object.assign({}, state, {
				accountList: action.payload
			});

		default:
			return state;
	}
}
