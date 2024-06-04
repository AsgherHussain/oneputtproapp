import React, {useState, useEffect} from 'react';

import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  BackHandler,
} from 'react-native';

// packages
import Icon from 'react-native-vector-icons/Entypo';
import {ScaledSheet} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// custom component
import CircularProgressComp from '../components/CircularProgressComp';
import TopButtons from '../components/TopButtons';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {DeleteSessionById, GetAllSessionListData} from '../Api/DashboardApi';

import {useDispatch} from 'react-redux';
import {setSessionid, setTopbuttonValue} from '../Service/TopbuttonsSlice';
import colors from '../styles/colors';
import {dynamicFonts} from '../helpers/constants';
import {APP_TEXT} from '../config/typography';
import Spacing from '../components/Spacing';
import {dataMapperPutValues, formatDate} from '../helpers/helperMethods';
import DetailsBox from '../components/DetailsBox';
import MenuPopup from '../components/MenuPopup';
import {getLoginData} from '../helpers/asyncStorage';

const {width} = Dimensions.get('screen');
const SessionList = ({navigation}) => {
  const [sessionData, setSessionData] = useState([]);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const userData = await getLoginData();
      setUserData(userData);
    })();
  }, [isFocused]);
  useEffect(() => {
    const handleBackButton = () => {
      if (navigation.isFocused()) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Exit',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
          ],
          {cancelable: false},
        );
        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      getAllSessionList();
      return () => {
        // Cleanup code (optional)
        console.log('Screen blurred');
      };
    }, []),
  );

  const getAllSessionList = () => {
    GetAllSessionListData()
      .then(res => {
        if (res.status === 200) {
          let AllSessionData = res.data.data;
          setSessionData(AllSessionData);
        } else {
          console.log('not found');
        }
      })
      .catch(e => {
        console.log(e, 'error in SessionList');
      });
  };

  // const deleteSession = (sessionId) =>{

  //   DeleteSessionById(sessionId).then(res =>{
  //     if (res.status === 200) {

  //       if(res.data.status === 200){
  //         Alert.alert('Session deleted successfully');
  //         getAllSessionList();
  //       }
  //     } else {
  //       console.log('not deleted');
  //     }
  //   }).catch(e => {
  //     console.log(e, 'error in SessionList');
  //   });
  // }

  const deleteSession = sessionId => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // User pressed OK, delete the session
            DeleteSessionById(sessionId)
              .then(res => {
                if (res.status === 200 && res.data.status === 200) {
                  Alert.alert('Session deleted successfully');
                  getAllSessionList();
                } else {
                  console.log('Not deleted');
                }
              })
              .catch(e => {
                console.log(e, 'error in SessionList');
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const SessionCard = ({item}) => {
    // const values = dataMapperPutValues(item);
    {
      const startDate = item.start_datetime;
      return (
        <View style={styles.sessionContainer}>
          <View style={styles.dateDiv}>
            <Text style={styles.SessionNameDate}>{formatDate(startDate)}</Text>
            <MenuPopup
              iconName={'dots-three-vertical'}
              options={[{id: 'delete', title: 'Delete', icon: 'trash'}]}
              onAction={val => {
                if (val === 'delete') {
                  deleteSession(item.id);
                }
              }}
            />
          </View>
          <View style={styles.subContainer}>
            <View style={{alignItems: 'center'}}>
              <CircularProgressComp
                size={15}
                width={width / 2.3}
                fill={Number(item.session_score) * 10}
                color="#000000"
                isSmall
              />

              <Spacing height={width / 15} />
              <TouchableOpacity
                style={styles.viewDetailBtn}
                onPress={() => {
                  dispatch(setSessionid(item.id));
                  dispatch(setTopbuttonValue(2));
                  navigation.navigate('PuttList', {sessionId: item.id});
                }}>
                <Text style={{fontSize: dynamicFonts.f14}}>View Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.DetailsContainer}>
              <DetailsBox
                heading={'Time Ratio'}
                value={item.time_ratio}
                subHeading={'sec'}
              />
              <View style={{marginVertical: 4}}>
                <DetailsBox
                  heading={'Angle Of Impact'}
                  value={item.angle_of_impact}
                  subHeading={'degree'}
                />
              </View>
              {/* <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.ViewDetailsBtn}
                  activeOpacity={0.9}
                  onPress={() => {
                    dispatch(setSessionid(item.id));
                    dispatch(setTopbuttonValue(2));
                    navigation.navigate('PuttList', {sessionId: item.id});
                  }}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  activeOpacity={0.9}
                  onPress={() => deleteSession(item.id)}>
                  <Icon
                    name="delete-outline"
                    color="#FFFFFF"
                    size={
                      Dimensions.get('screen').width > 799
                        ? 28
                        : Dimensions.get('screen').width < 480
                        ? 20
                        : 24
                    }
                  />
                </TouchableOpacity>
              </View> */}
              {/* <View>
                <TouchableOpacity
                  style={styles.btnContainer2}
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('PuttingSession', {sessionId: item.id})
                  }>
                  <Text
                    style={styles.textContainer2}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    View Session Performance
                  </Text>
                </TouchableOpacity>
              </View> */}
              {/* <View>
                <LinearGradient
                  colors={['#E3E3E3', '#FFFFFF', '#E3E3E3']}
                  locations={[0.02, 0.5, 1]}
                  style={styles.timeContainer}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.textContainer}>{'Time \nRatio'}</Text>
                  <Text style={styles.numberContainer}>{item.time_ratio}</Text>
                </LinearGradient>
              </View> */}
              {/* <View>
                <LinearGradient
                  colors={['#E3E3E3', '#FFFFFF', '#E3E3E3']}
                  locations={[0.02, 0.5, 1]}
                  style={styles.timeContainer}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.textContainer}>
                    {'Angle of \nLie Start'}
                  </Text>
                  <Text style={styles.numberContainer}>
                    {/* {item.angle_of_impact} */}
              {/* 65.63
                  </Text>
                </LinearGradient> */}
              {/* </View> */}
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.topSection}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{APP_TEXT.dashboard.dashboard}</Text>
          <Spacing height={8} />
          <Text style={styles.subTitle}>
            {APP_TEXT.dashboard.welcomeText(userData ? userData.fullName : '')}
          </Text>
        </View>
      </View>
      <View style={styles.bodySection}>
        <TopButtons initial={0} />
        {sessionData && sessionData.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{alignContent: 'center'}}>No results found</Text>
          </View>
        ) : (
          <FlatList
            data={sessionData}
            renderItem={SessionCard}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SessionList;

const styles = ScaledSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.RED,
  },
  sessionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 10,
    borderRadius: 8,
    margin: 12,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  circularProgress: {
    marginTop: 20,
  },
  circularMainText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 'bold',
    color: '#000000',
  },
  circularSubText: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  SessionNameDate: {
    fontSize: dynamicFonts.f14,
    marginTop: 2,
    color: '#000000',
  },
  chartContainer: {width: '50%'},

  DetailsContainer: {
    alignItems: 'flex-end',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#151412',
    height: '30@ms',
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    textAlign: 'center',
  },
  textContainer2: {
    fontSize: '11@ms',
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ViewDetailsBtn: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#151412',
    marginRight: 4,
    height: '30@ms',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    elevation: 4,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: '12@ms',
  },
  deleteBtn: {
    height: '30@ms',
    width: '30@ms',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#151412',
    borderRadius: 0,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 9,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 0,
    elevation: 0,
  },
  textContainer: {
    fontSize: 8,
    fontWeight: 400,
    color: '#000000',
  },
  numberContainer: {
    fontSize: 13,
    fontWeight: 400,
    color: '#000000',
  },
  outerCircle: {
    width: 125, // Fixed width for the outer circle
    // height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    borderColor: '#E5E5E5',
    borderWidth: 5,
  },
  outerCircle2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },

  topSection: {
    flex: 0.15,
    backgroundColor: colors.RED,
    // ma: 20,
  },
  bodySection: {
    flex: 0.85,
    borderTopLeftRadius: 40,
    backgroundColor: '#E3E3E3',
  },
  title: {
    color: colors.WHITE,
    fontWeight: 500,
    fontSize: dynamicFonts.h1,
    letterSpacing: 0.5,
  },
  subTitle: {
    color: colors.WHITE,
    fontSize: dynamicFonts.f16,
    fontWeight: 500,
  },
  topContainer: {
    margin: 16,
  },
  viewDetailBtn: {
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  dateDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
