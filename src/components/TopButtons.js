/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';

// packages
import SwitchSelector from 'react-native-switch-selector';
import {useNavigation} from '@react-navigation/native';

// redux
import {useSelector, useDispatch} from 'react-redux';
import {setSelectedButton} from '../Service/TopbuttonsSlice';
import {dynamicFonts} from '../helpers/constants';

const TopButtons = ({initial}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  var selectedbutton = useSelector(state => state.topbutton.selectedbutton);
  var topbuttonvalue = useSelector(state => state.topbutton.topbuttonvalue);

  const handleChange = value => {
    dispatch(setSelectedButton(value));
    switch (value) {
      case 0:
        navigation.navigate('BestPuttsList');
        break;
      case 1:
        navigation.navigate('SessionList');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <SwitchSelector
          initial={selectedbutton}
          value={selectedbutton}
          onPress={handleChange}
          textColor={'#000000'}
          selectedColor={'#FFFFFF'}
          buttonColor={'#000000'}
          borderColor={'#FFFFFF'}
          backgroundColor={'#FFFFFF'}
          height={45}
          fontSize={dynamicFonts.f16}
          textStyle={{fontWeight: '500'}}
          hasPadding
          options={[
            {label: 'Best Putts', value: 0},
            {label: 'Most Recent', value: 1},
          ]}
        />
      </View>
    </View>
  );
};

export default TopButtons;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
});
