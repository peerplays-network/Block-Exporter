import { SIDE_BAR_ICON_HIDDEN } from '../actions/NavigationActions';

export default function(state = false, action) {
	switch (action.type) {
		case SIDE_BAR_ICON_HIDDEN:
			return Object.assign({}, state, {
				sideBarHidden: action.payload
			});

		default:
			return state;
	}
}