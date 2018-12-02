import React from 'react';
import {View, Text} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { ItemList, Map, Setting } from '../templates'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default createBottomTabNavigator(
    {
        Tab1:{
            screen:ItemList,
            navigationOptions : {
                title: 'Home',
                tabBarIcon: ({focused}) => (
                    <Ionicons name={"md-add"} size={24} />
                )
            }
        },
        Tab2:{screen:Map},
        Tab3:{screen:Setting},
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    },
);