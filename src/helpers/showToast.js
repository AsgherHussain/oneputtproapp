import {Toast} from 'react-native-toast-message/lib/src/Toast';

export const showMessage = (type, text1, text2, visibilityTime = 400) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime,
  });
};
