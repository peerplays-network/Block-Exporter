export const LAYOUT_CHANGES = 'LAYOUT_CHANGE';

export function onChangeLayout(data) {
    return {
        type: LAYOUT_CHANGES,
        payload: data
    };
}