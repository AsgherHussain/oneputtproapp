/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Button,
  BackHandler,
} from 'react-native';

// packages
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart, XAxis, YAxis, Grid, Line} from 'react-native-svg-charts';
import {ScaledSheet} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

// custom components
import CircularProgressComp from '../components/CircularProgressComp';
import TopButtons from '../components/TopButtons';
import DetailsBox from '../components/DetailsBox';
import {getLoginData} from '../helpers/asyncStorage';

// api
import {
  DeleteSessionById,
  GetBestPuttListData,
  GetPuttListData,
} from '../Api/DashboardApi';
import {Rect, Svg} from 'react-native-svg';
import {APP_TEXT} from '../config/typography';
import Spacing from '../components/Spacing';
import colors from '../styles/colors';
import {dynamicFonts} from '../helpers/constants';
import {dashboardData} from '../helpers/dashboardConstants';
import {dataMapperPutValues, formatDate} from '../helpers/helperMethods';

const {width, height} = Dimensions.get('screen');

const BestPuttsList = ({navigation}) => {
  const [puttData, setPuttData] = useState([]);
  //redux
  const topbuttonvalue = useSelector(state => state.topbutton.topbuttonvalue);
  const sessionId = useSelector(state => state.topbutton.sessionId);
  const handleItemPress = item => {
    navigation.navigate('SinglePuttData', {puttNo: item.putt_no});
  };

  useEffect(() => {
    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => {
      backHandlerListener.remove();
    };
  }, [navigation]);

  const handleBackPress = () => {
    navigation.navigate('Parent');
    return true;
  };

  useEffect(() => {
    getPuttListData();
  }, []);

  const getPuttListData = () => {
    GetPuttListData(sessionId)
      .then(res => {
        if (res.status === 200) {
          let PuttData = res.data.data;
          setPuttData([PuttData[0]]);
        } else {
          console.log('data not found');
        }
      })
      .catch(err => {
        console.log(err, 'error in PuttList');
      });
  };
  const SessionCard = ({item}) => {
    const values = dataMapperPutValues(item);
    return (
      <>
        <View style={styles.subContainer}>
          <View style={styles.chartContainer}>
            <CircularProgressComp
              size={width > 799 ? 29 : width < 480 ? 15 : 18}
              width={width / 1.2}
              fill={Number(item.score_putt) * 10}
              color="#000000"
              containerHeight={height / 4.5}
            />

            <Spacing height={width / 11} />
            <Text style={styles.dateResult}>
              {formatDate(item.update_date)}
            </Text>
            <FlatList
              data={dashboardData}
              keyExtractor={(item, index) => (item + index).toString()}
              renderItem={({item}) => (
                <View style={{padding: 3}}>
                  <DetailsBox
                    heading={item.title}
                    value={Number(values[item.identifier]).toFixed(2)}
                    subHeading={item.subTitle}
                  />
                </View>
              )}
              numColumns={3}
              ItemSeparatorComponent={() => <View style={{padding: 3}} />}
            />
          </View>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.topSection}>
        <Spacing height={8} />
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.goBack()}>
            <Icon name="keyboard-backspace" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.title}>{APP_TEXT.puttList.puttListDetails}</Text>
          <Spacing height={8} />
        </View>
      </View>
      <View style={styles.bodySection}>
        <Spacing height={height / 25} />
        {puttData.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{alignContent: 'center'}}>No results found</Text>
          </View>
        ) : (
          <FlatList
            data={puttData}
            renderItem={SessionCard}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <Button
                  onPress={() =>
                    navigation.navigate('PuttingSession', {
                      sessionId: puttData[0].session_id,
                    })
                  }
                  title="View Session Tracker"
                  color="#fff"
                />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default BestPuttsList;

const styles = ScaledSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.RED,
  },
  chart: {
    width: 300,
    height: 200,
  },
  subContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 4,
    backgroundColor: '#f5f5f5',
    elevation: 5,
    borderRadius: 5,
    margin: 12,
  },
  chartContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    padding: 12,
    zIndex: 2,
  },
  circularMainText: {
    // marginLeft: 'auto',
    // marginRight: 'auto',
    fontWeight: 400,
    color: '#000000',
    fontSize: 13,
    width: 125,
    textAlign: 'center',
  },
  circularSubText: {
    // marginLeft: 'auto',
    // marginRight: 'auto',
    fontSize: 10,
    fontWeight: 400,
    color: '#000000',
    width: 125,
    textAlign: 'center',
  },
  DetailsContainer: {
    marginLeft: 'auto',
    width: '40%',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#151412',
    padding: 5,
    alignItems: 'center',
    marginTop: 5,
    elevation: 4,
    textAlign: 'center',
  },
  ViewDetailsBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
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
    elevation: 4,
  },
  textContainer: {
    fontSize: 8,
    fontWeight: 400,
    color: '#000000',
  },
  textContainer2: {
    fontSize: 10,
    fontWeight: 400,
    color: '#FFFFFF',
  },
  numberContainer: {
    fontSize: 13,
    fontWeight: 400,
    color: '#000000',
  },
  TopViewContainer: {
    padding: 10,
    marginTop: 20,
  },
  TopViewSubContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e4e2',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    paddingHorizontal: 70,
    marginTop: 2,
  },
  label: {fontSize: 12, color: '#000000'},
  TopViewText: {
    color: '#000000',
    borderBottomWidth: 2,
    width: 80,
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 3,
  },
  outerCircle: {
    width: 125, // Fixed width for the outer circle
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    borderColor: '#E5E5E5',
    borderWidth: 5,
    alignSelf: 'flex-start',
  },
  outerCircle2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 70,
    borderColor: 'white',
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
    textAlign: 'center',
  },
  subTitle: {
    color: colors.WHITE,
    fontSize: dynamicFonts.f16,
    fontWeight: 500,
  },
  topContainer: {
    textAlign: 'center',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    borderRadius: 1,
    elevation: 2,
    marginTop: 10,
    backgroundColor: '#991e21',
    width: '95%',
    alignSelf: 'center',
  },
  dateResult: {
    alignContent: 'center',
    marginBottom: 12,
    fontSize: dynamicFonts.f16,
  },
  icon: {
    color: colors.WHITE,
    position: 'absolute',
    left: 4,
  },
});
