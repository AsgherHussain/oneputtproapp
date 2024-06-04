import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// packages
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';

//custom components
import {PuttingTempo} from '../Section/Dashboard/PuttingTempo';
import {LoftAngle} from '../Section/Dashboard/LoftAngle';
import {FaceAngle} from '../Section/Dashboard/FaceAngle';
import {LieAngle} from '../Section/Dashboard/LieAngle';
import {AccelerationImpact} from '../Section/Dashboard/AccelerationImpact';
import {PutterFaceImpact} from '../Section/Dashboard/PutterFaceImpact';
import CircularProgressComp from '../components/CircularProgressComp';

const DetailsScreen = ({navigation}) => {
  const [progress, setProgress] = React.useState(85);
  const [isActive, setIsActive] = React.useState(true);
  const [showLoft, setShowLoft] = React.useState(true);
  const [showFaceAngle, setShowFaceAngle] = React.useState(true);
  const [showFaceImpact, setShowFaceImpact] = React.useState(true);
  const [showLieAngle, setShowLieAngle] = React.useState(true);
  const [showAccele, setShowAccele] = React.useState(true);

  return (
    <SafeAreaView style={styles.Container}>
      <ScrollView>
        <View style={styles.circularProgress}>
          <CircularProgressComp
            size={15}
            width={120}
            style={styles.progressPer}
            fill={Number(progress)}
          />
          <Text style={styles.circularMainText}>Putt Number {5}</Text>
          <Text style={styles.circularSubText}>({6} ft)</Text>
        </View>
        <View style={styles.TopViewContainer}>
          <View style={styles.TopViewSubContainer}>
            <Text style={styles.TopViewText}>Top View</Text>
          </View>
          <View style={[styles.circularProgress, styles.TopViewGraph]}>
            <Text style={styles.graphText}>Graph yet to display</Text>
          </View>
        </View>
        {/* tiles start here */}
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
            val={2.1}
            onPressCollapse={() => setShowLoft(!showLoft)}
            IsActive={showLoft}
          />
          <Collapsible collapsed={showLoft} align="center">
            <LoftAngle loftAng={1} />
          </Collapsible>
        </View>
        <View>
          <CollapsibleHeader
            title={'Putter Face Angle'}
            val={2.1}
            onPressCollapse={() => setShowFaceAngle(!showFaceAngle)}
            IsActive={showFaceAngle}
          />
          <Collapsible collapsed={showFaceAngle} align="center">
            <FaceAngle faceAng={+2} />
          </Collapsible>
        </View>
        <View>
          <CollapsibleHeader
            title={'Putter Face Impact'}
            val={2.1}
            onPressCollapse={() => setShowFaceImpact(!showFaceImpact)}
            IsActive={showFaceImpact}
          />
          <Collapsible collapsed={showFaceImpact} align="center">
            <PutterFaceImpact faceImpact={2} />
          </Collapsible>
        </View>
        <View>
          <CollapsibleHeader
            title={'Lie Angle Position'}
            val={2.1}
            onPressCollapse={() => setShowLieAngle(!showLieAngle)}
            IsActive={showLieAngle}
          />
          <Collapsible collapsed={showLieAngle} align="center">
            <LieAngle />
          </Collapsible>
        </View>
        <View>
          <CollapsibleHeader
            title={'Acceleration Impact'}
            val={2.1}
            onPressCollapse={() => setShowAccele(!showAccele)}
            IsActive={showAccele}
          />
          <Collapsible collapsed={showAccele} align="center">
            <AccelerationImpact />
          </Collapsible>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;

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
            backgroundColor: 'red',
            color: 'white',
            height: 25,
            width: 50,
            textAlign: 'center',
            marginRight: 10,
          }}>
          {' '}
          {val}
        </Text>
        <Ionicons name={!IsActive ? 'up' : 'down'} color={'white'} size={26} />
      </View>
    </Animatable.View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  circularProgress: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  progressPer: {
    color: '#000000',
  },
  circularMainText: {
    color: '#000000',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 'bold',
  },
  circularSubText: {
    color: '#000000',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
  },
  TopViewContainer: {
    padding: 10,
    marginTop: 20,
  },
  TopViewSubContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e4e2',
  },
  graphText: {
    color: '#FCD12A',
  },
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
});
