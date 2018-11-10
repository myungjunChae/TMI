import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'

import { BleManager } from 'react-native-ble-plx';

let deviceInfoTemplate = {id:'', name:'', state:'', timer:-1}

class ItemList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //Bluetooth ID, Device Name, pairingState, 
            ownList: [],
            detectList: [],

            //Modal
            isModalVisible: false,

            clickedDevice: null,

             //Bluetooth Manager
            manager: new BleManager()
        };
    
        this.startDeviceScan = this.startDeviceScan.bind(this);
    }

    componentDidMount() {
        //list setting
        let conf = deviceInfoTemplate;
        this.setState(prevState => ({
            detectList: [...prevState.detectList, conf]
        }));

        //Data load from Server
    
        //bluetooth on
        this.state.manager.onStateChange(newState => {
            if (newState != "PoweredOn")
                return;

            this.startDeviceScan();
        }, true);
    }

    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    pressDevice = (device) => {
        console.log(device);
        this.setState({clickedDevice: device});
        this._toggleModal();
    }

    pairDevice = () => {
        console.log(this.state.clickedDevice);
        // this.state.ownList.push();
        this._toggleModal();
    }

    startDeviceScan = () => {
        console.log("ble scan on");
        //todo : 사용자가 알아차릴 수 있는 것으로 해서 scan on 알려주기 (toast)

        //Detected Device Array 및 Screen clear
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
              
                //이미 Detecting된 Device 예외처리
                try {
                    this.state.detectList.forEach(alreadyDetected => {
                        if (alreadyDetected.id === device.id)
                            throw alreadyDetected;
                    });
                } catch (e) {
                    
                    return;
                }

                //기기 데이터 셋팅
                let { id, name } = device;
                let status = false;
                if(name === null)
                    name = 'unknown';

                deviceInfoTemplate = {id, name, status,};

                console.log(deviceInfoTemplate);

                //내가 소유한 기기 검색
                if (device.name === "blueno1" || device.name === "blueno2"){
                    deviceInfoTemplate.status = true;

                    this.setState(prevState => ({
                        detectList: [deviceInfoTemplate, ...prevState.detectList]
                    }));
                    this.state.detectList.push(deviceInfoTemplate);
                }

                //소유한 기기가 아닐 경우, 뒤에 push
                this.state.detectList.push(deviceInfoTemplate);
            }
        );
    }

    renderList = (item) => {
        return(
            <TouchableOpacity 
                style={styles.itemWrapper} 
                onPress={this.pressDevice.bind(this, item)}
            >
                <Text>{item.id}</Text>
                <Text>{item.name}</Text>
                <Text>{item.state}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.listStyle}>
                <Modal 
                    isVisible={this.state.isModalVisible}
                    animationInTiming={100}
                    >
                    <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{flex:0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width:250, height:100, elevation: 3, backgroundColor: color1}}>
                            <Text>이 디바이스를 페어링하시겠습니까?</Text>
                        <View style={{flex:0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width:200}}>
                            <TouchableOpacity onPress={this.pairDevice}><Text>Yes</Text></TouchableOpacity>
                            <TouchableOpacity onPress={this._toggleModal}><Text>No</Text></TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </Modal>
                <Text style={styles.mainText}>디바이스</Text>
                <FlatList 
                    data={this.state.detectList}
                    extraData={this.state.detectList}
                    renderItem={({item})=>(
                        this.renderList(item)
                    )}
                    keyExtractor={item => item.id}/>
            </View>
        );
    }
}

const color1= '#dddddd';
const color2= '#ffffff';
const color3= '#cccccc';
const color4= '#dddddd';
const color5= '#eeeeee';

const styles = StyleSheet.create({
listStyle:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: color1
},
itemWrapper:{
    width: 300,
    height: 120,
    marginBottom: 15,
    elevation: 3,
    backgroundColor: color2
},  
mainText:{
    marginTop: 15,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'NotoSanKR-Bold'
}
})

export default ItemList;