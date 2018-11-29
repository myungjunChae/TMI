import React from 'react';
import { 
    StyleSheet, 
    Text, View, Button, 
    FlatList, TouchableNativeFeedback,
    PermissionsAndroid } from 'react-native';
import styled from 'styled-components';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 

import { SampleConsumer } from '../../context';
import confidential from '../../../confidential.json'

class Map extends React.Component{
    static defaultProps = {
        forceUpdate: true
    }

    constructor(props) {
        super(props);

        this.state = {
            position:{
                latitude: 0,
                longitude: 0
            },
            markers: [],
        }
    }

    componentDidMount(){
        this.getUserDevice();
    }

    componentWillReceiveProps(){
        console.log('componentWillReceiveProps');
        this.getUserDevice().then(() =>{
            this.forceUpdate();
            }
        )
    }

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
                console.log('getUserDevice')
                let items = JSON.parse(res['_bodyText'])['Items'];
                
                for(let index in items){
                    const {id, name, lost_location, lost_state} = items[index];

                    if(lost_state === 1){
                        let title = name;
                        let latitude = Number(lost_location.split(',')[0]);
                        let longitude = Number(lost_location.split(',')[1]);
            
                        let obj = {
                            position:{
                                latitude, 
                                longitude
                            },
                            title
                        }
                        this.setState({markers: [...this.state.markers, obj]});
                    }
                }

                resolve('finish');
            })
            .catch((error) => {reject(error)});
        }) 
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: 37.245958,
                    longitude: 127.077219,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                >
                {this.state.markers.map((contact, i)=>{
                    console.log(contact);
                    return (
                    <MapView.Marker
                        coordinate={contact.position}
                        title={contact.title}
                        subtitle={'text'}
                        key = {i}
                    />)
                })}
                </MapView>
            </View>
        );
    }
}

const MapContainer = () => {
    return(
        <SampleConsumer>
        {
            (state) => (
                // props 설정
                <Map 
                    forceUpdate={state.updateState}
                />
            )
        }
        </SampleConsumer>
    );
}

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});

   
export default MapContainer;