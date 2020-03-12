import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import TestReducer from './reducer_test';
import WitnessReducer from './WitnessReducer';
import AccountReducer from './AccountReducer';
import GridReducer from './GridReducer';
import NavigationReducer from './NavigationReducer';
import CommitteeReducer from './CommitteeReducer';
import TransactionReducer from './TransactionReducer';

const rootReducer = combineReducers({
	routing: routerReducer,
	testPage: TestReducer,
	witnesses: WitnessReducer,
	accounts: AccountReducer,
	grid: GridReducer,
	nav: NavigationReducer,
	committee: CommitteeReducer,
	transactions: TransactionReducer
});

export default rootReducer;
