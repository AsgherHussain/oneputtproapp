/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// packages
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// custom components
import Splash from '../screen/Splash';
import MainStack from './MainStack';
import SplashScreen from 'react-native-splash-screen';
import PuttingSession from '../screen/Dashboard/PuttingSession';
import Dashboard from '../screen/Dashboard';
import TopButtons from '../components/TopButtons';
import Register from '../screen/user/Register';
import Login from '../screen/user/Login';
import ForgotPassword from '../screen/user/ForgotPassword';
import ResetPassword from '../screen/user/ResetPassword';
import SinglePuttData from '../screen/SinglePuttData';
import BluetoothDevice from '../screen/BluetoothDevice';
import PuttingMatrix from '../screen/user/PuttingMatrix';
import DeleteAccount from '../screen/user/DeleteAccount';
import UserManual from '../screen/user/UserManual';
import OpenSetting from '../screen/OpenSetting';
import ResultViewStartPractice from '../screen/ResultViewStartPractice';
import EditProfileScreen from '../screen/user/EditProfileScreen';
import PuttList from '../screen/PuttList';
import Welcome from '../screen/user/Welcome';
import OtpVerification from '../screen/user/otpVerification';
import Settings from '../screen/user/Settings';
import SuccessScreen from '../screen/SuccessScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hide();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        // console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OtpVerification"
          component={OtpVerification}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SuccessScreen"
          component={SuccessScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash"
          component={Splash}
          // component={BluetoothDevice}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Parent"
          component={MainStack}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{headerShown: false, gestureEnabled: false}}
        />
        {/* <Stack.Screen
          name="PuttingSession"
          component={PuttingSession}
          options={{headerTitle: 'Session Performance',
          headerStyle: {backgroundColor: '#000000'},
          headerTitleStyle: {color:'#fff'},
          headerBackTitleVisible: false,
          headerBackTitle: null,
          headerTintColor: '#fff',
          headerShown: true}}
        /> */}
        <Stack.Screen
          name="PuttingSession"
          component={PuttingSession}
          options={({navigation}) => ({
            headerShown:false,
            // headerTitle: 'Session Performance',
            // headerStyle: {backgroundColor: '#000000'},
            // headerTitleStyle: {color: '#fff'},
            // headerBackTitleVisible: false,
            // headerBackTitle: null,
            // headerTintColor: '#fff',
            // headerShown: true,
            // gestureEnabled: false,
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.navigate('Parent')}>
            //     <Ionicons
            //       name="arrow-back"
            //       size={24}
            //       color="#fff"
            //       style={{marginLeft: 16}}
            //     />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="PuttList"
          component={PuttList}
          options={({navigation}) => ({
            headerShown:false,
            // headerTitle: 'PuttList',
            // headerStyle: {backgroundColor: '#000000'},
            // headerTitleStyle: {color: '#fff'},
            // headerBackTitleVisible: false,
            // headerBackTitle: null,
            // headerTintColor: '#fff',
            // headerShown: true,
            // gestureEnabled: false,
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.navigate('Parent')}>
            //     <Ionicons
            //       name="arrow-back"
            //       size={24}
            //       color="#fff"
            //       style={{marginLeft: 16}}
            //     />
            //   </TouchableOpacity>
            // ),
          })}
        />

        <Stack.Screen
          name="SinglePuttData"
          component={SinglePuttData}
          options={{
            headerTitle: 'Single Putt Data',
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            headerShown: true,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="TopButtons"
          component={TopButtons}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="BluetoothDevice"
          component={BluetoothDevice}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="startpractice"
          component={ResultViewStartPractice} //to do  remove
          options={{
            headerShown: false,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="PuttingMatrix"
          component={PuttingMatrix}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="UserManual"
          component={UserManual}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="openSettings"
          component={OpenSetting}
          options={{
            headerShown: true,
            headerStyle: {backgroundColor: '#000000'},
            headerTitleStyle: {color: '#fff'},
            headerBackTitleVisible: false,
            headerBackTitle: null,
            headerTintColor: '#fff',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
