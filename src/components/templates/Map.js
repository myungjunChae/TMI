import React from 'react';
import { 
    StyleSheet, 
    Text, View, Button, 
    FlatList, TouchableNativeFeedback,
    PermissionsAndroid } from 'react-native';
import styled from 'styled-components';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 

import { SampleConsumer } from '../../context';

class Map extends React.Component{
    static defaultProps = {
        lostItems: []
    }

    constructor(props) {
        super(props);

        this.state = {
            position:{
                latitude: 0,
                longitude: 0
            },
            // markers: (this.props.lostItems === 'undefined') ? this.props.lostItems : {}
            markers: this.props.lostItems,
        }
    }

    render() {
        console.log('map render');
        console.log(this.state.info);
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
                        // description={contact.subtitle}
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
            ({state}) => (
                // props 설정
                <Map 
                    lostItems={state.info}
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