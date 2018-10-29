import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Root from '../components/Root';
import Home from '../components/Home';
import Test from '../components/Test';
import Account from '../components/Account';
import AccountAllDetail from '../components/Account/AccountAllDetail';
import ContractDetail from '../components/Contracts/ContractDetail';
import BlockView from '../components/BlockView/BlockView';
import TransactionLarge from '../components/Transactions/TransactionLarge';
import FeeDirectory from '../components/FeeDirectory/FeeDirectory';
import BlockList from '../components/BlockView/BlockList';
import Directory from '../components/Directory/Directory';
import Search from '../components/Search/Search';
import Witnesses from '../components/WitnessViewer/WitnessViewer';
import Committee from '../components/Committee/Committee';


export default (
	<div>
		<Route component={Root} />
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/test" component={Test} />
			<Route exact path="/account" component={Account} />
			<Route exact path="/accountAllDetail/*" component={AccountAllDetail} />
			<Route exact path="/contractDetail/*" component={ContractDetail} />
			<Route exact path="/transactions" component={TransactionLarge} />
			<Route exact path="/feeDirectory" component={FeeDirectory} />
			<Route exact path="/block-view/*" component={BlockView} />
			<Route exact path="/block-list" component={BlockList} />
			<Route exact path="/directory" component={Directory} />
			<Route exact path="/witnesses" component={Witnesses} />
			<Route exact path="/committee" component={Committee} />
			<Route exact path="/search/*" component={Search} />
		</Switch>
	</div>
);
