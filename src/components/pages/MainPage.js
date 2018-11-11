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

// export default class MainPage extends React.Component{
//     render() {
//       return (
//         <View>
//           <Text>Welcome to React Native!</Text>
//           <Text>To get started, edit App.js</Text>
//         </View>
//       );
//     }
//   }