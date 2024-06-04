/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Dimensions,
  Button,
} from 'react-native';

// packages
import {ScaledSheet} from 'react-native-size-matters';
import {useIsFocused} from '@react-navigation/native';

// custom components
import CircularProgressComp from '../components/CircularProgressComp';
import TopButtons from '../components/TopButtons';
import DetailsBox from '../components/DetailsBox';
import {getLoginData} from '../helpers/asyncStorage';

// api
import {DeleteSessionById, GetBestPuttListData} from '../Api/DashboardApi';
import {Rect, Svg} from 'react-native-svg';
import {APP_TEXT} from '../config/typography';
import Spacing from '../components/Spacing';
import colors from '../styles/colors';
import {dynamicFonts} from '../helpers/constants';
import {dashboardData} from '../helpers/dashboardConstants';
import {formatDate, dataMapperPutValues} from '../helpers/helperMethods';

const {width, height} = Dimensions.get('screen');

const BestPuttsList = ({navigation}) => {
  const [bestPuttData, setBestPuttData] = useState([]);
  const [frontStrokData, setFrontStrokeData] = useState([]);
  const [backStrokeData, setBackStrokeData] = useState([]);
  const [userData, setUserData] = useState(null);

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const userData = await getLoginData();
      setUserData(userData);
    })();
  }, [isFocused]);

  useEffect(() => {
    getBestPuttListData();
  }, []);

  const getBestPuttListData = () => {
    GetBestPuttListData()
      .then(res => {
        if (res.status === 200) {
          let bestPuttData = res.data.data;
          bestPuttData.map(xdata => {
            const frontStroke = JSON.parse(xdata.front_stroke);
            const backStroke = JSON.parse(xdata.back_stroke);

            const frontStrokecombinedValues = [];
            frontStroke.forEach(entry => {
              const x = entry[1];

              const y = entry[2];

              frontStrokecombinedValues.push({x, y});
            });
            setFrontStrokeData(frontStrokecombinedValues);

            const backStrokecombinedValues = [];
            backStroke.forEach(entry => {
              const x = entry[1];

              const y = entry[2];

              backStrokecombinedValues.push({x, y});
            });
            setBackStrokeData(backStrokecombinedValues);
          });
          setBestPuttData([bestPuttData[0]]);
        } else {
          console.log('error in bestputtlist');
        }
      })
      .catch(err => {
        console.log(err, 'error in bestPuttList');
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
              {formatDate(bestPuttData[0].update_date)}
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

            {/* </View> */}
            {/* </View> */}
            {/* <Text style={styles.circularMainText}>Putt Number {item.id}</Text>
              <Text style={styles.circularSubText}>({item.ftDistance} ft)</Text> */}

            {/* <View style={styles.DetailsContainer}> */}
            {/* <View style={styles.btnContainer}> */}
            {/* <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.ViewDetailsBtn}
                  onPress={() =>
                    navigation.navigate('SinglePuttData', {puttNo: item.id})
                  }>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity> */}
            {/* <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.deleteBtn}
                  onPress={() => deleteSession(item.id)}>
                  <Icon
                    name="delete-outline"
                    color="#fff"
                    style={styles.delIcon}
                    size={
                      Dimensions.get('screen').width > 799
                        ? 28
                        : Dimensions.get('screen').width < 480
                        ? 20
                        : 24
                    }
                  />
                </TouchableOpacity> */}
            {/* </View> */}

            {/* <LinearGradient
                colors={['#E3E3E3', '#FFFFFF', '#E3E3E3']}
                locations={[0.02, 0.5, 1]}
                style={styles.timeContainer}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.textContainer}>{'Time \nRatio'}</Text>
                <Text style={styles.numberContainer}>2:1</Text>
              </LinearGradient>
              <LinearGradient
                colors={['#E3E3E3', '#FFFFFF', '#E3E3E3']}
                locations={[0.02, 0.5, 1]}
                style={styles.timeContainer}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}>
                <Text style={styles.textContainer}>{'Angle of \nLie Start'}</Text>
                <Text style={styles.numberContainer}>
                  {item.ang_lie_start.toFixed(2)}
                </Text>
              </LinearGradient> */}
            {/* </View> */}
          </View>
          {/* <View style={styles.TopViewContainer}>
            <View style={styles.TopViewSubContainer}>
              <Text style={styles.TopViewText}>Top View 1</Text>
            </View>
            <View
              style={{
                height: 150,
                margin: 10,
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <YAxis
                style={{marginRight: 10}}
                svg={{
                  fill: '#454545',
                  fontSize: 10,
                  // scale: '#454545',
                }}
                contentInset={{top: 10, bottom: 20}}
                data={datay}
                min={-0.4}
                max={0.3}
                numberOfTicks={datay.length}
                formatLabel={item => item}
              />
              <View style={{flex: 1}}>
                <LineChart
                  title
                  data={data}
                  style={{flex: 1}}
                  contentInset={{left: 100, right: 20, bottom: 40, top: 100}}
                  yAccessor={({item}) => item.y}
                  xAccessor={({item}) => item.x}
                />
                <XAxis
                  data={datax}
                  contentInset={{left: 10, right: 20}}
                  svg={{
                    fill: '#454545',
                    fontSize: 10,
                  }}
                  style={{color: '#FF0000'}}
                  min={-0.12}
                  max={12}
                  numberOfTicks={datax.length}
                  formatLabel={(value, index) => datax[index]}
                />
              </View>
            </View>
            <View style={styles.labelContainer}>
              <Svg width={10} height={10}>
                <Rect x="0" y="0" width={10} height={10} fill="#00FF00" />
              </Svg>
              <Text style={styles.label}>Front Stroke</Text>
              <Svg width={10} height={10}>
                <Rect x="0" y="0" width={10} height={10} fill="#FF0000" />
              </Svg>
              <Text style={styles.label}>Back Stroke</Text>
            </View>
          </View> */}
        </View>
      </>
    );
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
        <TopButtons initial={1} />
        {bestPuttData.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{alignContent: 'center'}}>No results found</Text>
          </View>
        ) : (
          <FlatList
            data={bestPuttData}
            renderItem={SessionCard}
            keyExtractor={item => item.id}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <Button
                  onPress={() =>
                    navigation.navigate('PuttingSession', {
                      sessionId: bestPuttData[0].session_id,
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
  },
  subTitle: {
    color: colors.WHITE,
    fontSize: dynamicFonts.f16,
    fontWeight: 500,
  },
  topContainer: {
    margin: 16,
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
});
