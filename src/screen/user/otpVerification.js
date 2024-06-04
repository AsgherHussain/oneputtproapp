/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// style and color css
import colors from '../../styles/colors';
import style from './style';
// Form validation
import {Formik} from 'formik';
import * as Yup from 'yup';

// custom components
import ErrorField from '../../components/ErrorField';
import {InputField} from '../../components/InputField';
//api
import axios from 'axios';
import Spacing from '../../components/Spacing';
import settings from '../../config/settings';
import {ScaledSheet} from 'react-native-size-matters';
import {getLoginData} from '../../helpers/asyncStorage';
import {dynamicFonts} from '../../helpers/constants';
import {showMessage} from '../../helpers/showToast';
import {APP_TEXT} from '../../config/typography';

// validation function
const validateSchema = Yup.object().shape({
  reset_token: Yup.string().required('Code field is required'),
});

const OtpVerification = ({navigation, route}) => {
  const userId = route.params?.userId;
  const email = route.params?.email;
  const fromScreen = route.params?.fromScreen;
  const password = route.params?.password;
  const [resendLoader, setResendLoader] = useState(false);

  const [inputData, setInputData] = React.useState({
    id: userId,
    reset_token: '',
    password: '',
    cpassword: '',
  });
  const [forceInvalid, setForceInvalid] = useState(true);
  const formikRef = useRef();
  const [timer, setTimer] = useState(0); // 120 seconds for 2 minutes
  useEffect(() => {
    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, []);
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
  const submitHandler = async ({id, password, cpassword, reset_token}) => {
    if (fromScreen) {
      const userData = await getLoginData();
      otpVerifyApiCall({userData, reset_token});
      return;
    }
    navigation.navigate('ResetPassword', {
      otpCode: reset_token,
      userId: id,
      email: email,
    });
  };

  const otpVerifyApiCall = async ({userData, reset_token}) => {
    await axios
      .patch(`${settings.API_URL}/UserManagement/reset-password`, {
        id: userData.user_id,
        password: password,
        cpassword: password,
        reset_token: reset_token,
      })
      .then(response => {
        if (response.data) {
          showMessage('info', 'Message', response.data.message, 3000);
        }
        if (response.data.status === 200) {
          navigation.navigate('SuccessScreen');
        }
      })
      .catch(error => {
        if (error.response.data.status === 400) {
          showMessage('error', 'Message', error.response.data.message, 3000);
        }
      });
  };
  const handleResendCode = async () => {
    try {
      let userEmail = email;
      if (fromScreen) {
        const userData = await getLoginData();
        userEmail = userData?.user_email;
      } else {
        userEmail = email;
      }
      const {status, data} = await axios({
        method: 'GET',
        url: `${settings.API_URL}/UserManagement/forgot-password/${userEmail}`,
      });
      if (status === 200) {
        showMessage('info', 'Message', data.message, 4000);
      } else {
        showMessage('info', 'Message', 'Something went wrong.', 4000);
      }
    } catch (e) {
      console.log(e, 'error in register');
    }
  };
  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressResendOTP = async () => {
    setResendLoader(true);
    handleResendCode();
    try {
      setTimer(60);
    } catch (error) {
      setResendLoader(false);
    }
  };
  return (
    <SafeAreaView style={style.Container}>
      {fromScreen == 'Settings' && (
        <View style={styles.header}>
          <View style={styles.headerSub}>
            <TouchableOpacity onPress={onPressBack}>
              <Image
                source={require('../../../assets/back.png')}
                style={{width: 23, height: 23}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <Spacing width={20} />
          </View>
        </View>
      )}
      <View
        style={{
          flex: fromScreen == 'Settings' ? 0.8 : 1,
        }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // style={style.Container}
          contentContainerStyle={{flexGrow: 1}}>
          <KeyboardAvoidingView style={styles.keyboardView} enabled>
            {fromScreen !== 'Settings' && (
              <View style={styles.topSection}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('back');
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
                    style={styles.image}
                    source={require('../../../assets/checkEmail.png')}
                    resizeMode="contain"
                  />
                </ImageBackground>
              </View>
            )}
            <View
              style={[
                styles.container,
                {flex: fromScreen == 'Settings' ? 1 : 0.6},
              ]}>
              <Spacing height={50} />
              <Text style={styles.checkMailText}>
                {APP_TEXT.otpVerification.checkMail}
              </Text>
              <Spacing height={5} />
              <Text style={styles.otpInstructionText}>
                {APP_TEXT.otpVerification.otpInstruction}
              </Text>
              <Spacing height={50} />
              <Formik
                initialValues={inputData}
                validationSchema={validateSchema}
                innerRef={formikRef}
                onSubmit={values => {
                  submitHandler(values);
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
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="reset_token"
                    />
                    <View style={style.inputWrapper}>
                      <InputField
                        iconName={'check'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'reset_token'}
                        placeholder="OTP"
                        icon={require('../../../assets/otp.png')}
                      />
                    </View>

                    <View style={style.formActions}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        // disabled={!isValid}
                        style={[
                          style.primaryBtn,
                          {
                            backgroundColor: !isValid ? '#E28C8F' : colors.RED,
                          },
                        ]}
                        onPress={handleSubmit}>
                        <Text style={style.primaryBtnTxt}>
                          {fromScreen
                            ? 'Change my password'
                            : 'Reset my password'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Spacing height={20} />
                    <View style={styles.registerContainer}>
                      <Text style={styles.infoText}>
                        {APP_TEXT.otpVerification.didntReceive}
                      </Text>
                      <Pressable
                        disabled={timer > 0}
                        onPress={() => {
                          onPressResendOTP();
                        }}>
                        <Text style={styles.registerText}>
                          {timer > 0 ? `${timer} Sec` : 'Resend'}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OtpVerification;
const styles = ScaledSheet.create({
  header: {
    flex: 0.2,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
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
  resetPasswordText: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: colors.BLACK,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 110,
  },
  container: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: 15,
    borderTopLeftRadius: 50,
  },
  checkMailText: {
    fontSize: dynamicFonts.h1,
    fontWeight: '500',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 10,
  },
  otpInstructionText: {
    fontSize: dynamicFonts.f14,
    color: colors.BLACK,
    textAlign: 'center',
  },
  registerContainer: {
    // flex: 0.3,
    flexDirection: 'row', // Align items in a row
    justifyContent: 'center',
    alignItems: 'flex-end', // Align items vertically
    marginBottom: 50,
  },
  infoText: {
    color: colors.BLACK,
    textAlign: 'center',
    fontSize: dynamicFonts.f14,
  },
  registerText: {
    color: colors.RED,
    textAlign: 'center',
    fontSize: dynamicFonts.f14,
  },
  headerSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    // marginTop: 10,
  },
  keyboardView: {flex: 1, backgroundColor: colors.RED},
});
