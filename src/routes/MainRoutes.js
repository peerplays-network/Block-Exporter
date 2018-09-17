import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Root from '../components/Root';
import Home from '../components/Home';
import Test from '../components/Test';

export default (
	<div>
		<Route component={Root} />
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/test" component={Test} />
		</Switch>
	</div>
);
