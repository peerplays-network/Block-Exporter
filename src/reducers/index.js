import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import TestReducer from './reducer_test';
import WitnessReducer from './WitnessReducer';
import AccountReducer from './AccountReducer';
import ContractReducer from './ContractReducer';
import GridReducer from './GridReducer';
import NavigationReducer from './NavigationReducer';
import CommitteeReducer from './CommitteeReducer';

const rootReducer = combineReducers({
	routing: routerReducer,
	testPage: TestReducer,
	witnesses: WitnessReducer,
	accounts: AccountReducer,
	contracts: ContractReducer,
	grid: GridReducer,
	nav: NavigationReducer,
	committee: CommitteeReducer
});

export default rootReducer;
