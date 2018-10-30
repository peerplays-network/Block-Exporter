export const SIDE_BAR_ICON_HIDDEN = 'SIDE_BAR_ICON_HIDDEN';

export function showSideBarIcon(bool) {
	return {
		type: SIDE_BAR_ICON_HIDDEN,
		payload: bool
	};
}