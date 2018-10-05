import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import TestReducer from './reducer_test';
import WitnessReducer from './WitnessReducer';

const rootReducer = combineReducers({
	routing: routerReducer,
	testPage: TestReducer,
	witnesses: WitnessReducer
});

export default rootReducer;
