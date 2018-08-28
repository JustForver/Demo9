import React, { Component } from 'react';
import {Provider} from 'react-redux';
import store from './store/store';
import MainScreen from './mainScreen/mainScreen';

export default class Root extends Component {

    render() {
        return (
            <Provider store={store}>
                <MainScreen/>
            </Provider>
        );
    }
}

