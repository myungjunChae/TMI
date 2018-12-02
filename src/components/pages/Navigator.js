import {createStackNavigator} from 'react-navigation';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

const Navigator = createStackNavigator({
  LoginPage: {screen: LoginPage},
  MainPage: {screen: MainPage},
});

export default Navigator;