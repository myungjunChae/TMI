/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import MainPage from './src/components/pages/MainPage'

async function requestPermission() {
    try {
        let granted = await PermissionsAndroid.requestMultiple(
            [
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]).then((result) => { /*console.log('result', result)*/ });

        //todo : 앱 데이터 허용안했을 경우, 경고창 뜨기
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log("Using Location")
        // } else {
        //     console.log("Not using Location")
        // }
    } catch (err) {
        console.warn(err)
    }
}

deviceList = [];

class App extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        requestPermission();
    }

    render() {
        return (
            <MainPage> deviceList={deviceList}</MainPage>
        );
    }
}

export default App;