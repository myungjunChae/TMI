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
import { SampleProvider } from './src/context';

import MainPage from './src/components/pages/MainPage'

async function requestPermission() {
    try {
        let granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]).then((result) => {});

        //todo : 앱 데이터 허용안했을 경우, 경고창 뜨기

    } catch (err) {
        console.warn(err)
    }
}

deviceList = [];

class App extends Component {git 
    constructor() {
        super();
    }

    componentWillMount() {
        requestPermission();
    }

    render() {
        return (
            <SampleProvider>
                <MainPage> deviceList={deviceList}</MainPage>
            </SampleProvider>
        );
    }
}

export default App;