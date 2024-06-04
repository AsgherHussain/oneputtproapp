/* eslint-disable prettier/prettier */
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../styles/colors';
import Spacing from '../components/Spacing';
import Settings from './user/Settings';
import {getLoginData} from '../helpers/asyncStorage';
import {LogoutApi} from '../Api/DashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import settings from '../config/settings';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {dynamicFonts} from '../helpers/constants';

const {width, height} = Dimensions.get('screen');
const MyAccount = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const userData = await getLoginData();
      setUserData(userData);
      getUserDataApiCall(userData?.user_id);
    })();
  }, [isFocused]);
  const getUserDataApiCall = async id => {
    try {
      const res = await axios.get(
        settings.API_URL + '/UserManagement/getuserdetails/' + id,
      );
      console.log('res', res?.data);
      setData(res?.data);
    } catch (error) {
      console.log('error', error);
    }
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const logoutUser = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: async () => {
            const userRes = await getLoginData();
            const data = {userId: userRes.user_id};
            await LogoutApi(data).then(res => {
              AsyncStorage.clear();
              navigation.navigate('Login');
            });
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity onPress={onPressBack}>
            <Image
              source={require('../../assets/back.png')}
              style={{width: 23, height: 23}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Account</Text>
          <Spacing width={20} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.body}>
        <Spacing height={20} />
        <UserProfileComponent user={userData} />
        <Spacing height={20} />
        <CommonButton
          title="Settings"
          onPress={() =>
            navigation.navigate('Settings', {
              userData: userData,
              data: data,
            })
          }
          rightIcon={true}
        />
        <CommonButton
          title="Delete Account"
          onPress={() => navigation.navigate('DeleteAccount')}
          rightIcon={true}
          leftIcon={false}
          VectorIcon={
            <MaterialCommunityIcons
              name="card-plus"
              color={colors.RED}
              size={height / 40}
            />
          }
        />
        <CommonButton
          title="Putting Matrix"
          onPress={() => navigation.navigate('PuttingMatrix')}
          rightIcon={true}
          leftIcon={false}
          VectorIcon={
            <MaterialCommunityIcons
              name="information"
              color={colors.RED}
              size={height / 40}
            />
          }
        />
        <CommonButton
          title="User Manual"
          onPress={() => navigation.navigate('UserManual')}
          rightIcon={true}
          leftIcon={false}
          VectorIcon={
            <MaterialCommunityIcons
              name="file-document-multiple"
              color={colors.RED}
              size={height / 40}
            />
          }
        />
        <CommonButton
          onPress={() => {
            logoutUser();
          }}
          title="Log Out"
          leftIcon={require('../../assets/logout.png')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.RED,
  },
  header: {
    flex: 0.2,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  body: {
    flex: 0.8,
    backgroundColor: colors.LIGHTGREY,
    paddingHorizontal: 15,
    borderTopLeftRadius: 50,
  },
  headerTitle: {
    fontSize: dynamicFonts.h2,
    fontWeight: '500',
    color: colors.WHITE,
  },
});

const UserProfileComponent = ({user}) => {
  return (
    <View style={prfileStyles.container}>
      <View style={prfileStyles.profileIcon}>
        <Image
          style={prfileStyles.image}
          source={require('../../assets/user1.png')}
          resizeMode="contain"
        />
      </View>
      <View style={prfileStyles.usernameContainer}>
        <Text style={prfileStyles.name}>{user?.fullName}</Text>
        <Text style={prfileStyles.username}>{user?.user_email}</Text>
      </View>
    </View>
  );
};

const prfileStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileIcon: {
    width: height / 15,
    height: height / 15,
    borderRadius: 99,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameContainer: {
    marginLeft: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: dynamicFonts.h2,
    color: colors.BLACK,
  },
  username: {
    fontSize: dynamicFonts.f14,
    paddingVertical: 4,
    color: '#555',
  },
  image: {
    width: 40,
    height: 40,
  },
});

const CommonButton = ({
  onPress,
  rightIcon,
  title = 'title',
  leftIcon = require('../../assets/settings.png'),
  VectorIcon,
}) => {
  return (
    <TouchableOpacity style={buttonStyles.button} onPress={onPress}>
      {leftIcon && <Image source={leftIcon} style={buttonStyles.icon} />}
      {VectorIcon && (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}>
          {VectorIcon}
        </View>
      )}
      <Text style={buttonStyles.text}>{title}</Text>
      {rightIcon && (
        <Image
          source={require('../../assets/rightArrow.png')}
          style={buttonStyles.chevron}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOffset: {height: 3, width: 0},
  },
  icon: {
    width: height / 40,
    height: height / 40,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: dynamicFonts.f18,
    color: '#000',
    fontWeight: '500',
  },
  chevron: {
    width: 20,
    height: 20,
  },
});
