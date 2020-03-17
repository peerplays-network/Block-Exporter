import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
// import thunk from 'redux-thunk';
import promise from 'redux-promise';

import rootReducer from '../reducers';

const persistConfig = {
	key: 'root',
	storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
	testPage: { rates: 'not yet loaded' }
};

export default function configureStore(history) {
	const middleware = routerMiddleware(history);
	const middlewares = [promise, middleware];

	if (process.env.NODE_ENV !== 'production') {
		const logger = createLogger();
		middlewares.push(logger);
	}

	const store = createStore(
		persistedReducer,
		initialState,
		composeEnhancers(applyMiddleware(...middlewares))
	);

	if (module.hot) {
		module.hot.accept(() => {
			const nextRootReducer = require('../reducers').default;
			store.replaceReducer(nextRootReducer);
		});
	}

	let persistor = persistStore(store);

	return { store, persistor }
}
