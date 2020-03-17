import { FETCH_COMMITTEE_LIST } from '../actions/CommitteeActions';

export default function(state = [], action) {
	switch (action.type) {
		case FETCH_COMMITTEE_LIST:
			return Object.assign({}, state, {
				committeeList: action.payload
			});

		default:
			return state;
	}
}
