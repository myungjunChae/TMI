/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, PermissionsAndroid} from 'react-native';

import MainPage from './src/components/pages/MainPage'

async function requestPermission() {
    try {
      let granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, 
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]).then((result)=>{console.log('result',result)});
  
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Using Location")
      } else {
        console.log("Not using Location")
      }
    } catch (err) {
      console.warn(err)
    }
}

class App extends Component{
  componentWillMount() {
    requestPermission();
  }

  render() {
    return (
      <MainPage/>
    );
  }
}

export default App;