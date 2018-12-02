import React from 'react';
import {Vibration, StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'

import { BleManager } from 'react-native-ble-plx';
import LinearGradient from 'react-native-linear-gradient';

import { clone, toast, vibrationOn, vibrationOff } from '../../function/common';
import { SampleConsumer } from '../../context';
import confidential from '../../../confidential.json'

let deviceInfoTemplate = {id: '', name: '', lost_state: 0, lost_location: '', timer: -1, own_state: 0, alert_state: 1}
const timer = 15;
//const vibrate_pattern = [100, 500, 100, 500, 100, 500, 100, 500, 100, 500, 100, 500]
const vibrate_pattern = [100];

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

            isModalRendered: false,

            //Context API
            test: this.props.info,

            //Bluetooth Manager
            manager: new BleManager()
        };
    
        this.getUserDevice = this.getUserDevice.bind(this);
        this.startDeviceScan = this.startDeviceScan.bind(this);
        this.stopVibrate = this.stopVibrate.bind(this);
    }

    /* React Life Cycle */
    componentWillMount() {
        this.getUserDevice().then(()=>{
            //beartBeat on
            setInterval(()=>{
                for(let index in this.state.ownList){
                    if(this.state.ownList[index].timer > 0){
                        console.log(this.state.ownList[index].id, ':', this.state.ownList[index].timer);
                        this.state.ownList[index].timer-=1;
                    }
                    else{
                        //처음 분실이 detecting 됐을 때
                        if(this.state.ownList[index].lost_state == 0){
                            console.log("디바이스 분실");
                            this.state.ownList[index].lost_state = 1;
                            const {id, name, lost_state, lost_location} = this.state.ownList[index];
                            
                            navigator.geolocation.getCurrentPosition( 
                                (position) => {
                                    let location = `${position.coords.latitude},${position.coords.longitude}`;

                                    //For eliminate dynamodb physical limits
                                    this.postUserDevice(id, name, lost_state, location).then(()=>{
                                        this.props.forceUpdate(); // Map Component Force update
                                    });
                                }, 
                                (error) => {
                                    console.log(new Date(), error)
                                    toast(`GPS Module failure. Check your module!`);
                                }, 
                                {
                                    enableHighAccuracy: false,
                                }
                            );
                        }

                        if(this.state.ownList[index].alert_state){                         
                            vibrationOn(vibrate_pattern)
                        }

                        this.forceUpdate();
                    }
                }
            },1000);

            //bluetooth on  
            this.state.manager.onStateChange(newState => {
                if (newState != "PoweredOn")
                    return;

                this.startDeviceScan();
            }, true);
        });
    }

    /* http methods */
    //Get User Bluetooth Device
    getUserDevice(){
        return new Promise((resolve, reject)=>{
            fetch(confidential.AWS_URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-api-key': confidential.AWS_KEY
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
                    deviceInfo.own_state = 1;
                    deviceInfo.alert_state = 1;
        
                    this.state.ownList.push(deviceInfo);
                }

                resolve('finish');
            })
            .catch((error) => {reject(error)});
        }) 
    }

    //Post User Bluetooth Device
    postUserDevice(id, name, lost_state, lost_location){
        return new Promise((resolve, reject)=>{
            fetch(confidential.AWS_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': confidential.AWS_KEY
                },
                body: JSON.stringify({
                    "id": id,
                    "name": name,
                    "lost_state": lost_state,
                    "lost_location": lost_location
                }),
            }).then(res => {
                let errorCheck = Object.keys(JSON.parse(res['_bodyText'])).length;
                resolve(errorCheck);
            })
            .catch(error => console.error('Error:', error));
        })
    }

    //Delete User Bluetooth Device
    deleteUserDevice(id){
        return new Promise((resolve, reject)=>{
            fetch(confidential.AWS_URL, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': confidential.AWS_KEY
                },
                body: JSON.stringify({
                    "id": id
                }),
            }).then(res => {
                let errorCheck = Object.keys(JSON.parse(res['_bodyText'])).length;
                resolve(errorCheck);
            })
            .catch(error => console.error('Error:', error));
        })
    }

    //Modal onoff
    _toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.setState({ isModalRendered: false });
    }

    //Device Click => Modal on
    pressDevice = (device) => {
        this.setState({clickedDevice: device});
        this._toggleModal();
    }

    //Render inner function 
    stopVibrate(){
        vibrationOff();
        this.state.clickedDevice.alert_state = 0;
        this._toggleModal();
    }

    //Clicked Device => DynamoDB
    pairDevice = () => {
        const {id, name, lost_state, lost_location} = this.state.clickedDevice;
        this.postUserDevice(id, name, lost_state, lost_location)
        .then((errorCheck)=>{
            //errorCheck가 0이면 200ok
            if(errorCheck === 0){

                //선택된 device, detectlist에서 삭제 및 ownList 추가
                for(let index in this.state.detectList){
                    if(this.state.detectList[index].id === id){
                        //Rendering Style 변경
                        this.state.detectList[index].own_state = 1;
                        this.state.detectList[index].alert_state = 1;
                        let temp = this.state.detectList.splice(index,1);
                        this.state.ownList.push(temp[0]);
                        this.forceUpdate();
                        toast(`pairing ${id}`);
                        break;
                    }
                }
            }else{
                //pairing 실패 알람
                toast('pairing에 실패했습니다. 잠시 후, 다시 시도해주세요.');
            }
        })
        this._toggleModal();
    }

    unpairDevice = () => {
        const {id} = this.state.clickedDevice;
        console.log(id);
        this.deleteUserDevice(id)
        .then((errorCheck)=>{

            //errorCheck가 0이면 200ok
            if(errorCheck === 0){

                //선택된 device, detectlist에서 삭제 및 ownList 추가
                for(let index in this.state.ownList){
                    if(this.state.ownList[index].id === id){
                        //Rendering Style 변경
                        this.state.ownList.splice(index,1);
                        this.forceUpdate();
                        toast(`unpairing ${id}`);
                        break;
                    }
                }
            }else{
                //unpairing 실패 알람
                toast('unpairing에 실패했습니다. 잠시 후, 다시 시도해주세요.');
            }
        })
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
                        this.state.ownList[index].timer = timer;

                        //잃어버린 기기를 다시 찾았을 경우
                        if(this.state.ownList[index].lost_state){
                            this.state.ownList[index].lost_state = 0;
                            this.state.ownList[index].alert_state = 1;
                            const { id , name, lost_state } = this.state.ownList[index];
                            let lost_location = null;
                            vibrationOff();
                            this.forceUpdate();
                            
                            //Map 갱신
                            this.postUserDevice(id, name, lost_state, lost_location)
                            .then((errorCheck)=>{
                                //errorCheck가 0이면 200ok
                                if(errorCheck === 0){
                                    this.props.forceUpdate();
                                }else{
                                    //갱신 실패 알람
                                    toast('갱신에 실패했습니다. 잠시 후, 다시 시도해주세요.');
                                }
                            })
                        }
                        return;
                    }
                }

                //소유한 기기가 아닐 경우, 뒤에 push
                this.state.detectList.push(deviceInfo);
                this.forceUpdate();
            }
        );
    }

    /* About Render */
    renderList(item){
        let itemStyle = [styles.itemWrapper];
        let colors = [];

        //소유한 기기일 때 style
        if(item.own_state)
            colors = ['#d20744', '#e63c2c'];
        else
            colors = ['#fff', '#fff'];
        
        if(item.lost_state){
            colors = ['#ff0000', '#ff0000'];
        }
        

        return(
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={colors} style={styles.itemWrapper}>
                {/*<TouchableOpacity onPress={this.pressDevice.bind(this, item)}>
                    <Text>{item.id}</Text>
                    <Text>{item.name}</Text>
                    <Text>{item.state}</Text>
                </TouchableOpacity>*/}
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:25, fontWeight:'bold'}}>{item.name}</Text>
                    <Text>{item.id}</Text>
                </View>
            </LinearGradient>
        )
    }

    renderModal() {
        return(
            <Modal isVisible={this.state.isModalVisible} animationInTiming={100}>
                <View style={{flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex:0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width:250, height:100, elevation: 3, backgroundColor: color1}}>
                        {
                            //To-do : Render 수정
                            this.state.clickedDevice !== null ? // 선택된 디바이스가 있을 때
                            (this.state.clickedDevice.lost_state ? //선택된 디바이스가 
                            (this.state.clickedDevice.alert_state ? this.renderStopVibrate() : this.renderUnpairing()): //분실됐을 경우
                            (this.state.clickedDevice.own_state ? this.renderUnpairing() : this.renderPairing())) //분실되지않았을 경우
                            :{}
                        }
                    </View>
                </View>
            </Modal>
        );
    }

    renderStopVibrate() {
        console.log('renderStopVibrate');
        if(this.state.isModalRendered === false){
            this.state.isModalRendered = true;
            return(
                <View>
                    <Text>아직 찾지 못한 Device입니다. 진동을 멈추시겠습니까?</Text>
                    <View style={{flex:0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width:200}}>
                        <TouchableOpacity onPress={this.stopVibrate}><Text>Yes</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this._toggleModal}><Text>No</Text></TouchableOpacity>
                    </View>
                </View>
            );    
        }else{
            return;
        }
    }

    renderPairing() {
        console.log('renderPairing');
        if(this.state.isModalRendered === false){
            this.state.isModalRendered = true;
            return(
                <View>
                    <Text>이 디바이스를 페어링하시겠습니까?</Text>
                    <View style={{flex:0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width:200}}>
                        <TouchableOpacity onPress={this.pairDevice}><Text>Yes</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this._toggleModal}><Text>No</Text></TouchableOpacity>
                    </View>
                </View>
            );
        }else{
            return;
        }
    }
 
    renderUnpairing() {
        console.log('renderUnpairing');
        if(this.state.isModalRendered === false){
            this.state.isModalRendered = true;
            return(
                <View>
                    <Text>이 디바이스와 페어링를 끊으시겠습니까?</Text>
                    <View style={{flex:0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width:200}}>
                        <TouchableOpacity onPress={this.unpairDevice}><Text>Yes</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this._toggleModal}><Text>No</Text></TouchableOpacity>
                    </View>
                </View>
            );
        }else{
            return;
        }
    }

    render() {
        return (
            <View style={styles.listStyle}>
                {this.renderModal()}
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

const ListContainer = () => (
    <SampleConsumer>
    {
        ({state, actions}) => (
            // props 설정
            <ItemList 
                updateState={state.updateState}
                forceUpdate={actions.forceUpdate}
            />
        )
    }
    </SampleConsumer>
)

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
    elevation: 3
},  
ownItemWrapper:{
    backgroundColor: '#05FFE1'
},  
lostItemWrapper:{
    backgroundColor: '#FF0000'
},
mainText:{
    marginTop: 15,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'NotoSanKR-Bold'
}
})

export default ListContainer;