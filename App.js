/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, PermissionsAndroid } from 'react-native';

import MainPage from './src/components/pages/MainPage'

async function requestPermission() {
    try {
        let granted = await PermissionsAndroid.requestMultiple(
            [
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ]).then((result) => { console.log('result', result) });

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

        this.state = {
            //기기의 블루투스와 GPS 상태
            moduleState: {
                bluetooth: false,
                location: false,
            },

            //다른 Bluetooth 기기들을 검색하고 있는지 상태
            scanState: false,
        }
    }

    componentWillMount() {
        requestPermission();
    }

    componentDidMount() {
        StatusBar.setHidden(true);
     }

    render() {
        return (
            <MainPage/>
        );
    }
}

export default App;