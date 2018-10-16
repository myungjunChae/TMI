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

            //Bluetooth Manager
            manager: new BleManager(),
        }

        this.startDeviceScan = this.startDeviceScan.bind(this);
    }

    componentWillMount() {
        requestPermission();
    }

    componentDidMount() {
        this.state.manager.onStateChange(newState => {
            if (newState != "PoweredOn")
                return;

            this.startDeviceScan();
        }, true);
    }

    startDeviceScan = () => {
        console.log("ble scan on");
        //todo : 사용자가 알아차릴 수 있는 것으로 해서 scan on 알려주기 (toast)

        //Detected Device Array 및 Screen clear
        deviceList = [];
        this.setState({ text: [] });

        this.state.manager.startDeviceScan(
            null,
            { allowDuplicates: true },
            (error, device) => {
                //에러 검출
                if (error) {
                    console.log("SCAN", error);
                    return;
                }

                //내가 소유한 기기 검색
                if (device.name === "Bluno") {
                    // this._log(`DeviceName : ${device.name} / Rssi : ${device.rssi}`);
                    //console.log(device.name === "Bluno");
                    console.log(`DeviceName : ${device.name} / Rssi : ${device.rssi}`);
                }

                //이미 Detecting된 Device 예외처리
                try {
                    deviceList.forEach(alreadyDetected => {
                        if (alreadyDetected.id === device.id)
                            throw alreadyDetected;
                    });
                } catch (e) {
                    //console.log(`Already Detect Device : ${e.id}`);
                    return;
                }

                console.log(`Device : ${device.id}`);
                deviceList.push(device)
            }
        );

    }

    render() {
        return (
            <MainPage> deviceList={deviceList}</MainPage>
        );
    }
}

export default App;