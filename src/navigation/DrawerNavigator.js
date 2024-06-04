/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
// packages
import {useNavigation} from '@react-navigation/native';
import {FontAwesome} from 'react-native-vector-icons'; // Replace with the appropriate icon library

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import MainDrawer from './MainDrawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// custom component
import Settings from '../screen/user/Settings';
import Subscription from '../screen/user/Subscription';
import PuttingMatrix from '../screen/user/PuttingMatrix';
import UserManual from '../screen/user/UserManual';
import DeleteAccount from '../screen/user/DeleteAccount';

// api
import {LogoutApi} from '../Api/DashboardApi';

// async storage
import {getLoginData} from '../helpers/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = () => {
  const navigation = useNavigation();
  const [useremail, setUserEmail] = useState('');
  const [userImage, setUserImage] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      userEmail();
      fetchUserProfileImage();
    }
  }, [isFocused]);

  const userEmail = async () => {
    const userRes = await getLoginData();
    setUserEmail(userRes.user_email);
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
  const navigateToEditProfile = async () => {
    const userRes = await getLoginData();
    navigation.navigate('EditProfileScreen', {
      updateProfileImage,
      userId: userRes.user_id,
    });
  };
  const updateProfileImage = newImage => {
    // Logic to update the profile image in the drawer navigator state
    setUserImage(newImage);
  };
  const fetchUserProfileImage = async () => {
    const userRes = await getLoginData();
    const userId = userRes.user_id;

    try {
      const response = await fetch(
        `http://185.146.166.147:21000/UserManagement/getuserdetails/${userId}`,
      );
      const userData = await response.json();

      // Assuming there is a property 'profile_image' in the user details
      const profileImageUrl = userData.data.profile_image;

      // Update the profile image in the drawer navigator state
      updateProfileImage(profileImageUrl);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawer}>
      <ImageBackground
        source={require('../../assets/backgroundimage.png')}
        style={{flex: 1, resizeMode: 'cover'}}>
        <View style={styles.profileContainer}>
          <Image
            source={
              userImage
                ? {uri: userImage}
                : require('../../assets/profile2.png')
            }
            style={styles.profileImage}
          />

          <TouchableOpacity activeOpacity={0.9}>
            <Text style={styles.profileLabel}>
              {useremail} {'\n'}
              <Text style={styles.linkText}>View Your Profile</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={navigateToEditProfile}>
            <MaterialCommunityIcons name="pencil" color="#000000" size={20} />

            {/* <Text style={styles.editButtonText}>Edit</Text> */}
          </TouchableOpacity>
        </View>

        {/*<DrawerItem
          icon={() => (
            <MaterialCommunityIcons name="cog" color="#FFFFFF" size={20} />
          )}
          style={styles.drawerLabelView}
          label="Settings"
           onPress={() => navigation.navigate('Settings')}
          labelStyle={styles.drawerLabel}
        />*/}

        {/*<DrawerItem
          icon={() => (
            <MaterialCommunityIcons
              name="card-plus"
              color="#FFFFFF"
              size={20}
            />
          )}
          style={styles.drawerLabelView}
          label="Subscription"
           onPress={() => navigation.navigate('Subscription')}
          labelStyle={styles.drawerLabel}
        />*/}
        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons
              name="card-plus"
              color="#FFFFFF"
              size={20}
            />
          )}
          style={styles.drawerLabelView}
          label="Delete Account"
          onPress={() => navigation.navigate('DeleteAccount')}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons
              name="information"
              color="#FFFFFF"
              size={20}
            />
          )}
          style={styles.drawerLabelView}
          label="Putting Matrix"
          onPress={() => navigation.navigate('PuttingMatrix')}
          labelStyle={styles.drawerLabel}
        />

        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons
              name="file-document-multiple"
              color="#FFFFFF"
              size={20}
            />
          )}
          style={styles.drawerLabelView}
          label="User Manual"
          onPress={() => navigation.navigate('UserManual')}
          labelStyle={styles.drawerLabel}
        />

        <DrawerItem
          icon={() => (
            <MaterialCommunityIcons name="logout" color="#FFFFFF" size={20} />
          )}
          style={styles.drawerLabelView}
          label="Logout"
          onPress={logoutUser}
          labelStyle={styles.drawerLabel}
        />
      </ImageBackground>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const navigation = useNavigation();
  // console.log(navigation.getState().routes[2].state);
  let tabnum =
    navigation.getState()?.routes[2]?.state?.routes[0]?.state?.index || 0;
  // let tabnum =
  //   navigation.getState().routes[2].state === undefined
  //     ? 0
  //     : navigation.getState().routes[2].state.routes[0].state === undefined
  //     ? 0
  //     : navigation.getState().routes[2].state.routes[0].state.index;
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      drawerStyle={styles.drawer}
      screenOptions={{
        drawerPosition: 'right',
        headerLeft: false,
        headerRight: () => <DrawerToggleButton tintColor="white" />,
        headerShown: true,
        headerStyle: {backgroundColor: '#000000'},
        headerTintColor: '#FFFFFF',
      }}>
      <Drawer.Screen
        name="Dashboards"
        component={MainDrawer}
        options={({navigation}) => ({
          drawerLabel: `pradnya@softlabsgroup.com`,
          headerTitle:
            tabnum && tabnum === 0
              ? 'Dashboards'
              : tabnum === 1
              ? 'Device'
              : tabnum === 2
              ? 'Notification'
              : tabnum === 3
              ? 'Practice'
              : 'Practice',
          headerTitleAlign: 'left',
          headerShown: false,
        })}
      />

      <Drawer.Screen
        name="Subscription"
        component={Subscription}
        options={{
          drawerLabel: `Subscription`,
          title: 'Subscription',
        }}
      />
      <Drawer.Screen
        name="Putting Matrix"
        component={PuttingMatrix}
        options={{
          drawerLabel: `Putting Matrix`,
          title: 'Putting Matrix',
        }}
      />

      <Drawer.Screen
        name="User Manual"
        component={UserManual}
        options={{
          drawerLabel: `User Manual`,
          title: 'User Manual',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  drawerLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'normal',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 10,
  },
  editButtonText: {
    color: '#000000',
    fontSize: 12,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 700,
  },
  linkText: {
    fontSize: 10,
    color: '#777777',
    fontWeight: 500,
  },
  gradientContainer: {
    flex: 1,
  },
  drawerLabelView: {
    backgroundColor: '#242222',
    borderRadius: 0,
  },
});

export default DrawerNavigator;
