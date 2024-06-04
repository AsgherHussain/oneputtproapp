import {Dimensions, Image, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import style from './style';

const {height} = Dimensions.get('screen');
export const InputField = ({
  iconName = 'user',
  handleChange,
  values,
  fieldName,
  placeholder,
  containerStyle,
  icon = require('../../assets/user.png'),
  editable = true,
}) => (
  <View style={[style.searchSection, containerStyle]}>
    {/* <FAIcon
      style={style.searchIcon}
      name={iconName}
      size={20}
      color={colors.RED}
      backgroundColor={colors.LIGHTGREY}
    /> */}
    <Image
      source={icon}
      style={{
        width: height * 0.018,
        height: height * 0.018,
        marginLeft: 12,
      }}
      resizeMode="contain"
    />
    <TextInput
      style={style.input}
      value={values[fieldName]}
      onChangeText={handleChange(fieldName)}
      placeholder={placeholder}
      placeholderTextColor={colors.INPUTGREY}
      underlineColorAndroid="transparent"
      editable={editable}
    />
  </View>
);
export const MobileField = ({
  iconName = 'user',
  handleChange,
  values,
  fieldName,
  placeholder,
  icon = require('../../assets/user.png'),
  editable = true,
}) => (
  <View style={style.searchSection}>
    {/* <FAIcon
      style={style.searchIcon}
      name={iconName}
      size={20}
      color={colors.RED}
      backgroundColor={colors.LIGHTGREY}
    /> */}
    <Image
      source={icon}
      style={{
        width: height * 0.018,
        height: height * 0.018,
        marginLeft: 12,
      }}
      resizeMode="contain"
    />
    <TextInput
      style={style.input}
      value={values[fieldName]}
      onChangeText={handleChange(fieldName)}
      placeholder={placeholder}
      placeholderTextColor={colors.INPUTGREY}
      underlineColorAndroid="transparent"
      keyboardType="phone-pad"
      editable={editable}
    />
  </View>
);

export const PasswordField = ({
  iconName = 'user',
  handleChange,
  values,
  fieldName,
  placeholder,
  containerStyle,
  icon = require('../../assets/user.png'),
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <View style={[style.searchSection, containerStyle]}>
      {/* <MaterialIcons
        style={style.searchIcon}
        name={'lock-open'}
        size={20}
        color={colors.RED}
        backgroundColor={colors.LIGHTGREY}
      /> */}
      <Image
        source={icon}
        style={{
          width: height * 0.018,
          height: height * 0.018,
          marginLeft: 12,
        }}
        resizeMode="contain"
      />
      <TextInput
        style={style.input}
        value={values[fieldName]}
        onChangeText={handleChange(fieldName)}
        placeholder={placeholder}
        placeholderTextColor={colors.INPUTGREY}
        underlineColorAndroid="transparent"
        secureTextEntry={isVisible}
      />
      <Icon
        style={style.searchIcon}
        name={!isVisible ? 'eye' : 'eye-off'}
        size={20}
        color={colors.BLACK}
        backgroundColor={colors.LIGHTGREY}
        onPress={() => setIsVisible(!isVisible)}
      />
    </View>
  );
};
