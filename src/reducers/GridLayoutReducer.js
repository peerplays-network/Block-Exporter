import { LAYOUT_CHANGES } from '../actions/GridLayoutActions';
var startingX=(12 * 1920/window.innerWidth)+1;
export default function(state = {
    components:[{name: 'Witness Feed', img: 'fas fa-cogs fa-2x', minSize: 'small', size: 'large', visible: true, id: 0, gridPlacement: {i: '0', x: startingX, y: 5, w: 24, h: 25}}, {name: 'Maintenance Countdown', img: 'fas fa-clock fa-2x', minSize: 'small', size: 'large', visible: true, id: 1, gridPlacement: {i: '1', x: startingX, y: 54, w: 24, h: 11}}, {name: 'Account Feed', img: 'fas fa-user-alt fa-2x', minSize:'large', size: '', visible: false, id: 2, gridPlacement: {i: '2', x: startingX, y: 0, w: 24, h: 24}}, {name: 'Transaction Feed', img: 'fas fa-handshake fa-2x', minSize:'large', size: 'large', visible: true, id:3, gridPlacement: {i: '3', x: 42, y: 5, w: 24, h: 31}}, {name: 'Fee Schedule', img: 'fas fa-file-invoice-dollar fa-2x', minSize:'medium', size: '', visible: false, id:4, gridPlacement: {i: '4', x: startingX, y: 0, w: 24, h: 23}}, {name: 'Contract Feed', img: 'fas fa-file-signature fa-2x', minSize:'large', size: '', visible: false, id: 5, gridPlacement: {i: '5', x: startingX, y: 0, w: 24, h: 31}}, {name: 'Committee Feed', img: 'fas fa-crown fa-2x', minSize:'small', size: '', visible: false, id: 6, gridPlacement: {i: '6', x: startingX, y: 0, w: 24, h: 25}}],
    layout:[{i: '-1', x: 0, y: -0.5, w: 12, h: 0, static: true}, {i: '0', x: startingX, y: 5, w: 24, h: 25}, {i: '1', x: startingX, y: 54, w: 24, h: 11}, {i: '3', x: 42, y: 5, w: 24, h: 31}]
}, action) {
    switch (action.type) {
        case LAYOUT_CHANGES:
            return Object.assign({}, state, {
                 ...action.payload
            });

        default:
            return state;
    }
}