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

// packages
import {ScaledSheet} from 'react-native-size-matters';

// Form validation
import * as Yup from 'yup';
import {Formik } from 'formik';

// custom components
import ErrorField from '../../components/ErrorField';
import {InputField} from '../../components/InputField';

//api
import settings from '../../config/settings';
import axios from 'axios';

// style and color css
import colors from '../../styles/colors';
import style from './style';
import Spacing from '../../components/Spacing';
import {dynamicFonts} from '../../helpers/constants';
import { showMessage } from '../../helpers/showToast';
import { APP_TEXT } from '../../config/typography';

// validation function
const validateSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email field is required')
    .email('Use valid email id'),
});

const ForgotPassword = ({navigation}) => {
  const [inputData, setInputData] = React.useState({
    email: '',
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
  // handleSubmit
  const submitHandler = async ({email}) => {
    try {
      const {status, data} = await axios({
        method: 'GET',
        url: `${settings.API_URL}/UserManagement/forgot-password/${email}`,
      });
      if (status === 200) {
        if (data){
          showMessage('info','Message',data.message,4000);
        }
        if (data.status === 200) {
          setInputData({email: ''});
          setTimeout(() => {
            navigation.navigate('OtpVerification', {
              userId: data.id,
              email: email,
            });
          }, 3000);
        }
      } else {
        showMessage('info','Message','Something went wrong.',4000);
      }
    } catch (e) {
      console.log(e, 'error in register');
    }
  };

  return (
    <SafeAreaView style={style.Container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // style={style.Container}
        contentContainerStyle={{flexGrow: 1}}>
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
                style={styles.image}
                source={require('../../../assets/lock.png')}
                resizeMode="contain"
              />
            </ImageBackground>
          </View>
          <View style={styles.bottomSection}>
            <Spacing height={50} />
            <Text style={styles.resetPasswordText}>{APP_TEXT.resetPassword.resetPass}</Text>
            <Spacing height={5} />
            <Text style={styles.instructionText}>
            {APP_TEXT.resetPassword.receiveOTP}
            </Text>
            <Spacing height={40} />
            <Formik
              initialValues={inputData}
              innerRef={formikRef}
              validationSchema={validateSchema}
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
                      <Text style={style.primaryBtnTxt}>{APP_TEXT.general.send}</Text>
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
export default ForgotPassword;
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
  resetPasswordText: {
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
    letterSpacing: 0.02,
  },
  image: {
    width: 120,
    height: 110,
  },
  keyboardView:{flex: 1, backgroundColor: colors.RED},
});
