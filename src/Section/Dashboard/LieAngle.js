import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

export function LieAngle({lieAng = 2,lieEnd}) {
  return (
    <View style={styles.content}>
      <Image
        style={[styles.imag]}
        source={require('../../../assets/Images/golfBatAndAngle.png')}
      />
      <Image
        style={styles.background}
        source={require('../../../assets/Images/background3.png')}
      />
      <Text style={styles.textStyle}>Lie Angle Start: {lieAng}°</Text>
      <Text style={styles.textStyle2}>Lie Angle Impact: {lieEnd}°</Text>
    </View>
  );
}

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
  imag: {
    width: '200@ms',
    height: '120@mvs',
    resizeMode: 'contain',
    zIndex: 1,
    position: 'absolute',
    // top:25,
    bottom: 20,
    right: 50,
    // transform: [ {rotateZ:'90deg'}],
    // transform: [
    //   {translateX: 200 / 2},
    //   {translateY: 120 / 2},
    //   {rotateZ: '0deg'},
    //   {translateX: -200 / 2},
    //   {translateX: -120 / 2},
    // ],
    // transform: [{translateY: 100}, {rotateZ: '30deg'}, {translateY: -100}],
  },
  background: {
    width: '100%',
    height: '167@mvs',
  },
  textStyle: {
    position: 'absolute',
    left: 10,
    top:15,
    fontSize: '14@ms',
    color:'#fff',
    fontWeight: 'bold',
    zIndex: 1,
  },
  textStyle2: {
    position: 'absolute',
    left: 10,
    top:35,
    fontSize: '14@ms',
    color:'#fff',
    fontWeight: 'bold',
    zIndex: 1,
  },
});
