import {View, Text,KeyboardAvoidingView, SafeAreaView, ScrollView,} from 'react-native';
import React from 'react';

import {ScaledSheet} from 'react-native-size-matters';
import colors from '../styles/colors'

const Notification = () => {
  return (
    <SafeAreaView style={styles.NotiContainer}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.NotiContainer}>
        <KeyboardAvoidingView enabled>
          {/* <View style={styles.Notibox}>
            <Text style={styles.NotiTitle}>Notification Title</Text>
            <Text style={styles.NotiText}>This is Notification Dummy Text, This is Notification Dummy Text.</Text>
          </View>
          <View style={styles.Notibox}>
            <Text style={styles.NotiTitle}>Notification Title</Text>
            <Text style={styles.NotiText}>This is Notification Dummy Text, This is Notification Dummy Text.</Text>
          </View> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  NotiContainer:{
    flex:1
  },
  Notibox: {
    borderColor:'#efefef',
    borderWidth:1,
    borderRadius:5,
    backgroundColor:colors.WHITE,
    marginHorizontal:15,
    marginTop:10,
    padding:10,
    elevation: 5,
  },
  NotiTitle: {
    color: colors.DARKESTGREY,
    fontWeight:'600',
    fontSize: '14@ms',
  },
  NotiText: {
    fontSize: '12@ms',
    paddingTop: 5,
    color: colors.DARKGREY,
  },
});

export default Notification;


