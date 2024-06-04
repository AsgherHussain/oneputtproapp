import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {dynamicFonts} from '../helpers/constants';

const ErrorField = ({touched, errors, fieldName}) => (
  <View style={styles.inputColumn}>
    {/* <Text style={styles.heading}></Text> */}
    {touched[fieldName] && errors[fieldName] && (
      <Text style={styles.errorText}>{errors[fieldName]}</Text>
    )}
  </View>
);

export default ErrorField;

const styles = StyleSheet.create({
  inputColumn: {
    flexDirection: 'column',
    marginLeft: '5%',
    marginBottom: 2,
  },
  errorText: {
    fontSize: dynamicFonts.f12,
    color: '#ff0d10',
  },
});
