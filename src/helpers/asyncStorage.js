import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeLoginData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('userData', jsonValue);
  } catch (e) {
    // saving error
    console.log(e)
  }
};

export const getLoginData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e)
    }
  };

  export const removeLoginData = async () => {
    try {
      const jsonValue = await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };
