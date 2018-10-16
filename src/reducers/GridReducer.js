import { SIDE_BAR_OPEN } from '../actions/GridActions';

export default function(state = true, action) {
	switch (action.type) {
		case SIDE_BAR_OPEN:
			return Object.assign({}, state, {
				sideBarOpen: action.payload
			});

		default:
			return state;
	}
}