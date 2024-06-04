/* eslint-disable prettier/prettier */
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

import React from 'react';
import colors from '../../styles/colors';
import Spacing from '../../components/Spacing';
import { dynamicFonts } from '../../helpers/constants';
import { APP_TEXT } from '../../config/typography';

const {height, width} = Dimensions.get('screen');

const Welcome = ({navigation}) => {

const handleNavigation = (type) =>{
  navigation.navigate(type);
};
  return (
    <ImageBackground
      source={require('../../../assets/Images/welcome.png')}
      style={{width, height}}
     >
      <View
        style={styles.container}>
        <Image
          source={require('../../../assets/logo5.png')}
          style={styles.img}
          resizeMode="contain"
        />
        <Text
          style={styles.title}>
          {APP_TEXT.welcome.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryBtn]}
          onPress={()=>handleNavigation('Login')}>
          <Text style={styles.primaryBtnTxt}>{APP_TEXT.welcome.login}</Text>
        </TouchableOpacity>
        <Spacing height={15} />
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.primaryBtn, styles.createAccount]}
          onPress={()=>handleNavigation('Register')}>
          <Text style={styles.primaryBtnTxt}>{APP_TEXT.welcome.login}</Text>
        </TouchableOpacity>
        <Spacing height={30} />
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
  },
  img:{
    width: width / 3,
    height: width / 3,
  },
  title:{
    fontSize: dynamicFonts.h,
    fontWeight: '500',
    color: colors.WHITE,
    marginBottom: 20,
    letterSpacing:0.1,
  },
  primaryBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.RED,
  },
  primaryBtnTxt: {
    color: colors.WHITE,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: dynamicFonts.f16,
  },
  createAccount: {
    backgroundColor: null,
    borderColor: colors.WHITE,
    borderWidth: 1,
  },

});
