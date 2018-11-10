import React from 'react';
import {View, Text} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { ItemList, DetectList, Setting } from '../templates'

export default createBottomTabNavigator(
    {
        ItemList,
        DetectList,
        Setting,
    },
    {
        tabBarOptions: {
            activeTintColor: '#ff0000',
            inactiveTintColor: '#ffffff',
            style:{
                backgroundColor:'#000000',
            },
        },  
    },
);