import {SafeAreaView, Text} from 'react-native';
import React from 'react';
import BottomNavigator from './BottomNavigator';

const MainDrawer = props => {
  return (
    <SafeAreaView style={{flex: 1, paddingTop: 20}}>
      <BottomNavigator />
    </SafeAreaView>
  );
};

export default MainDrawer;
