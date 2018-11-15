import React from 'react';
import { 
    geolocation,
    StyleSheet, 
    Text, View, Button, 
    FlatList, TouchableNativeFeedback,
    PermissionsAndroid } from 'react-native';
import { StyledView } from './style/style';
import styled from 'styled-components';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

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

var markers = [
    {
      latitude: 37.245958,
      longitude: 127.077219,
      title: 'Foo Place',
      subtitle: '1234 Foo Drive'
    }
  ];

class Map extends React.Component{
    constructor() {
        super();

        this.state = {
            position:{
                latitude: 0,
                longitude: 0
            }
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition( 
            (position) => { 
                this.setState({
                    position:{
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    } 
                });
                console.log(position.coords)
                console.log(this.state.position);
            }, 
            (error) => console.log(new Date(), error), 
            {
                enableHighAccuracy: false,
                timeout: 5000
            }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 37.245958,
                    longitude: 127.077219,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                >
                <MapView.Marker
                        // coordinate={{
                        //     latitude: 37.245958,
                        //     longitude: 127.077219
                        // }}
                        coordinate={this.state.position}
                        title={"Foo Place"}
                        description={"description"}
                    />
                </MapView>
            </View>
        );
    }
}

export default Map;