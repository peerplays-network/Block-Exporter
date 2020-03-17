export const LAYOUT_CHANGES = 'LAYOUT_CHANGE';

export function LayoutChange(data) {
    return {
        type: LAYOUT_CHANGES,
        payload: data
    };
}