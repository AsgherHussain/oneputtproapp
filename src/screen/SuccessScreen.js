/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {dynamicFonts} from '../helpers/constants';
import colors from '../styles/colors';

const {height} = Dimensions.get('screen');
const SuccessScreen = ({navigation}) => {
  const onBackToDashboard = () => {
    navigation.navigate('Parent');
  };
  const onBackToSettings = () => {
    navigation.navigate('Settings');
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/success.png')}
        style={styles.checkmark}
      />
      <Text style={styles.title}>Your Password Changed Successfully</Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onBackToDashboard}>
        <Text style={styles.buttonText}>Back To Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBackToSettings}>
        <Text style={styles.secondaryButton}>Back to settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  checkmark: {
    width: height / 8,
    height: height / 8,
    marginBottom: 20,
  },
  title: {
    fontSize: dynamicFonts.h2
    ,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.BLACK,
  },
  primaryButton: {
    backgroundColor: colors.RED,
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: dynamicFonts.f16,
    fontWeight: '500',
  },
  secondaryButton: {
    color: '#000',
    fontSize: dynamicFonts.f16,
    marginTop: 10,
  },
});

export default SuccessScreen;
