/* eslint-disable react/no-unstable-nested-components */
import React, {useState} from 'react';
import {Image, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
//navigation packages
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

//icons package
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//redux
import {useDispatch} from 'react-redux';
import {cleartopbuttons} from '../Service/TopbuttonsSlice';

//custom components
import Putt from '../screen/Puts';
import Averages from '../screen/Averages';
import Notification from '../screen/Notification';
import Distance from '../screen/Distance';
import Session from '../screen/Session';

import StartPractice from '../screen/StartPractice';
import BluetoothDevice from '../screen/BluetoothDevice';
import BestPuttsList from '../screen/BestPuttsList';
import PuttList from '../screen/PuttList';
import SessionList from '../screen/SessionList';
import MyAccount from '../screen/MyAccount';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="BestPuttsList">
      <Stack.Screen name="SessionList" component={SessionList} />
      <Stack.Screen name="PUTS" component={Putt} />
      <Stack.Screen name="Session" component={Session} />
      {/* <Stack.Screen name="PuttList" component={PuttList} /> */}
      <Stack.Screen name="BestPuttsList" component={BestPuttsList} />
      <Stack.Screen name="startpractice" component={StartPractice} />
      <Stack.Screen name="BluetoothDevice" component={BluetoothDevice} />
    </Stack.Navigator>
  );
}

const BottomNavigator = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleDeviceTabPress = name => {
    navigation.setOptions({
      headerTitle: name,
    });
  };

  return (
    <Tab.Navigator
      initialRouteName="Practice"
      activeColor={'#991e21'}
      inactiveColor={'#000'}
      barStyle={
        Platform.OS === 'android'
          ? {backgroundColor: '#f6f8fa'}
          : {backgroundColor: '#f6f8fa', height: 50 + insets.bottom}
      }
      theme={{colors: {secondaryContainer: 'yellow'}}}>
      <Tab.Screen
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color}) => (
            // <MaterialCommunityIcons name="golf-tee" color="black" size={26} />
            <Image
              style={{width: 30, height: 30}}
              source={require('../../assets/Images/dashboard-icon.png')}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            dispatch(cleartopbuttons());
            handleDeviceTabPress(route.name);
          },
        })}
        name="Dashboard"
        component={HomeStack}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Device',
          tabBarColor: 'black',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bluetooth-connect"
              color="black"
              size={26}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            handleDeviceTabPress(route.name);
          },
        })}
        name="Device"
        component={BluetoothDevice}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bell-ring-outline"
              color="black"
              size={26}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            handleDeviceTabPress(route.name);
          },
        })}
        name="Notification"
        component={Notification}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="arrow-expand-horizontal"
              color="black"
              size={26}
            />
          ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            handleDeviceTabPress(route.name);
          },
        })}
        name="Practice"
        component={Distance}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color}) => (
            <Image
              style={{width: 23, height: 23}}
              source={require('../../assets/user.png')}
              resizeMode="contain"
            />
          ),
          headerShown: false,
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            handleDeviceTabPress(route.name);
          },
        })}
        name="Account"
        component={MyAccount}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
