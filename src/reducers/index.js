import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import TestReducer from './reducer_test';

const rootReducer = combineReducers({
	routing: routerReducer,
	testPage: TestReducer
});

export default rootReducer;
