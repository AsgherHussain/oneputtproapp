import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';

export const AccelerationImpact = () => {
  return (
    <View style={styles.content}>
      <Image
        style={styles.imag}
        source={require('../../../assets/Images/PuttingTempo.png')}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  content: {
    padding: 20,
    backgroundColor: '#e5e4e2',
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imag: {
    width: '200@ms',
    height: '150@mvs',
    resizeMode: 'contain',
  },
  redArrow: {
    position: 'relative',
    width: '65@ms',
    resizeMode: 'contain',
    top: '-60@mvs',
    left: '-30@ms',
    bottom: 0,
    marginBottom: '-20@mvs',
    paddingBottom: 0,
  },
  redText: {
    position: 'relative',
    width: '65@ms',
    top: '-60@mvs',
    left: '-30@ms',
    bottom: 0,
    marginBottom: '-20@mvs',
    paddingBottom: 0,
    fontSize: '10@s',
    left: '-20@ms',
    top: '-65@mvs',
    fontWeight: 'bold',
  },
  greenText: {
    fontSize: '10@s',
    left: '30@ms',
    top: '-45@mvs',
    fontWeight: 'bold',
  },
  greenArrow: {
    position: 'relative',
    width: '125@ms',
    resizeMode: 'contain',
    top: '-120@mvs',
    left: '6@ms',
    bottom: 0,
    marginBottom: '-90@mvs',
    paddingBottom: 0,
  },
});
