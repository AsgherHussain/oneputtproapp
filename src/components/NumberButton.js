import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {dynamicFonts, fontSize} from '../helpers/constants';

const NumberButton = ({num, numSelected, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: numSelected === num ? '#991e21' : '#e3e2e1'},
      ]}
      onPress={() => onPress(num)}>
      <Text
        style={[styles.title, {color: numSelected === num ? '#fff' : '#000'}]}>
        {num}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e3e2e1',
    margin: 4,
    borderRadius: 4,
    //   paddingTop: Constants.statusBarHeight,
  },
  selectedcontainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e3e2e1',
    margin: 4,
    borderRadius: 4,
    //   paddingTop: Constants.statusBarHeight,
  },
  title: {
    fontSize: dynamicFonts.f12,
  },
});

export default NumberButton;
