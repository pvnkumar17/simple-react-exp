import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { connectRoutes } from 'redux-first-router';
import routesMap from './routesMap';
import options from './options';
import * as reducers from './reducers';
import thunk from 'redux-thunk';

export default () => {
  const middlewares = [thunk];

  const { reducer, middleware, enhancer } = connectRoutes(
  routesMap, {
    ...options
  });

  middlewares.push(middleware);

  const rootReducer = combineReducers({ ...reducers, location: reducer });
  const enhancers = composeEnhancers(enhancer, applyMiddleware(...middlewares));
  const store = createStore(rootReducer, enhancers);
  return store;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;