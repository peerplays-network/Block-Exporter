import { FETCH_CONTRACT_LIST } from '../actions/ContractActions';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_CONTRACT_LIST:
			return Object.assign({}, state, {
				contractList: action.payload
			});

		default:
			return state;
	}
}
