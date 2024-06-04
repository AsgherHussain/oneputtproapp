/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, View} from 'react-native';
import {getLoginData} from '../helpers/asyncStorage';

const Splash = ({navigation}) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      const userData = await getLoginData();
      if (userData) {
        navigation.navigate('Parent');
      } else {
        navigation.navigate('Welcome');
      }
    };
    setTimeout(() => {
      checkAuthentication();
    }, 4000);
  }, [navigation]);

  return (
    <View style={styles.videoView}>
      <StatusBar backgroundColor={'#000000'} translucent />

      <Image
        source={require('../../assets/putSplashScreen.gif')}
        style={styles.image}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  videoView: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'stretch',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
});
