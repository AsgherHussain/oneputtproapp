import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

//packages
import Ionicons from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LineChart, XAxis, YAxis} from 'react-native-svg-charts';
import Collapsible from 'react-native-collapsible';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
// custom component
import {PuttingTempo} from '../Section/Dashboard/PuttingTempo';
import CircularProgressComp from '../components/CircularProgressComp';
import {LoftAngle} from '../Section/Dashboard/LoftAngle';
import {FaceAngle} from '../Section/Dashboard/FaceAngle';
import {PutterFaceImpact} from '../Section/Dashboard/PutterFaceImpact';
import {LieAngle} from '../Section/Dashboard/LieAngle';
import {AccelerationImpact} from '../Section/Dashboard/AccelerationImpact';

import commonstyle from '../styles/style';

//api
import {GetSinglePuttData} from '../Api/DashboardApi';
import {Rect, Svg} from 'react-native-svg';

const SinglePuttData = ({route}) => {
  const {puttNo} = route.params;

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedTooltipId, setSelectedTooltipId] = useState(null);
  const [tooltipVisibleAngle, setTooltipVisibleAngle] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showLoft, setShowLoft] = useState(false);
  const [showFaceAngle, setShowFaceAngle] = useState(false);
  const [showFaceImpact, setShowFaceImpact] = useState(false);
  const [showLieAngle, setShowLieAngle] = useState(false);
  const [showAccele, setShowAccele] = useState(false);
  const [singlePuttData, setSinglePuttData] = useState([]);

  const [LoftAngleData, setLoftAngleData] = useState(0);
  const [PutterFaceData, setPutterFaceData] = useState(0);
  const [PutterFaceImpactdata, setPutterFaceImpact] = useState(0);
  const [LieAngleStart, setLieAngleStart] = useState(0);
  const [LieAngleEnd, setLieAngleEnd] = useState(0);
  const [Accelration, setAccelration] = useState(0);

  const [frontStrokData, setFrontStrokeData] = useState([]);
  const [backStrokeData, setBackStrokeData] = useState([]);

  // graph data
  // graph data
  const data = [
    {data: frontStrokData, svg: {stroke: '#991e21', strokeWidth: 5}},
    {
      data: backStrokeData,
      svg: {stroke: '#00FF00', strokeWidth: 5},
    },
  ];
  const datay = [-0.4, -0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3];
  const datax = [-0.35, -0.3, -0.25, -0.2, -0.15, -0.1, -0.05];

  //getsingleputtData
  useEffect(() => {
    GetPuttData();
  }, []);
  const GetPuttData = () => {
    GetSinglePuttData(puttNo)
      .then(res => {
        if (res.status === 200) {
          let singlePuttData = res.data.data;
          setSinglePuttData(singlePuttData);
          setLoftAngleData(parseFloat(singlePuttData.loft_angle.toFixed(2)));
          setPutterFaceData(singlePuttData.putter_face_ang.toFixed(2));
          setPutterFaceImpact(
            parseFloat(singlePuttData.elevation_at_imp.toFixed(2)),
          );
          setLieAngleStart(parseFloat(singlePuttData.ang_lie_start.toFixed(2)));
          setLieAngleEnd(parseFloat(singlePuttData.ang_lie_imp.toFixed(2)));
          setAccelration(singlePuttData.acceleration_impact.toFixed(2));

          //graph values
          const frontStroke = JSON.parse(singlePuttData.front_stroke);
          const backStroke = JSON.parse(singlePuttData.back_stroke);

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
        } else {
          console.log('error in singleputdata');
        }
      })
      .catch(err => {
        console.log(err, 'error in singlePuttData');
      });
  };

  const CollapsibleHeader = ({
    tooltipTitle,
    title,
    val,
    onPressCollapse,
    IsActive,
    id,
  }) => (
    <TouchableOpacity onPress={onPressCollapse} activeOpacity={0.9}>
      <Animatable.View
        duration={400}
        style={[styles.header, IsActive ? styles.active : styles.inactive]}
        transition="backgroundColor">
        <LinearGradient
          colors={['#101010', '#444444']}
          locations={[0.02, 1]}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            padding: 9,
            alignItems: 'center',
            borderRadius: 0,
            elevation: 4,
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <Text style={styles.headerText}>{title}</Text>
          <View style={{flexDirection: 'row'}}>
          <View style={styles.TooltipContainer}>
              <View style={styles.TopView}>
              <MaterialCommunityIcons
                    name="information"
                    color="#FFFFFF"
                    size={
                      Dimensions.get('screen').width > 799
                        ? 24
                        : Dimensions.get('screen').width < 480
                        ? 18
                        : 21
                    }
                    onPress={() => showTooltipAngle(id)}
                  />
              </View>
              {tooltipVisibleAngle && selectedTooltipId === id && (
                <Tooltip
                isVisible={tooltipVisibleAngle}
                content={
                  <TouchableOpacity
                    style={styles.modalDropDownView}
                    onPress={hideTooltipAngle}>
                    <Text style={styles.modalDropDowText}>
                     {tooltipTitle}
                    </Text>
                  </TouchableOpacity>
                }
                onClose={hideTooltipAngle}
                placement="top"
                childContentSpacing={10}
                topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                <View />
              </Tooltip>
              )}
            </View>
            <Text
              style={{
                backgroundColor: '#ad0004',
                color: '#FFFFFF',
                fontSize: 16,
                paddingTop: 1,
                verticalAlign: 'top',
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
              size={
                Dimensions.get('screen').width > 799
                  ? 24
                  : Dimensions.get('screen').width < 480
                  ? 18
                  : 21
              }
            />
          </View>
        </LinearGradient>
      </Animatable.View>
    </TouchableOpacity>
  );

  const showTooltip = () => {
    setTooltipVisible(true);
  };
  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  const showTooltipAngle = id => {
    setSelectedTooltipId(id);
    setTooltipVisibleAngle(true);
  };
  const hideTooltipAngle = () => {
    setSelectedTooltipId(null);
    setTooltipVisibleAngle(false);
  };

  return (
    <>
      <SafeAreaView style={styles.Container}>
        <ScrollView>
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
            <Text style={styles.circularSubText}>
              ({singlePuttData.ftDistance} ft)
            </Text>
          </View>
          <View style={styles.TopViewContainer}>
            <View style={styles.TopViewSubContainer}>
            <View style={styles.TooltipContainer}>
              <View style={styles.TopView}>
                <Text style={styles.TopViewText}>
                  Top View{' '}
                  <MaterialCommunityIcons
                    name="information"
                    color="#000000"
                    size={
                      Dimensions.get('screen').width > 799
                        ? 24
                        : Dimensions.get('screen').width < 480
                        ? 18
                        : 21
                    }
                    onPress={showTooltip}
                  />
                </Text>
              </View>

              <Tooltip
                isVisible={tooltipVisible}
                content={
                  <TouchableOpacity
                    style={styles.modalDropDownView}
                    onPress={hideTooltip}>
                    <Text style={styles.modalDropDowText}>
                      The path followed by putter head
                    </Text>
                  </TouchableOpacity>
                }
                onClose={hideTooltip}
                placement="top"
                childContentSpacing={60}
                topAdjustment={10}
                tooltipStyle={{left:10}}
                arrowStyle={{left:65}}
                // topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                <View />
              </Tooltip>
            </View>
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
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={'The ratio between front to backstroke'}
              title={'PuttingTempo'}
              val={2.1}
              onPressCollapse={() => setIsActive(!isActive)}
              IsActive={isActive}
              id={1}
            />
            <Collapsible collapsed={isActive} align="center">
              <PuttingTempo greenText={2.1} redText={2.4} />
            </Collapsible>
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={
                'Determines the spin applied on the golf ball.(Forword/Backward)'
              }
              title={'Loft Angle'}
              val={LoftAngleData}
              onPressCollapse={() => setShowLoft(!showLoft)}
              IsActive={showLoft}
              id={2}
            />
            <Collapsible collapsed={showLoft} align="center">
              <LoftAngle loftAng={LoftAngleData} />
            </Collapsible>
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={
                'Determines if the face of putter is square, open or closed'
              }
              title={'Putter Face Angle'}
              val={PutterFaceData}
              onPressCollapse={() => setShowFaceAngle(!showFaceAngle)}
              IsActive={showFaceAngle}
              id={3}
            />
            <Collapsible collapsed={showFaceAngle} align="center">
              <FaceAngle faceAng={PutterFaceData} />
            </Collapsible>
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={
                'Determines the impact point difference from centre of putter'
              }
              title={'Putter Face Impact'}
              val={PutterFaceImpactdata}
              onPressCollapse={() => setShowFaceImpact(!showFaceImpact)}
              IsActive={showFaceImpact}
              id={4}
            />
            <Collapsible collapsed={showFaceImpact} align="center">
              <PutterFaceImpact faceImpact={PutterFaceImpactdata} />
            </Collapsible>
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={
                'Angle at which the putter is held with relation to the ground'
              }
              title={'Lie Angle Position'}
              val={LieAngleStart}
              onPressCollapse={() => setShowLieAngle(!showLieAngle)}
              IsActive={showLieAngle}
              id={5}
            />
            <Collapsible collapsed={showLieAngle} align="center">
              <LieAngle lieAng={LieAngleStart} lieEnd={LieAngleEnd} />
            </Collapsible>
          </View>
          <View style={commonstyle.mb10}>
            <CollapsibleHeader
              tooltipTitle={
                'The acceleration determines the distance covered by the golf ball'
              }
              title={'Acceleration Impact'}
              val={Accelration}
              onPressCollapse={() => setShowAccele(!showAccele)}
              IsActive={showAccele}
              id={6}
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

export default SinglePuttData;

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
    width: 100,
    fontWeight: 'bold',
    fontSize: 15,
  },
  TopViewGraph: {
    height: 120,
  },
  header: {
    marginTop: 5,
    marginHorizontal: 20,
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
  modalDropDownView: {
    margin: 2,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 1,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // width: Dimensions.get('screen').width * 0.35,
    // alignSelf: 'flex-end',
  },
  modalDropDowText: {
    fontSize: Dimensions.get('screen').width * 0.035,
    padding: 2,
    color: '#000000',
  },

  TopView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
