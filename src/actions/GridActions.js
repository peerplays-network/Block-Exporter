export const SIDE_BAR_OPEN = 'SIDE_BAR_OPEN';

export function sideBarClicked(bool) {
	return {
		type: SIDE_BAR_OPEN,
		payload: bool
	};
}