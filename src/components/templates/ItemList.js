import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'

import { BleManager } from 'react-native-ble-plx';

import { clone } from '../../function/common'

let deviceInfoTemplate = {id: '', name: '', lost_state: 0, lost_location: '', timer: -1}
const timer = 10;

class ItemList extends React.PureComponent {
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
    
        this.getUserDevice = this.getUserDevice.bind(this);
        this.startDeviceScan = this.startDeviceScan.bind(this);
    }

    componentWillMount() {
        this.getUserDevice().then(()=>{
            //beartBeat on
            setInterval(()=>{
                for(let index in this.state.ownList){
                    if(this.state.ownList[index].timer > 0){
                        console.log(this.state.ownList[index].id, ':', this.state.ownList[index].timer);
                        this.state.ownList[index].timer-=5;
                    }
                    else{
                        console.log(this.state.ownList[index].id, "분실 alert!");
                    }
                }
            },5000);

            //bluetooth on  
            this.state.manager.onStateChange(newState => {
                if (newState != "PoweredOn")
                    return;

                this.startDeviceScan();
            }, true);
        });
    }

    componentDidMount() {
       
    }

    //Get User Bluetooth Device
    getUserDevice(){
        return new Promise((resolve, reject)=>{
            fetch('https://qcz8wf7nqe.execute-api.ap-northeast-2.amazonaws.com/tmi/userdevice', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': 'x8hF7gN83b3fGsJFR4nWoaFGEN95auFz9PQUDR8i'
            },
            }).then((res) => {
                let items = JSON.parse(res['_bodyText'])['Items'];
                
                for(let index in items){
                    const {id, name, lost_location, lost_state} = items[index];

                    let deviceInfo = clone(deviceInfoTemplate);
                    deviceInfo.id = id;
                    deviceInfo.name = name;
                    deviceInfo.lost_location = lost_location;
                    deviceInfo.lost_state = lost_state;
                    deviceInfo.timer = timer;
        
                    this.state.ownList.push(deviceInfo);
                }

                resolve('finish');
            })
            .catch((error) => {reject(error)});
        }) 
    }

    //Post User Bluetooth Device
    postUserDevice(id, name, lost_state, lost_location){
        fetch('https://qcz8wf7nqe.execute-api.ap-northeast-2.amazonaws.com/tmi/userdevice', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': 'x8hF7gN83b3fGsJFR4nWoaFGEN95auFz9PQUDR8i'
            },
            body: JSON.stringify({
                "id": id,
                "name": name,
                "lost_state": lost_state,
                "lost_location": lost_location
            }),
        }).then((res) => {console.log(res)})
        .catch(error => console.error('Error:', error));
    }

    //Modal onoff
    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    //Device Click => Modal on
    pressDevice = (device) => {
        this.setState({clickedDevice: device});
        this._toggleModal();
    }

    //Clicked Device => DynamoDB
    pairDevice = () => {
        // this.state.ownList.push();
        const {id, name, lost_state, lost_location} = this.state.clickedDevice;
        this.postUserDevice(id, name, lost_state, lost_location);
        this._toggleModal();
    }

    startDeviceScan = () => {
        console.log("ble scan on");
        //To-do : 사용자가 알아차릴 수 있는 것으로 해서 scan on 알려주기 (toast)

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

                //기기 데이터 초기화
                let { id, name } = device;
                if(name === null)
                    name = 'unknown';

                let deviceInfo = clone(deviceInfoTemplate);
                deviceInfo.id = id;
                deviceInfo.name = name;
                deviceInfo.lost_location = null;

                //device heart beat
                for(let index in this.state.ownList){
                    if(this.state.ownList[index].id === device.id){
                        console.log(device.id, " is alive");
                        this.state.ownList[index].timer = timer;
                        return;
                    }
                }

                //소유한 기기가 아닐 경우, 뒤에 push
                console.log("Detected : ", deviceInfo);
                this.state.detectList.push(deviceInfo);
                this.forceUpdate();
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
        console.log("ownlist : ", this.state.ownList);
        console.log("detectList : ", this.state.detectList);

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
                    data={[...this.state.ownList, ...this.state.detectList]}
                    extraData={this.state}
                    renderItem={({item})=>(
                        this.renderList(item)
                    )}
                    keyExtractor={item => item.id}
                />
            </View>
        )
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