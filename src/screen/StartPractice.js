import React, {useState, useReducer, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  NativeModules,
} from 'react-native';
import {decode} from 'base-64';

import Ionicons from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import Collapsible from 'react-native-collapsible';
import {Rect, Svg} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

// custom component
import {PuttingTempo} from '../Section/Dashboard/PuttingTempo';
import CircularProgressComp from '../components/CircularProgressComp';
import {LoftAngle} from '../Section/Dashboard/LoftAngle';
import {FaceAngle} from '../Section/Dashboard/FaceAngle';
import {PutterFaceImpact} from '../Section/Dashboard/PutterFaceImpact';
import {LieAngle} from '../Section/Dashboard/LieAngle';
import {AccelerationImpact} from '../Section/Dashboard/AccelerationImpact';
import {useSelector, useDispatch} from 'react-redux';
import {setCharacteristcs, setDecodeData} from '../Service/slice';

const StartPractice = ({route}) => {
  const navigation = useNavigation();
  // const {PredictClassModule} = ReactNative.NativeModules;
  // const {PredictClassModule} = NativeModules;
  const {Sessiontime} = route.params;
  const [isActive, setIsActive] = useState(true);
  const [showLoft, setShowLoft] = useState(true);
  const [showFaceAngle, setShowFaceAngle] = useState(true);
  const [showFaceImpact, setShowFaceImpact] = useState(true);
  const [showLieAngle, setShowLieAngle] = useState(true);
  const [showAccele, setShowAccele] = useState(true);
  const [singlePuttData, setSinglePuttData] = useState([]);
  const [sensorArray, setSensorArray] = useState([]);
  const [LoftAngleData, setLoftAngleData] = useState(0);
  const [PutterFaceData, setPutterFaceData] = useState(0);
  const [PutterFaceImpactdata, setPutterFaceImpact] = useState(0);
  const [LieAngleStart, setLieAngleStart] = useState(0);
  const [LieAngleEnd, setLieAngleEnd] = useState(0);
  const [Accelration, setAccelration] = useState(0);

  const [frontStrokData, setFrontStrokeData] = useState([]);
  const [backStrokeData, setBackStrokeData] = useState([]);
  const initialSensorArray = [];



  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const gattCharacteristic = useSelector(state => state.auth.character);
  const decoded = useSelector(state => state.auth.decodeData);

  const data = [
    {data: frontStrokData, svg: {stroke: '#FF0000', strokeWidth: 5}},
    {
      data: backStrokeData,
      svg: {stroke: '#00FF00', strokeWidth: 5},
    },
  ];
  const datay = [-0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3];
  const datax = [-0.35, -0.3, -0.25, -0.2, -0.15, -0.1, -0.05];

  useEffect(() => {
    NativeModules.PredictClassModule.startNewActivity()
    .then(result => {
  // Activity started successfully
    })
    .catch(error => {
      console.error(error); // Handle any errors
    });
   
  }, []);

  const handleRead = () => {
    // 28:CD:C1:0A:18:92
  };
  const handleStopSession = () => {
    NativeModules.PredictClassModule.stopSession('28:CD:C1:0A:18:79', (error, result) => {
        if (error) {
          console.error('stopSession', error);
        } else {
    
        }
      },
    );
  };
  const CollapsibleHeader = ({title, val, onPressCollapse, IsActive}) => (
    <TouchableOpacity onPress={onPressCollapse} activeOpacity={0.9}>
      <Animatable.View
        duration={400}
        style={[styles.header, IsActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <Text style={styles.headerText}>{title}</Text>

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              backgroundColor: '#ad0004',
              color: '#FFFFFF',
              fontSize: 16,
              paddingTop: 1,
              verticalAlign: 'center',
              width: 50,
              textAlign: 'center',
              marginHorizontal: 10,
              justifyContent: 'center',
            }}>
            {' '}
            {val}
          </Text>

          <Ionicons
            name={!IsActive ? 'up' : 'down'}
            color={'#FFFFFF'}
            // size={(Dimensions.get('screen').width > 799)
            //   ? 28
            //   : Dimensions.get('screen').width < 480 ? 20 : 24}
          />
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={styles.Container}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button
                title="open settings"
                color="#991e21"
                onPress={() => {
                  navigation.navigate('openSettings');
                }}
              />
              <View style={styles.buttonSpace} />
              <Button
                title="open statistics"
                color="#991e21"
                onPress={() => {
                  navigation.navigate('PuttingSession');
                }}
              />
            </View>
          </View>

          <View style={styles.circularProgress}>
            <View style={styles.outerCircle}>
              <View style={styles.outerCircle2}>
                <CircularProgressComp
                  size={15}
                  width={120}
                  style={styles.progressPer}
                  fill={singlePuttData.score_putt}
                />
              </View>
            </View>
            <Text style={styles.circularMainText}>
              Putt Number{` `}
              {singlePuttData.id}
            </Text>
            <Text style={styles.circularSubText}>({Sessiontime} ft)</Text>
          </View>
          <View style={styles.TopViewContainer}>
            <View style={styles.TopViewSubContainer}>
              <Text style={styles.TopViewText}>Top View</Text>
            </View>
            <View
              style={{
                height: 150,
                margin: 10,
                marginTop: 10,
                flexDirection: 'row',
              }}>
              <YAxis
                style={{marginRight: 5}}
                svg={{
                  fill: '#454545',
                  fontSize: 10,
                  scale: '#454545',
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
                  data={data}
                  style={{flex: 1}}
                  yAccessor={({item}) => item.y}
                  xAccessor={({item}) => item.x}
                  contentInset={{left: 100, right: 20, bottom: 40, top: 100}}
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
              <Text style={styles.label}>FrontStroke</Text>
              <Svg width={10} height={10}>
                <Rect x="0" y="0" width={10} height={10} fill="#FF0000" />
              </Svg>
              <Text style={styles.label}>BackStroke</Text>
            </View>

            <View style={styles.container}>
              <View style={styles.buttonContainer}>
                <Button
                  title="Pause Practice"
                  color="#991e21"
                  onPress={handleRead}
                />
                <View style={styles.buttonSpace} />
                <Button
                  title="Stop Session"
                  color="#991e21"
                  onPress={handleStopSession}
                />
              </View>
            </View>
          </View>
          <View>
            <CollapsibleHeader
              title={'PuttingTempo'}
              val={2.1}
              onPressCollapse={() => setIsActive(!isActive)}
              IsActive={isActive}
            />
            <Collapsible collapsed={isActive} align="center">
              <PuttingTempo greenText={2.1} redText={2.4} />
            </Collapsible>
          </View>
          <View>
            <CollapsibleHeader
              title={'Loft Angle'}
              val={LoftAngleData}
              onPressCollapse={() => setShowLoft(!showLoft)}
              IsActive={showLoft}
            />
            <Collapsible collapsed={showLoft} align="center">
              <LoftAngle loftAng={LoftAngleData} />
            </Collapsible>
          </View>
          <View>
            <CollapsibleHeader
              title={'Putter Face Angle'}
              val={PutterFaceData}
              onPressCollapse={() => setShowFaceAngle(!showFaceAngle)}
              IsActive={showFaceAngle}
            />
            <Collapsible collapsed={showFaceAngle} align="center">
              <FaceAngle faceAng={PutterFaceData} />
            </Collapsible>
          </View>
          <View>
            <CollapsibleHeader
              title={'Putter Face Impact'}
              val={PutterFaceImpactdata}
              onPressCollapse={() => setShowFaceImpact(!showFaceImpact)}
              IsActive={showFaceImpact}
            />
            <Collapsible collapsed={showFaceImpact} align="center">
              <PutterFaceImpact faceImpact={PutterFaceImpactdata} />
            </Collapsible>
          </View>
          <View>
            <CollapsibleHeader
              title={'Lie Angle Position'}
              val={LieAngleStart}
              onPressCollapse={() => setShowLieAngle(!showLieAngle)}
              IsActive={showLieAngle}
            />
            <Collapsible collapsed={showLieAngle} align="center">
              <LieAngle lieAng={LieAngleStart} lieEnd={LieAngleEnd} />
            </Collapsible>
          </View>
          <View>
            <CollapsibleHeader
              title={'Acceleration Impact'}
              val={Accelration}
              onPressCollapse={() => setShowAccele(!showAccele)}
              IsActive={showAccele}
            />
            <Collapsible collapsed={showAccele} align="center">
              <AccelerationImpact />
            </Collapsible>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default StartPractice;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  circularProgress: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
  },
  outerCircle: {
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
    borderColor: 'white',
    borderWidth: 2,
  },
  progressPer: {
    color: '#000000',
  },
  circularMainText: {
    color: '#000000',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 400,
  },
  circularSubText: {
    color: '#000000',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 10,
    fontWeight: 400,
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
    borderBottomColor: '#000',
    width: 70,
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 3,
  },
  TopViewGraph: {
    height: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    padding: 10,
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  headerText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  content: {
    padding: 20,
    backgroundColor: '#3B3C36',
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Graphcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonSpace: {
    width: 10, // Adjust the space width as needed
  },
});

// const macAddress = '28:CD:C1:0A:18:92';
