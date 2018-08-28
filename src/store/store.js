'use strict';

import { createStore,applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

let store = createStoreWithMiddleware(rootReducer);


export default store;