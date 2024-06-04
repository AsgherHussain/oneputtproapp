import React from 'react';
import {StyleSheet, Text, View, Platform, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';

// style and color css
import colors from '../../styles/colors';
import style from './style';

//const source = {uri:'bundle-assets://pdf/user-manual-final.pdf'};
const source = Platform.OS === "android" ? {uri:'bundle-assets://pdf/user-manual-final.pdf'} : require('../../../android/app/src/main/assets/pdf/user-manual-final.pdf');
const UserManual = () => {
  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {

        }}
        onPageChanged={(page,numberOfPages) => {

      }}
      onError={(error) => {

      }}
      onPressLink={(uri) => {
        
      }}
        style={styles.pdf}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default UserManual;
