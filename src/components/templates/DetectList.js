import React from 'react';
import { 
    StyleSheet, 
    Text, View, Button, 
    FlatList, TouchableNativeFeedback,
    PermissionsAndroid } from 'react-native';
import { StyledView } from './style/style';
import styled from 'styled-components';
import { BleManager } from 'react-native-ble-plx';

deviceList = [];

class DetectList extends React.Component{    
    constructor(props){
        super(props);

        this.state = {
            text : [],

            //dummy data
            deviceList : [
                {
                    id : "09:5B:06:72:82:DD",
                    name : "Bluno"    
                },
                {
                    id : "33:AB:09:12:22:MA",
                    name : "Rasp"    
                },
                {
                    id : "12:zb:11:83:19:nA",
                    name : "Dummy1"    
                },
                {
                    id : "52:aB:00:42:44:dA",
                    name : "Dummy2"    
                }
            ],

            //기기의 블루투스와 GPS 상태
            moduleState : {
                bluetooth : false,
                location : false,
            },

            //다른 Bluetooth 기기들을 검색하고 있는지 상태
            scanState : false,

            //Bluetooth Manager
            manager : new BleManager(),
        };

        this.toggleDeviceScan  = this.toggleDeviceScan.bind(this)
    }

    _log = (text, ...args) => {
        this.setState({
          text: [text, ...this.state.text]
        });
      };
    
     _logError = (tag, error) => {
        this._log(
          tag +
            "ERROR(" +
            error.errorCode +
            "): " +
            error.message +
            "\nREASON: " +
            error.reason +
            " (att: " +
            error.attErrorCode +
            ", ios: " +
            error.iosErrorCode +
            ", and: " +
            error.androidErrorCode +
            ")"
        );
    };

    toggleDeviceScan(){
        //scanState가 false이면 scanning
        if(!this.state.scanState){
            console.log("ble scan on");
            //todo : 사용자가 알아차릴 수 있는 것으로 해서 scan on 알려주기 (toast)

            //Detected Device Array 및 Screen clear
            deviceList = [];
            this.setState({text : []});

            this.state.manager.startDeviceScan(
                null,
                {allowDuplicates: true},
                (error, device) => {
                    //에러 검출
                    if (error) {
                        this._logError("SCAN", error);
                        return;
                    }
        
                    //내가 소유한 기기 검색
                    if(device.name === "Bluno"){
                        this._log(`DeviceName : ${device.name} / Rssi : ${device.rssi}`);
                        console.log(device.name === "Bluno");
                        console.log(`DeviceName : ${device.name} / Rssi : ${device.rssi}`);
                    }
        
                    //이미 Detecting된 Device 예외처리
                    try{
                        deviceList.forEach(alreadyDetected => {
                            if(alreadyDetected.id === device.id)
                                throw alreadyDetected;
                        });
                    }catch(e){
                        console.log(`Already Detect Device : ${e.id}`);
                        return;
                    }
                    
                    this._log(`Device : ${device.id}`);
                    deviceList.push(device)
                }
            );
        }else{
            console.log("ble scan off");
            this.state.manager.stopDeviceScan();
        }

        //state toggle
        this.setState({scanState : !this.state.scanState});
    }

    render() {
        return ( 
          <View
            style={styles.container}
          >
            <FlatList
              style={styles.container}
              data={this.state.deviceList}
              renderItem={({ item }) => <Text> {item.name} </Text>}
              keyExtractor={(item) => item.id}
            />
            
            <TouchableNativeFeedback
            onPress={this.toggleDeviceScan}
            background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{alignSelf: 'stretch', height: 100, backgroundColor: 'red'}}>
                    <Text style={{margin: 30}}>Button</Text>
                </View>
            </TouchableNativeFeedback>

          </View>
        );
    }
}

const StyledFlatList = styled.FlatList.attrs({

});

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  });

export default DetectList;