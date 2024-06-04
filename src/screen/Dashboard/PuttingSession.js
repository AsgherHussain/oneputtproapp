/* eslint-disable react-hooks/exhaustive-deps */
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  NativeEventEmitter,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import React, {useEffect, useState} from 'react';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import Spacing from '../../components/Spacing';
import {GetSessionPerformaceData} from '../../Api/DashboardApi';
import {APP_TEXT} from '../../config/typography';
import colors from '../../styles/colors';
import {dynamicFonts} from '../../helpers/constants';

const {width, height} = Dimensions.get('screen');
const yLabels = ['0°', '30°', '40°'];
class BackPressEventEmitter extends NativeEventEmitter {
  addListener(eventType, listener) {
    // Your custom logic for adding a listener
    return super.addListener(eventType, listener);
  }

  remove() {
    // Your custom logic for removing a listener
    // Make sure to handle removing the listener correctly
  }
}
const PuttingSession = ({route}) => {
  const {sessionId} = route.params;
  const screenWidth = Dimensions.get('window').width - 60;
  const [activeSections, setActiveSections] = useState([0]);
  // const [SessionData, setSessionData] = useState([]);
  const [Label, setLabel] = useState([]);
  const [Values, setValues] = useState([]);
  const [PuttLabel, setPuttLabel] = useState([]);
  const [PuttValues, setPuttValues] = useState([]);
  const [FaceLabel, setFaceLabel] = useState([]);
  const [FaceValues, setFaceValues] = useState([]);
  const [lieAngleLabel, setlieAngleLabel] = useState([]);
  const [lieAngleValues, setlieAngleValues] = useState([]);
  const [AccelerationLabel, setAccelerationLabel] = useState([]);
  const [AccelerationValues, setAccelerationValues] = useState([]);
  const [ImpactPositionLabel, setImpactPositionLabel] = useState([]);
  const [ImpactPositionValues, setImpactPositionValues] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getSessionData();
  }, []);

  useEffect(() => {
    console.log('PuttingSession useEffect');

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

    return true; // Prevent default back behavior
  };

  const getSessionData = () => {
    GetSessionPerformaceData(sessionId)
      .then(res => {
        const labels = [];
        const vdata = [];

        res.data.data.loft_angle.forEach(function (arrayItem) {
          labels.push(arrayItem.index);
          vdata.push(arrayItem.value);
        });
        setLabel(labels);
        setValues(vdata);

        const puttlabels = [];
        const PuttData = [];

        res.data.data.putting_tempo.forEach(function (item) {
          puttlabels.push(item.index);
          PuttData.push(Number(item.value));
        });

        setPuttLabel(puttlabels);
        setPuttValues(PuttData);

        const faceAnglelabels = [];
        const faceAngledata = [];

        res.data.data.face_angle_impact.forEach(function (items) {
          faceAnglelabels.push(items.index);
          faceAngledata.push(items.value);
        });
        setFaceLabel(faceAnglelabels);
        setFaceValues(faceAngledata);

        const lieAnglelabels = [];
        const lieAngledata = [];

        res.data.data.lie_angle_change.forEach(function (items) {
          lieAnglelabels.push(items.index);
          lieAngledata.push(items.value);
        });
        setlieAngleLabel(lieAnglelabels);
        setlieAngleValues(lieAngledata);

        const Accelerationlabels = [];
        const Accelerationdata = [];

        res.data.data.acceleration_impact.forEach(function (items) {
          Accelerationlabels.push(items.index);
          Accelerationdata.push(items.value);
        });
        setAccelerationLabel(lieAnglelabels);
        setAccelerationValues(lieAngledata);

        const ImpactPositionlabels = [];
        const ImpactPositiondata = [];

        res.data.data.impact_position.forEach(function (items) {
          ImpactPositionlabels.push(items.index);
          ImpactPositiondata.push(items.value);
        });
        setImpactPositionLabel(ImpactPositionlabels);
        setImpactPositionValues(ImpactPositiondata);
      })

      .catch(err => {});
  };

  // const graphdata = {
  //   labels: [1, 2, 3, 4, 5, 6],
  //   datasets: [
  //     {
  //       data: [-20, 45, 28, -4, 99, 43],
  //       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
  //       strokeWidth: 2,
  //     },
  //   ],
  // };
  const graphdataLoftAngle = {
    labels: Label,
    datasets: [
      {
        data: Values,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };
  const graphdataPuttingTempo = {
    labels: PuttLabel,
    datasets: [
      {
        data: PuttValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  const graphdataFaceAngle = {
    labels: FaceLabel,
    datasets: [
      {
        data: FaceValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  const graphdatalieAnglechange = {
    labels: AccelerationLabel,
    datasets: [
      {
        data: AccelerationValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  const graphdataaccelerationImpact = {
    labels: ImpactPositionLabel,
    datasets: [
      {
        data: lieAngleValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  const graphdataImpactPosition = {
    labels: lieAngleLabel,
    datasets: [
      {
        data: lieAngleValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
        strokeWidth: 2,
      },
    ],
  };

  const CONTENT = [
    {
      title: 'Loft Angle',
      content: graphdataLoftAngle,
      yAxisLabel: 'Loft Angle',
      labels: lieAngleLabel,
      values: lieAngleValues,
    },
    {
      title: 'Putting Tempo',
      content: graphdataPuttingTempo,
      yAxisLabel: 'Tempo',
      labels: PuttLabel,
      values: PuttValues,
    },

    {
      title: 'Face Angle Impact',
      content: graphdataFaceAngle,
      yAxisLabel: 'Face Angle',
      labels: FaceLabel,
      values: FaceValues,
    },
    {
      title: 'Lie Angle Change',
      content: graphdatalieAnglechange,
      yAxisLabel: 'Lie Angle',
      labels: AccelerationLabel,
      values: AccelerationValues,
    },
    // {
    //   title: 'Acceleration Impact',
    //   content: graphdataaccelerationImpact,
    //   yAxisLabel: 'Accele Impact',
    // },
    {
      title: 'Impact Position',
      content: graphdataImpactPosition,
      yAxisLabel: 'Impact Posi',
      labels: [],
      values: [],
    },
  ];

  const chartConfig = {
    // yAxisLabel: (label) => parseFloat(label).toFixed(2),
    // decimalPlaces: 2,
    // yAxisInterval: 0.5, // Set the interval between y-axis labels and grid lines
    decimalPlaces: 2, // Number of decimal places to display
    // minValue: 1, // Minimum value for y-axis
    // maxValue: 4,
    backgroundColor: '#fff',
    backgroundGradientFrom: '#202020',
    backgroundGradientTo: '#202020',
    fillShadowGradientFrom: '#c10106',
    fillShadowGradientTo: '#c10106',
    fillShadowGradientFromOpacity: 0.5,
    fillShadowGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    stroke: '#000',
    propsForDots: {
      r: '2',
      strokeWidth: '1',
      stroke: '#d30000',
    },
  };

  const setSections = sections => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <LinearGradient
          colors={['#fff']}
          locations={[1]}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            padding: 12,
            alignItems: 'center',
            borderRadius: 8,
            elevation: 4,
            paddingVertical: 20,
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={styles.headerText}>{section.title}</Text>
          <Ionicons
            name={'up'}
            color={colors.BLACK}
            size={
              Dimensions.get('screen').width > 799
                ? 24
                : Dimensions.get('screen').width < 480
                ? 18
                : 21
            }
          />
        </LinearGradient>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    if (section.title === 'Impact Position') {
      return (
        <Animatable.View
          duration={400}
          style={[styles.content, isActive ? styles.active : styles.inactive]}
          transition="backgroundColor">
          {/* <Animatable.Text animation={isActive ? 'pulse' : undefined} > */}
          {/* {section.content} */}
          <ScrollView>
            <View style={{flexDirection: 'row', margin: 10}}>
              <Image
                source={require('../../../assets/impact-position-image.png')}
                style={{height: height / 10, width: height / 10}}
                resizeMode="stretch"
              />
              <View style={{padding: 4}}>
                <View style={styles.flexDiv}>
                  <Text style={styles.viewTitle}>Not Good</Text>
                  <FontAwesome5Icon
                    name="heart-broken"
                    size={16}
                    color={colors.RED}
                    style={{marginLeft: 12}}
                  />
                </View>

                <Text style={{fontSize: dynamicFonts.f14}}>
                  Some Points you Should Take Care About
                </Text>
                <Text style={styles.subListText}>Dummy Text 1</Text>

                <Text style={styles.subListText}>Dummy Text 2</Text>

                <Text style={styles.subListText}>Dummy Text 3</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.yAxisLabelContainer}>
            <Text style={styles.yAxisLabel}>{section.yAxisLabel}</Text>
          </View>
        </Animatable.View>
      );
    }
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        {/* <Animatable.Text animation={isActive ? 'pulse' : undefined} > */}
        {/* {section.content} */}
        {/* {section.title === 'Loft Angle' && (
          <View style={styles.loftDiv}>
            <Image
              source={require('../../../assets/loftangle-image.png')}
              style={styles.loftDivImage}
              resizeMode="stretch"
            />
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: dynamicFonts.f16}}>Final</Text>
              <Text style={styles.subTitleDegree}>32°</Text>
            </View>
          </View>
        )} */}
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: section.labels,
              datasets: [{data: section.values}],
            }}
            bezier
            fromZero
            transparent
            width={Dimensions.get('window').width / 1.1}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(200, 25, 31, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              formatYLabel: val => {
                return 'Test';
              },
            }}
            yAxisLabel={section.labels}
          />
        </ScrollView>
        {/* </Animatable.Text> */}
        <View style={styles.yAxisLabelContainer}>
          <Text style={styles.yAxisLabel}>{section.yAxisLabel}</Text>
        </View>
        {/* <View style={styles.xAxisLabelContainer}>
          <Text style={styles.xAxisLabel}>Putt No.</Text>
        </View> */}
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topSection}>
        <Spacing height={8} />
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => navigation.goBack()}>
            <Icon name="keyboard-backspace" size={30} color={colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.title}>{APP_TEXT.puttList.sessionTracker}</Text>
          <Spacing height={8} />
        </View>
      </View>
      <View style={styles.body}>
        <ScrollView>
          {Values.length > 0 &&
            FaceValues.length > 0 &&
            lieAngleValues.length > 0 &&
            AccelerationValues.length > 0 &&
            ImpactPositionValues.length > 0 && (
              <Accordion
                activeSections={activeSections}
                sections={CONTENT}
                touchableComponent={TouchableOpacity}
                renderHeader={renderHeader}
                renderContent={renderContent}
                // duration={100}
                onChange={setSections}
                renderAsFlatList={false}
              />
            )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PuttingSession;

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: colors.RED},
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    //   paddingTop: Constants.statusBarHeight,
  },
  header: {
    marginTop: 5,
    marginHorizontal: 20,
    borderRadius: 5,
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },
  headerText: {
    textAlign: 'left',
    fontSize: dynamicFonts.f16,
    fontWeight: '500',
    color: colors.BLACK,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisLabelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  yAxisLabel: {
    transform: [{rotate: '-90deg'}],
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    padding: 3,
  },
  xAxisLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xAxisLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
  },
  topSection: {
    flex: 0.15,
    backgroundColor: colors.RED,
    // ma: 20,
  },
  topContainer: {
    textAlign: 'center',
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: colors.WHITE,
    position: 'absolute',
    left: 4,
  },
  title: {
    color: colors.WHITE,
    fontWeight: 500,
    fontSize: dynamicFonts.h1,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  body: {
    paddingTop: 30,
    flex: 0.85,
    backgroundColor: '#E3E3E3',
    borderTopLeftRadius: 40,
  },
  flexDiv: {flexDirection: 'row', alignItems: 'center'},
  viewTitle: {
    fontSize: dynamicFonts.h2,
    color: colors.RED,
    marginBottom: 4,
    fontWeight: '600',
  },
  subListText: {fontSize: dynamicFonts.f12},
  loftDiv: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 12,
  },
  loftDivImage: {
    height: height / 11,
    width: height / 12,
    alignSelf: 'flex-start',
  },
  subTitleDegree: {
    fontSize: dynamicFonts.h,
    color: colors.RED,
    fontWeight: '600',
  },
});
