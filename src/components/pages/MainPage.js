import React from 'react';
import {View, Text} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { ItemList, Map, Setting } from '../templates'

export default createBottomTabNavigator(
    {
        ItemList,
        Map,
        Setting,
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    },
);