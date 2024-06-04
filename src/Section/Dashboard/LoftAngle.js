import {View, Text, StyleSheet, Image} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import React from 'react';

export const LoftAngle = ({loftAng = 10}) => {
  return (
    <View style={styles.content}>
      <Image
        style={[styles.blueSky]}
        source={require('../../../assets/Images/background4.png')}
      />
      <Image
        style={[styles.imag, {top: 2 + loftAng}]}
        source={require('../../../assets/Images/golfBat.png')}
      />
      <Image
        style={styles.ball}
        source={require('../../../assets/Images/ic_ball.png')}
      />
      <Text style={styles.textStyle}>Loft Angle: {loftAng}°</Text>
      
    </View>
  );
};

const styles = ScaledSheet.create({
  content: {
    backgroundColor: '#e5e4e2',
    marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  blueSky: {
    width: '100%',
    resizeMode:'cover',
    height: '160@mvs',
  },
  imag: {
    width: '200@ms',
    height: '120@mvs',
    resizeMode: 'contain',
    zIndex: 1,
    position: 'absolute',
  },
  ball: {
    width: '20@ms',
    resizeMode: 'contain',
    position: 'absolute',
    right: '100@ms',
    bottom: '30@mvs',
    zIndex: 1,
  },
  textStyle: {
    position: 'absolute',
    left: 15,
    fontSize: '14@ms',
    fontWeight: 'bold',
    zIndex: 1,
    color:'#fff'
  },
});
