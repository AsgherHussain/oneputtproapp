/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../styles/colors';
import Spacing from '../../components/Spacing';
import {Formik} from 'formik';
import ErrorField from '../../components/ErrorField';
import {
  InputField,
  MobileField,
  PasswordField,
} from '../../components/InputField';
// Form validation
import * as Yup from 'yup';
import settings from '../../config/settings';
import axios from 'axios';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import { dynamicFonts } from '../../helpers/constants';
const validateSchema = Yup.object().shape({
  // reset_token: Yup.string().required('Code field is required'),

  password: Yup.string()
    .required('Password field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});

const Settings = ({navigation, route}) => {
  const userData = route?.params?.userData;
  const data = route?.params?.data;
  console.log('data', data);
  const [inputData, setInputData] = useState({
    name: userData?.fullName,
    lastName: '',
    email: userData?.user_email,
    mobileno: data?.data?.mobileno,
    password: '',
    confirmPassword: '',
  });
  const [forceInvalid, setForceInvalid] = useState(true);
  const formikRef = useRef();
  useEffect(() => {
    if (forceInvalid) {
      // Trigger a validation check on mount
      formikRef.current.validateForm().then(errors => {
        if (Object.keys(errors).length === 0) {
          // No errors, but we want to force invalid state
          formikRef.current.setErrors({_forceInvalid: 'Invalid'});
        }
        setForceInvalid(false);
      });
    }
  }, [forceInvalid]);

  const handelRegister = async ({
    firstName,
    lastName,
    email,
    password,
    mobileno,
  }) => {
    console.log('email', email);
    getOtpApiCall({email, password});
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const getOtpApiCall = async ({email, password}) => {
    try {
      const {status, data} = await axios({
        method: 'GET',
        url: `${settings.API_URL}/UserManagement/forgot-password/${email}`,
      });
      if (status === 200) {
        if (data.status === 200) {
          Toast.show({
            type: 'info',
            text1: 'Message',
            text2: data.message,
            visibilityTime: 5000,
          });
          navigation.navigate('OtpVerification', {
            fromScreen: 'Settings',
            password: password,
          });
        } else {
          Toast.show({
            type: 'info',
            text1: 'Message',
            text2: data.message,
            visibilityTime: 4000,
          });
        }
      } else {
        Toast.show({
          type: 'info',
          text1: 'Message',
          text2: 'Something went wrong.',
          visibilityTime: 4000,
        });
      }
    } catch (e) {
      console.log(e, 'error in register');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={onPressBack}>
            <Image
              source={require('../../../assets/back.png')}
              style={styles.backImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>
          <Spacing width={20} />
        </View>
      </View>
      <View style={styles.body}>
        <Spacing height={20} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{flexGrow: 1}}>
          <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: colors.WHITE}}
            enabled>
            <Spacing height={30} />

            <Formik
              enableReinitialize
              innerRef={formikRef}
              initialValues={inputData}
              validationSchema={validateSchema}
              onSubmit={values => {
                handelRegister(values);
              }}>
              {({
                values,
                errors,
                touched,
                isValid,
                handleChange,
                handleSubmit,
              }) => (
                <>
                  <View style={styles.inputWrapper}>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="name"
                    />
                    <InputField
                      iconName={'user'}
                      editable={false}
                      containerStyle={styles.inputField}
                      handleChange={handleChange}
                      values={values}
                      fieldName={'name'}
                      placeholder="Name"
                      icon={require('../../../assets/user.png')}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="email"
                    />
                    <InputField
                      iconName={'envelope'}
                      editable={false}
                      containerStyle={styles.inputField}
                      handleChange={handleChange}
                      values={values}
                      fieldName={'email'}
                      placeholder="Email Id"
                      icon={require('../../../assets/email.png')}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="mobileno"
                    />
                    <MobileField
                      iconName={'mobile-phone'}
                      editable={false}
                      containerStyle={styles.inputField}
                      handleChange={handleChange}
                      values={values}
                      fieldName={'mobileno'}
                      placeholder="Mobile Number"
                      icon={require('../../../assets/phone.png')}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: dynamicFonts.f18,
                      fontWeight: '500',
                      color: colors.BLACK,
                      textAlign: 'center',
                      marginBottom: 20,
                    }}>
                    Change Password
                  </Text>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="password"
                    />
                    <View style={[styles.inputWrapper]}>
                      <PasswordField
                        iconName={'unlock-alt'}
                        containerStyle={styles.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'password'}
                        placeholder="New Password"
                        icon={require('../../../assets/password.png')}
                      />
                    </View>
                  </>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="confirmPassword"
                    />
                    <View style={styles.inputWrapper}>
                      <PasswordField
                        iconName={'unlock-alt'}
                        containerStyle={styles.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'confirmPassword'}
                        placeholder="Confirm New Password"
                        icon={require('../../../assets/password.png')}
                      />
                    </View>
                  </>

                  <TouchableOpacity
                    // disabled={!isValid}
                    activeOpacity={0.9}
                    style={[
                      styles.primaryBtn,
                      {
                        backgroundColor: !isValid ? '#E28C8F' : colors.RED,
                      },
                    ]}
                    onPress={handleSubmit}>
                    <Text style={styles.primaryBtnTxt}>Save Changes</Text>
                  </TouchableOpacity>
                  {/* <Spacing height={10} /> */}
                  <Text style={styles.bottomText}>Cancel</Text>
                </>
              )}
            </Formik>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
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
    backgroundColor: colors.WHITE,
    paddingHorizontal: 15,
    borderTopLeftRadius: 50,
  },
  headerTitle: {
    fontSize: dynamicFonts.h2,
    fontWeight: '500',
    color: colors.WHITE,
  },
  inputField: {
    borderRadius: 4,
    backgroundColor: colors.LIGHTGREY,
  },
  ImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: '30%',
  },
  ImageText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.WHITE,
  },
  inputWrapper: {
    marginBottom: 15,
    height: 55,
  },
  primaryBtn: {
    width: '100%',
    padding: 13,
    borderRadius: 4,
    backgroundColor: colors.RED,
  },
  primaryBtnTxt: {
    color: colors.WHITE,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: dynamicFonts.f16,
  },
  forgotText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5%',
    marginTop: 10,
    marginBottom: 20,
  },
  bottomText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 600,
    marginTop: 20,
    color: colors.BLACK,
    fontSize: dynamicFonts.f14,
  },
  backBtn: {
    color: colors.DARKGREY,
    padding: 20,
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backImage: {
    width: 23,
    height: 23,
  },
});
