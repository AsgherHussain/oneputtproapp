/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
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
import * as Yup from 'yup';
import {Formik, setIn} from 'formik';

// custom components
import ErrorField from '../../components/ErrorField';
import {InputField, PasswordField} from '../../components/InputField';

// packages
import {ScaledSheet} from 'react-native-size-matters';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

//api
import settings from '../../config/settings';
import axios from 'axios';
import {getLoginData} from '../../helpers/asyncStorage';
import Spacing from '../../components/Spacing';
import {dynamicFonts} from '../../helpers/constants';
import {showMessage} from '../../helpers/showToast';
import {APP_TEXT} from '../../config/typography';

// validation function
const validateSchema = Yup.object().shape({
  // reset_token: Yup.string().required('Code field is required'),

  password: Yup.string()
    .required('Password field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),

  cpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password field is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Password Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});

const ResetPassword = ({navigation, route}) => {
  const userId = route.params?.userId;
  const otpCode = route.params?.otpCode;
  console.log('userId', otpCode);
  const [inputData, setInputData] = React.useState({
    id: userId,
    reset_token: '',
    password: '',
    cpassword: '',
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
  const submitHandler = async ({id, password, cpassword, reset_token}) => {
    await axios
      .patch(`${settings.API_URL}/UserManagement/reset-password`, {
        id,
        password,
        cpassword,
        reset_token: otpCode,
      })
      .then(response => {
        if (response.data) {
          showMessage('info', 'Message', response.data.message, 300);
        }
        if (response.data.status === 200) {
          setInputData({
            id: '',
            reset_token: '',
            password: '',
            cpassword: '',
          });
          setTimeout(() => {
            navigation.navigate('Login');
          });
        }
      })
      .catch(error => {
        if (error.response.data.status === 400) {
          showMessage('error', 'Message', error.response.data.message, 300);
        }
      });
  };

  return (
    <SafeAreaView style={style.Container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // style={style.Container}
        contentContainerStyle={{flexGrow: 1}}>
        <KeyboardAvoidingView style={styles.keyboardView} enabled>
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
                source={require('../../../assets/key.png')}
                resizeMode="contain"
              />
            </ImageBackground>
          </View>
          <View style={styles.bottomSection}>
            <Spacing height={50} />
            <Text style={styles.newPasswordText}>
              {APP_TEXT.changePassword.newPassword}
            </Text>
            <Spacing height={5} />
            <Text style={styles.instructionText}>
              {APP_TEXT.changePassword.enterNewPassword}
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
                  <>
                    <ErrorField
                      touched={touched}
                      errors={errors}
                      fieldName="password"
                    />
                    <View style={style.inputWrapper}>
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
                      fieldName="cpassword"
                    />
                    <View style={style.inputWrapper}>
                      <PasswordField
                        iconName={'unlock-alt'}
                        containerStyle={style.inputField}
                        handleChange={handleChange}
                        values={values}
                        fieldName={'cpassword'}
                        placeholder="Confirm Password"
                        icon={require('../../../assets/password.png')}
                      />
                    </View>
                  </>
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
                        {APP_TEXT.changePassword.changePassword}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPassword;
const styles = ScaledSheet.create({
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
  newPasswordText: {
    fontSize: dynamicFonts.h1,
    fontWeight: '500',
    color: colors.BLACK,
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: dynamicFonts.f14,
    color: colors.BLACK,
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 110,
  },
  keyboardView: {flex: 1, backgroundColor: colors.RED},
});
