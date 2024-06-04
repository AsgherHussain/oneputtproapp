import * as React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';
import {MenuProvider} from 'react-native-popup-menu';
import store from './src/Service/store';

const App = () => {
  return (
    <>
      <MenuProvider>
        <Provider store={store}>
          <AppNavigator />
          <Toast />
        </Provider>
      </MenuProvider>
    </>
  );
};

export default App;
