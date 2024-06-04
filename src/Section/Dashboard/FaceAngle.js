import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';

export const FaceAngle = ({faceAng}) => {
  return (
    <View style={styles.content}>
       <Image
        style={styles.background}
        source={require('../../../assets/Images/background2.png')}
      />
      <Image
        style={styles.ball}
        source={require('../../../assets/Images/ic_ball.png')}
      />
      <Image
        style={[styles.putterBat,{ transform:[{rotate:faceAng +'deg'}]}]}
        source={require('../../../assets/Images/putterBat.png')}
      />
      <Text style={styles.textStyle}>Open : {faceAng}°</Text>
    </View>
  );
};

const styles = ScaledSheet.create({
  content: {
    backgroundColor: '#e5e4e2',
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  background: {
    width: '100%',
    height: '167@mvs',
  },
  textStyle: {
    position: 'absolute',
    left: 15,
    fontSize: '14@ms',
    color:'#fff',
    fontWeight: 'bold',
    zIndex: 1
  },
  ball: {
    width: '20@ms',
    resizeMode: 'contain',
    position: 'absolute',
    top: '25%',
    right: '25%',
    zIndex: 1,
  },
  putterBat:{
    position: 'absolute',
    zIndex: 1,
    resizeMode: 'contain',
    right: '10%',
    height: '100%',
    top:'25%'
  },
});
