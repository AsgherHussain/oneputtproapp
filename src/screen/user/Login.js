/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Image, ImageBackground, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Dimensions } from 'react-native';

// packages
import { ScaledSheet } from 'react-native-size-matters';

// Async storage
import settings from '../../config/settings';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

// Form validation
import * as Yup from 'yup';
import { Formik } from 'formik';

// custom components
import ErrorField from '../../components/ErrorField';
import { InputField, PasswordField } from '../../components/InputField';

// local storage
import { storeLoginData } from '../../helpers/asyncStorage';

// style and color css
import colors from '../../styles/colors';
import style from './style';
import Spacing from '../../components/Spacing';
import { dynamicFonts } from '../../helpers/constants';
import { showMessage } from '../../helpers/showToast';
import { APP_TEXT } from '../../config/typography';

const validateSchema = Yup.object().shape({
  username: Yup.string().required('Email field is required').email('Use valid email id'),
  password: Yup.string().required('Password field is required'),
});

const Login = ({ navigation }) => {
  const [inputData, setInputData] = React.useState({
    username: '',
    password: '',
  });

  const [forceInvalid, setForceInvalid] = useState(true);
  const formikRef = useRef();

  useEffect(() => {
    if (forceInvalid) {
      // Trigger a validation check on mount
      formikRef.current.validateForm().then(errors => {
        if (Object.keys(errors).length === 0) {
          // No errors, but we want to force invalid state
          formikRef.current.setErrors({ _forceInvalid: 'Invalid' });
        }
        setForceInvalid(false);
      });
    }
  }, [forceInvalid]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert('Exit App', 'Do you want to exit?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  // handlelogin
  const handelLogin = async ({ username, password }) => {
    // Check internet connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      showMessage('info', 'No Internet', 'Please check your internet connection.', 4000);
      return;
    }

    // Validate email and password
    if (!username && !password) {
      showMessage('info', 'Validation Error', 'Enter email and password.', 4000);
      return;
    }

    // Validate password
    if (!password) {
      showMessage('info', 'Validation Error', 'Enter password.', 4000);
      return;
    }

    // Validate email
    if (!username) {
      showMessage('info', 'Validation Error', 'Enter email address.', 4000);
      return;
    }
    try {
      const { status, data } = await axios({
        method: 'POST',
        url: `${settings.API_URL}/UserManagement/login`,
        data: {
          username,
          password,
        },
      });
      if (status === 200) {
        if (data.status === 200) {
          storeLoginData(data.user_token);
          navigation.navigate('Parent');
        } else {
          showMessage('info', 'Message', data.message, 4000);
        }
      } else {
        showMessage('info', 'Message', 'Something went wrong.', 4000);
      }
    } catch (e) {
      console.log(e, 'error in login');
    }
  };

  return (
    <SafeAreaView style={style.Container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.Container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          enabled>
          <View style={styles.topSection}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.backButton}>
              <Image
                source={require('../../../assets/back.png')}
                style={styles.backButtonImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <ImageBackground
              resizeMode="cover"
              source={require('../../../assets/transparentLogo.png')}
              style={styles.imageBackground}>
              <Image
                style={style.Image}
                source={require('../../../assets/logo6.png')}
                resizeMode="stretch"
              />
            </ImageBackground>
          </View>
          <View style={styles.bottomSection}>
            <Spacing height={80} />
            <Text style={styles.welcomeText}>
              {APP_TEXT.login.hey}<Text style={styles.innerWelcomeText}>{APP_TEXT.login.welcomeBack}</Text>
            </Text>

            <Spacing height={20} />
            <Formik
              enableReinitialize
              initialValues={inputData}
              validationSchema={validateSchema}
              innerRef={formikRef}
              onSubmit={values => {
                handelLogin(values);
              }}>
              {({
                values,
                errors,
                touched,
                isValid,
                handleChange,
                handleSubmit,
                setTouched,
              }) => (
                <>
                  <ErrorField
                    touched={touched}
                    errors={errors}
                    fieldName="username"
                  />
                  <View style={style.inputWrapper}>
                    <InputField
                      setTouched={setTouched}
                      iconBackgroundColor="#FF5733"
                      containerStyle={style.inputField}
                      iconName={'user'}
                      handleChange={handleChange}
                      values={values}
                      fieldName={'username'}
                      placeholder="Email"
                      icon={require('../../../assets/email.png')}
                    />
                  </View>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="password"
                    />
                    <View style={style.inputWrapper}>
                      <PasswordField
                        containerStyle={style.inputField}
                        iconName={'unlock-alt'}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'password'}
                        placeholder="Password"
                        icon={require('../../../assets/password.png')}
                      />
                    </View>
                  </>
                  <View style={style.formActions}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[
                        style.primaryBtn,
                        {
                          backgroundColor: !isValid ? '#E28C8F' : colors.RED,
                        },
                      ]}
                      onPress={handleSubmit}>
                      <Text style={style.primaryBtnTxt}>{APP_TEXT.welcome.login}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={style.forgotText}>
                    <Text style={styles.forgotPass}>
                      {APP_TEXT.login.forgotPassword}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={styles.resetPass}>
                        {'  '}
                        {APP_TEXT.login.resetPassword}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
            <Spacing height={10} />
            <View
              style={styles.footer}
            />
            <Spacing height={10} />
            <Text style={style.bottomText}>
              {APP_TEXT.login.dontHaveAnAccount}
              <Text
                style={{ color: colors.RED }}
                onPress={() => navigation.navigate('Register')}>
                {'  '}
                {APP_TEXT.login.createOne}
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Login;

const styles = ScaledSheet.create({
  keyboardView: { flex: 1, backgroundColor: colors.RED },
  topSection: {
    flex: 0.4,
    backgroundColor: colors.RED,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999,
  },
  backButtonImage: {
    width: 30,
    height: 30,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    flex: 0.6,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 15,
    borderTopLeftRadius: 50,
  },
  welcomeText: {
    fontSize: dynamicFonts.h1,
    fontWeight: '500',
    color: colors.RED,
    textAlign: 'center',
    marginBottom: 20,
  },
  innerWelcomeText: {
    color: colors.BLACK,
  },
  forgotPass:{ color: colors.BLACK, fontWeight: 600, fontSize: dynamicFonts.f14 },
  resetPass:{ color: colors.RED, fontWeight: 600, fontSize: dynamicFonts.f14 },
  footer:{
    height: 2,
    backgroundColor: colors.LIGHTGREY,
  },
});
