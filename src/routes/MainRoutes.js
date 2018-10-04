import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Root from '../components/Root';
import Home from '../components/Home';
import Test from '../components/Test';
import Account from '../components/Account';
import AccountAllDetail from '../components/Account/AccountAllDetail';
import FeeDirectory from '../components/FeeDirectory/FeeDirectory';

export default (
	<div>
		<Route component={Root} />
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/test" component={Test} />
			<Route exact path="/account" component={Account} />
			<Route exact path="/accountAllDetail/*" component={AccountAllDetail} />
			<Route exact path="/feeDirectory" component={FeeDirectory} />
		</Switch>
	</div>
);
