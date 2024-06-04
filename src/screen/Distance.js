import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewBase,
  Switch,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {DataTable} from 'react-native-paper';
import {RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';

//local Component
import SliderComp from '../components/SliderComp';
import NumberButton from '../components/NumberButton';
import {getLoginData} from '../helpers/asyncStorage';
import {selectMacAddress} from '../Service/slice';
import {dynamicFonts} from '../helpers/constants';
import Spacing from '../components/Spacing';
import {APP_TEXT} from '../config/typography';

const tableDa = [
  {name: 'Angle of Lie Start', target: '70', deviation: '5', isEnabled: false},
  {name: 'Angle of Lie Impact', target: '70', deviation: '5', isEnabled: false},
  {name: 'Loft Angle', target: '70', deviation: '5', isEnabled: false},
  {name: 'Acceleration Impact', target: '2', deviation: '2', isEnabled: false},
];

const {height} = Dimensions.get('screen');

const Distance = ({navigation, route}) => {
  const [number, onChangeNumber] = useState('');
  const [sessionName, onChangeSessionName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [sliderValue, setSliderValue] = useState(3);
  const [isEnabled, setIsEnabled] = useState(false);
  const [tableData, setTableData] = useState(tableDa);
  const [nameError, setNameError] = useState('');

  //redux
  var macAddress = useSelector(selectMacAddress);
  const [userId, setUserId] = useState();
  const onRefresh = useCallback(() => {
    // Perform any refreshing logic here
    setRefreshing(true);

    // For example, you can reset your fields or fetch new data

    // After refreshing alogic is done, set refreshing to false
    setRefreshing(false);
  }, []);
  useEffect(() => {
    // Reset your component state here when refreshing
    if (refreshing) {
      onChangeNumber('');
      onChangeSessionName('');
      setSliderValue(3);
      setIsEnabled(false);
      setTableData(tableDa);
      setNameError('');
      setUserId(null);
    }
  }, [refreshing]);
  useEffect(() => {
    console.log('in useeffect in distance');
    (async () => {
      const data = await getLoginData();
      setUserId(data.user_id);
    })();
  }, [route]);

  const toggleSwitch = (value, index) => {
    // const data = [...tableData];
    setIsEnabled(previousState => !previousState);
  };

  const onSwitchChange = (index, isEnabled) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].isEnabled = isEnabled;
    console.log(updatedTableData, '999999999999');
    setTableData(updatedTableData);
  };

  const onPressStartSession = () => {
    const deviationValues = tableData.map(item => item.deviation);
    const targetValues = tableData.map(item => item.target);
    const isEnabledValues = tableData.map(item => item.isEnabled.toString()); // Convert boolean values to strings
    let scoreData = new Array(12);
    scoreData[0] = deviationValues[0];
    scoreData[1] = targetValues[0];
    scoreData[2] = isEnabledValues[0];
    scoreData[3] = deviationValues[1];
    scoreData[4] = targetValues[1];
    scoreData[5] = isEnabledValues[1];
    scoreData[6] = deviationValues[2];
    scoreData[7] = targetValues[2];
    scoreData[8] = isEnabledValues[2];
    scoreData[9] = deviationValues[3];
    scoreData[10] = targetValues[3];
    scoreData[11] = isEnabledValues[3];

    // scoreData[0] = deviationValues[0];
    // scoreData[1] = targetValues[0];
    // scoreData[2] = deviationValues[1];
    // scoreData[3] = targetValues[1];
    // scoreData[4] = deviationValues[2];
    // scoreData[5] = targetValues[2];
    // scoreData[6] = deviationValues[3];
    // scoreData[7] = targetValues[3];

    // const scoreData = tableData.map(item => ({
    //   deviation: item.deviation,
    //   target: item.target,
    //   isEnabled: item.isEnabled,
    //   name: item.name,
    // }));
    // Check if macAddress is available
    if (!macAddress) {
      if (global.MyVar != null) {
        macAddress = global.MyVar;
      } else {
        alert('Please First Connect Your Device');
        return;
      }
    }

    // Check if session time is provided
    if (!number || number == 0) {
      alert('Session time is required');
      return;
    }

    // Check if session time is an integer
    if (!Number.isInteger(parseFloat(number))) {
      alert('Time must be an integer');
      return;
    }

    // Check if session time is greater than 0
    if (parseInt(number) <= 0) {
      alert('Session time must be greater than 0');
      return;
    }

    // If all checks pass, navigate to 'startpractice'
    if (Platform.OS === 'android') {
      navigation.navigate('startpractice', {
        sliderValue: sliderValue,
        sessionName: sessionName,
        Sessiontime: number,
        macAddress: macAddress,
        scoreData: scoreData,
        userId: userId,
      });
    } else {
      navigation.navigate('startpractice', {
        sliderValue: String(sliderValue),
        sessionName: sessionName,
        Sessiontime: number,
        macAddress: macAddress,
        scoreData: String(scoreData),
        userId: String(userId),
      });
    }
  };

  const handleDeviationUpdate = (index, deviation) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].deviation = deviation;
    setTableData(updatedTableData);
  };
  const handleTargetUpdate = (index, target) => {
    const updatedTableData = [...tableData];
    updatedTableData[index].target = target;
    setTableData(updatedTableData);
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <KeyboardAvoidingView enabled>
          <View style={styles.container}>
            <Text style={styles.heading}>{APP_TEXT.practice.practice}</Text>
            <Spacing height={30} />

            <View style={styles.flexbox}>
              <View style={{flex: 1}}>
                <View style={styles.box}>
                  <Text style={styles.boxMainText}>
                    {' '}
                    {sliderValue} {APP_TEXT.practice.feet}
                  </Text>
                  <Text style={styles.boxSubText}>
                    {APP_TEXT.practice.puttingDistance}
                  </Text>
                </View>
                <Spacing height={10} />
                <View style={styles.sliderContainer}>
                  <SliderComp
                    value={sliderValue}
                    // option={{
                    //   startRange: 3,
                    //   finalRange: 12,
                    //   startLabel: '3ft',
                    //   finalLabel: '12ft',
                    //   betweenLabel1: '6ft',
                    //   betweenLabel2: '9ft',
                    // }}
                    option={[
                      {id: 4, value: 12, label: '12ft'},
                      {id: 3, value: 9, label: '9ft'},
                      {id: 2, value: 6, label: '6ft'},
                      {id: 1, value: 3, label: '3ft'},
                    ]}
                    maxVal={4}
                    setSliderValue={setSliderValue}
                  />
                </View>
              </View>

              <View style={styles.imageDiv}>
                <Image
                  source={require('../../assets/golf.jpg')}
                  style={styles.image}
                />
              </View>
            </View>

            <View style={styles.InputBox}>
              <Text style={styles.InputHeading}>
                {APP_TEXT.practice.sessionInfo}
              </Text>
              <View style={styles.InputContainer}>
                <Text style={styles.InputText}>
                  {APP_TEXT.practice.setName}
                </Text>

                <TextInput
                  style={styles.input}
                  onChangeText={onChangeSessionName}
                  value={sessionName}
                  placeholder="Session Name"
                  keyboardType="default"
                />
              </View>

              <View style={styles.InputContainer}>
                <Text style={styles.InputText}>
                  {APP_TEXT.practice.setTimeInMin}
                </Text>
                <FlatList
                  style={styles.list}
                  data={Array.from({length: 120}, (_, index) => index + 1)}
                  keyExtractor={item => item.toString()}
                  renderItem={({item}) => (
                    <NumberButton
                      num={item}
                      numSelected={number}
                      onPress={num => onChangeNumber(num)}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            <View style={styles.table}>
              {tableData.map(({name, target, deviation, isEnabled}, index) => (
                <TableRow
                  name={name}
                  target={target}
                  deviation={deviation}
                  onSwitchChange={(index, isEnabled) => {
                    onSwitchChange(index, isEnabled);
                  }}
                  key={index}
                  index={index}
                  toggleSwitch={toggleSwitch}
                  isEnabled={isEnabled}
                  onUpdateDeviation={handleDeviationUpdate}
                  onUpdateTarget={handleTargetUpdate}
                />
              ))}
            </View>
            <View
              style={
                Platform.OS === 'android' ? styles.btnAndroid : styles.btn
              }>
              {Platform.OS === 'android' ? (
                <Button
                  onPress={onPressStartSession}
                  title="Start Practice"
                  color="#991e21"
                />
              ) : (
                <Button
                  onPress={onPressStartSession}
                  title="Start Practice"
                  color="#fff"
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};
const TableRow = ({
  name,
  target,
  deviation,
  onSwitchChange,
  index,
  isEnabled,
  toggleSwitch,
  onUpdateDeviation,
  onUpdateTarget,
}) => {
  const [deviationNew, setDeviation] = useState(deviation);
  const [targetnew, setTarget] = useState(target);

  const handleChange = text => {
    setDeviation(text);
    onUpdateDeviation(index, text);
  };

  const handleChangeTarget = text => {
    setTarget(text);
    onUpdateTarget(index, text);
  };

  return (
    <View style={styles.tableRow}>
      <View style={styles.row}>
        <DataTable.Cell style={{flex: 2}}>
          <Text style={styles.cardHead}>{name}</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Switch
            trackColor={{false: '#e3e2e1', true: '#991e21'}}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'} // Red when enabled, default color when disabled
            ios_backgroundColor="#e3e2e1"
            onValueChange={val => onSwitchChange(index, val)}
            // onValueChange={val => toggleSwitch(val, index)}
            value={isEnabled}
            key={index}
          />
        </DataTable.Cell>
      </View>
      {isEnabled && (
        <View style={styles.row}>
          <View style={styles.accordionCont}>
            <Text style={styles.deviationTitle}>
              {APP_TEXT.practice.deviation}
            </Text>
            <TextInput
              keyboardType="numeric"
              style={[styles.input, styles.boxInput, {marginLeft: 12}]}
              value={targetnew.toString()}
              onChangeText={handleChangeTarget}
            />
          </View>
          <View style={styles.accordionCont}>
            <Text style={{fontSize: dynamicFonts.f14}}>
              {APP_TEXT.practice.target}
            </Text>
            <TextInput
              keyboardType="numeric"
              style={[styles.input, styles.boxInput]}
              value={deviationNew.toString()}
              onChangeText={handleChange}
              maxLength={2}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Distance;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 5,
    //   paddingTop: Constants.statusBarHeight,
  },
  heading: {
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
    marginTop: 8,
    fontSize: dynamicFonts.h1,
  },
  list: {marginLeft: 8, width: '96%', marginVertical: 10},
  box: {
    justifyContent: 'center',
    paddingVertical: 30,
    // height: 150,
    backgroundColor: '#ffffff',
    marginLeft: 12,
    borderRadius: 5,
    elevation: 5,
    padding: 12,
  },
  boxMainText: {
    color: '#000',
    fontSize: dynamicFonts.h2,
    fontWeight: '500',
  },
  boxSubText: {
    fontSize: dynamicFonts.f18,
    paddingTop: 5,
    color: '#000000',
    fontWeight: '300',
  },
  sliderContainer: {
    marginTop: 15,
    // marginBottom: 10,
  },
  InputHeading: {
    fontSize: dynamicFonts.f16,
    padding: 4,
    marginVertical: 16,
  },
  InputBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e5e4e2',
    elevation: 4,
    margin: 10,
    marginTop: 16,
    padding: 10,
  },
  InputContainer: {
    // flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
  },
  InputText: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    flexGrow: 1,
    fontWeight: '400',
    fontSize: dynamicFonts.f14,
  },
  inputTextbox: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 40,
    fontSize: dynamicFonts.f16,
    marginBottom: 1,
    paddingHorizontal: 2,
    width: 'auto',
  },
  input: {
    // flex: 1,
    height: height / 24,
    color: '#000000',
    margin: 12,
    borderWidth: 2,
    borderColor: '#e5e4e2',
    borderRadius: 5,
    flexGrow: 4,
    padding: 5,
    backgroundColor: '#e3e2e1',
    paddingLeft: 6,
    fontSize: dynamicFonts.f14,
    width: '96%',
  },
  dataTable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e5e4e2',
    elevation: 4,
    width: '100%',
  },
  btn: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 1,
    elevation: 2,
    marginTop: 10,
    backgroundColor: '#991e21',
  },
  btnAndroid: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 1,
    elevation: 2,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 5,
  },
  tableRow: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e5e4e2',
    elevation: 4,
    marginTop: 6,
    alignItems: 'center',
    padding: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 6,
  },
  accordionCont: {flex: 1, marginTop: 4},
  cardHead: {
    marginLeft: 12,
    fontSize: dynamicFonts.f16,
  },
  flexbox: {flexDirection: 'row', width: '100%', marginTop: 16},
  image: {
    width: '70%',
    height: height / 2.6,
    borderRadius: 14,
  },
  imageDiv: {flex: 1, alignItems: 'flex-end', marginRight: 12},
  table: {padding: 10},
  deviationTitle: {marginLeft: 12, fontSize: dynamicFonts.f14},
  boxInput: {marginHorizontal: 0, width: '90%'},
});
