import React, {useState} from 'react';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import {getLoginData} from '../../helpers/asyncStorage';
import {LogoutApi} from '../../Api/DashboardApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {dynamicFonts} from '../../helpers/constants';

const DeleteAccount = () => {
  const [responseMessage, setResponseMessage] = useState(null);
  const navigation = useNavigation();
  const handleDeleteAccount = () => {
    // Display a confirmation dialog
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deactivateAccount()},
      ],
      {cancelable: false},
    );
  };

  const deactivateAccount = async () => {
    try {
      const apiUrl =
        'http://185.146.166.147:21000/UserManagement/accountdeactive';
      const userRes = await getLoginData();
      const userId = userRes.user_id;
      console.log(userId);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      const responseData = await response.json();

      // Check if the request was successful (status code 200)
      if (response.ok) {
        setResponseMessage(responseData.message);
        const userRes = await getLoginData();
        const data = {userId: userRes.user_id};
        await LogoutApi(data).then(res => {
          AsyncStorage.clear();
          navigation.navigate('Login');
        });
      } else {
        console.error('Error:', responseData.message);
        setResponseMessage('Failed to deactivate account');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setResponseMessage('Failed to deactivate account');
    }
  };

  return (
    <View>
      <Text>{responseMessage}</Text>
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text
          style={{
            fontSize: dynamicFonts.f18,
            color: '#208ff7',
            textAlign: 'center',
          }}>
          Delete User from this Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;
