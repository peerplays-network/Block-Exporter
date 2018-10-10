import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import TestReducer from './reducer_test';
import WitnessReducer from './WitnessReducer';
import AccountReducer from './AccountReducer';

const rootReducer = combineReducers({
	routing: routerReducer,
	testPage: TestReducer,
	witnesses: WitnessReducer,
	accounts: AccountReducer,
});

export default rootReducer;
