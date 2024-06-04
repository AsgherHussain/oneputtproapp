import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import {getLoginData} from '../helpers/asyncStorage';
import TopButtons from '../components/TopButtons';
import SessionList from './SessionList';
const Puts = ({navigation}) => {
  useEffect(() => {
    (async () => {
      const data = await getLoginData();
    })();
  });
  return (
    <View>
    <TopButtons initial={0}/>
     {/* {navigation.navigate('SessionList')} */}
    </View>
  );
};

export default Puts;

{
  /* <Text style={{color: 'red'}}>Puts Screen</Text>
<Button
  title="Go to Details"
  onPress={() => navigation.navigate('Details')}
/>
<Button
  title="Putting Session"
  onPress={() => navigation.navigate('PuttingSession')}
/>
<Button
  title="Session"
  onPress={() => navigation.navigate('Session')}
/>
<Button
  title="Session List"
  onPress={() => navigation.navigate('SessionList')}
/>
<Button
  title="Putt List"
  onPress={() => navigation.navigate('PuttList')}
/>
<Button
  title="Register"
  onPress={() => navigation.navigate('Register')}
/>
<Button title="Login" onPress={() => navigation.navigate('Login')} />
<Button
  title="ForgotPassword"
  onPress={() => navigation.navigate('ForgotPassword')}
/>
<Button
  title="Open drawer"
  onPress={() => {
    navigation.openDrawer();
  }}
/>
<Button
  title="Toggle drawer"
  onPress={() => navigation.toggleDrawer()}
/> */
}
