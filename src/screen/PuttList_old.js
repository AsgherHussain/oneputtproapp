/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  BackHandler,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// packages
import {ScaledSheet} from 'react-native-size-matters';

// custom component
import TopButtons from '../components/TopButtons';
import CircularProgressComp from '../components/CircularProgressComp';

// api
import {GetPuttListData} from '../Api/DashboardApi';
//redux
import {useSelector, useDispatch} from 'react-redux';
const PuttList = ({navigation, route}) => {
  // const {sessionId} = route.params;
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

          setPuttData(PuttData);
        } else {
          console.log('data not found');
        }
      })
      .catch(err => {
        console.log(err, 'error in PuttList');
      });
  };
  console.log(puttData);
  const PuttCard = ({item, index}) => {
    console.log(puttData);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleItemPress(item)}>
        <View style={[styles.MainContainer]}>
          <View style={styles.DetailsContainer}>
            <Text style={styles.TextContainer}>
              Putt No.: <Text style={styles.subText}>{item.putt_no}</Text>
            </Text>
            <Text style={styles.TextContainer}>
              Date/Time:
              {'\n'}
              <Text style={styles.subText}>{`${item.date}`}</Text>
            </Text>
          </View>
          <View style={styles.CircularContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.outerCircle2}>
                <CircularProgressComp
                  size={9}
                  width={80}
                  fill={Number(item.score_putt)}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.Container}>
        {/* <TopButtons initial={0}/> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('PuttingSession', {sessionId: sessionId})
            }>
            <Text style={styles.btnText}>View Session Performance</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatList}>
          {/* {puttData.length === 0 ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text style={{alignContent:'center'}}>No results found</Text>
  </View>
) : ( */}
          <FlatList
            data={puttData}
            renderItem={PuttCard}
            keyExtractor={item => item.putt_no}
          />
          {/* )} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PuttList;

const styles = ScaledSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fefffe',
  },
  Container2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    marginTop: 2,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151412',
    width: '90%',
    height: '50@mvs',
    padding: 5,
    marginVertical: 2,
    borderRadius: 0,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  MainContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    elevation: 10,
  },
  flatList: {
    margin: 10,
    borderRadius: 0,
    elevation: 20,
    borderColor: '#000000',
  },
  TextContainer: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
    color: '#000000',
  },
  subText: {
    color: '#898887',
    fontWeight: 400,
  },
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderColor: '#E5E5E5',
    borderWidth: 5,
  },
  outerCircle2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
});
