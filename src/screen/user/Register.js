import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// packages
import {ScaledSheet} from 'react-native-size-matters';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

// Form validation
import * as Yup from 'yup';
import {Formik} from 'formik';

//api
import settings from '../../config/settings';
import axios from 'axios';

//custom components
import ErrorField from '../../components/ErrorField';
import {
  InputField,
  MobileField,
  PasswordField,
} from '../../components/InputField';

// style and color css
import colors from '../../styles/colors';
import style from './style';
import Spacing from '../../components/Spacing';
import {dynamicFonts} from '../../helpers/constants';

// validation function
const validateSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .trim()
  //   .required('FirstName field is required')
  //   .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  lastName: Yup.string()
    .trim()
    .required('LastName field is required')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
  email: Yup.string()
    .required('Email field is required')
    .email('Use valid email id'),
  mobileno: Yup.string()
    .trim()
    .required('Mobile number field is required')
    .matches(/^[0-9]*$/, 'Only numbers are allowed for this field')
    .min(9, 'Mobile number is not valid')
    .max(14, 'Mobile number is not valid'),
  password: Yup.string()
    .required('Password field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
  confirmPassword: Yup.string()
    .trim()
    .required('Confirm Password field is required')
    .oneOf(
      [Yup.ref('password'), null],
      'The password and the confirm password must be same.',
    ),
});

const Register = ({navigation}) => {
  const [inputData, setInputData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileno: '',
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
  // handleregister
  const handelRegister = async ({
    firstName,
    lastName,
    email,
    password,
    mobileno,
  }) => {
    try {
      const {status, data} = await axios({
        method: 'POST',
        url: `${settings.API_URL}/UserManagement/register`,
        data: {
          fullName: lastName,
          email,
          password,
          mobileno,
          type: 'guest',
          role_id: 1,
          subscription_status: 'open',
          platform: Platform.OS
        },
      });
      if (status === 200) {
        if (data.status === 200) {
          Toast.show({
            type: 'success',
            text1: 'Thank you for registering with OnePuttPro!',
            text2:
              'Check your email for a verification link to activate your account.',
          });

          setTimeout(() => {
            navigation.navigate('Login');
            setInputData({
              firstName: '',
              lastName: '',
              email: '',
              mobileno: '',
              password: '',
              confirmPassword: '',
            });
          }, 4000);
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
    <SafeAreaView style={style.Container}>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: colors.RED}}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{flexGrow: 1}}
          // style={style.Container}
        >
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
                style={style.Image}
                source={require('../../../assets/logo6.png')}
                resizeMode="stretch"
              />
            </ImageBackground>
          </View>
          <View style={styles.bottomSection}>
            <Spacing height={50} />
            <Text style={styles.welcomeText}>
              <Text style={styles.innerWelcomeText}>Let’s get started!</Text>
            </Text>
            <Spacing height={14} />
            <Formik
              enableReinitialize
              initialValues={inputData}
              validationSchema={validateSchema}
              innerRef={formikRef}
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
                  {/* <View style={[style.inputWrapper, {marginTop: 20}]}>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="firstName"
                    />
                    <InputField
                      iconName={'user'}
                      containerStyle={style.inputField}
                      handleChange={handleChange}
                      values={values}
                      fieldName={'firstName'}
                      placeholder="First Name"
                      icon={require('../../../assets/user.png')}
                    />
                  </View> */}
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="lastName"
                    />
                    <View style={style.inputWrapper}>
                      <InputField
                        iconName={'user'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'lastName'}
                        placeholder="Full Name"
                        icon={require('../../../assets/user.png')}
                      />
                    </View>
                  </>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="email"
                    />
                    <View style={style.inputWrapper}>
                      <InputField
                        iconName={'envelope'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'email'}
                        placeholder="Email"
                        icon={require('../../../assets/email.png')}
                      />
                    </View>
                  </>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="mobileno"
                    />
                    <View style={style.inputWrapper}>
                      <MobileField
                        iconName={'mobile-phone'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'mobileno'}
                        placeholder="Phone Number"
                        icon={require('../../../assets/phone.png')}
                      />
                    </View>
                  </>
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="password"
                    />
                    <View style={[style.inputWrapper]}>
                      <PasswordField
                        iconName={'unlock-alt'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'password'}
                        placeholder="Password"
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
                    <View style={style.inputWrapper}>
                      <PasswordField
                        iconName={'unlock-alt'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'confirmPassword'}
                        placeholder="Confirm Password"
                        icon={require('../../../assets/password.png')}
                      />
                    </View>
                  </>
                  <View style={{}}>
                    <TouchableOpacity
                      // disabled={!isValid}
                      activeOpacity={0.9}
                      style={[
                        style.primaryBtn,
                        {
                          backgroundColor: !isValid ? '#E28C8F' : colors.RED,
                        },
                      ]}
                      onPress={handleSubmit}>
                      <Text style={style.primaryBtnTxt}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
            <Text style={style.bottomText}>
              Already have an account?
              <Text
                style={{color: colors.RED}}
                onPress={() => {
                  navigation.navigate('Login');
                  setInputData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    mobileno: '',
                    password: '',
                    confirmPassword: '',
                  });
                }}>
                {' '}
                Login
              </Text>
            </Text>
            <Spacing height={50} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Register;
const styles = ScaledSheet.create({
  topSection: {
    flex: 0.3,
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
    flex: 0.7,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 15,
    borderTopLeftRadius: 50,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.RED,
    textAlign: 'center',
    marginBottom: 10,
  },
  innerWelcomeText: {
    color: colors.BLACK,
    fontSize: dynamicFonts.h1,
  },
});
