import React, {useState} from 'react';
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
} from 'react-native';

import {TextInput} from 'react-native-gesture-handler';
import {DataTable} from 'react-native-paper';
import {Formik} from 'formik';
import * as yup from 'yup';
const tableDa = [
  {
    name: 'Angle of Lie Start',
    target: [1.0, 1.5, 2.0],
    deviation: 2.0,
  },
  {
    name: 'Angle of Lie Impact',
    target: [1.0, 1.5, 2.0],
    deviation: 1.0,
  },
  {
    name: 'Loft Angle',
    target: [3.5, 4.0, 4.5],
    deviation: 2.2,
  },
  {
    name: 'Acceleration Impact',
    target: [0.0],
    deviation: '1m/s',
  },
];
//local Component
import SliderComp from '../components/SliderComp';
const OpenSetting = ({navigation}) => {
  const [number, onChangeNumber] = useState('');
  const [sliderValue, setSliderValue] = useState(3);
  const [isEnabled, setIsEnabled] = useState(false);
  const [tableData, setTableData] = useState(tableDa);
  const [nameError, setNameError] = useState('');

  const toggleSwitch = (value, index) => {
    // const data = [...tableData];
    setIsEnabled(previousState => !previousState);
  };

  const onSwitchChange = () => {};

  const onPressStartSession = () => {
    navigation.navigate('startpractice', {Sessiontime: sliderValue});
  };

  return (
    <>
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView enabled>
            <View style={styles.container}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000000',
                  fontWeight: '600',
                  marginTop: 5,
                }}>
                Set Distance
              </Text>
              <View style={styles.box}>
                <Text style={styles.boxMainText}> {sliderValue} Feet</Text>
                <Text style={styles.boxSubText}> Putting Distance</Text>
              </View>
              <View style={styles.sliderContainer}>
                <SliderComp
                  option={{
                    startRange: 3,
                    finalRange: 12,
                    startLabel: '3ft',
                    finalLabel: '12ft',
                    betweenLabel1: '6ft',
                    betweenLabel2: '9ft',
                  }}
                  setSliderValue={setSliderValue}
                />
              </View>

              <View style={{padding: 10}}>
                <DataTable style={styles.dataTable}>
                  <DataTable.Header>
                    <DataTable.Title style={{flex: 2}} />
                    <DataTable.Title numeric>
                      <Text style={{fontWeight: 'bold'}}>Deviation</Text>
                    </DataTable.Title>
                    <DataTable.Title numeric>
                      {' '}
                      <Text style={{fontWeight: 'bold'}}>Target</Text>
                    </DataTable.Title>
                    <DataTable.Title />
                  </DataTable.Header>
                  {tableData.map(({name, target, deviation}, index) => (
                    <TableRow
                      name={name}
                      target={target}
                      deviation={deviation}
                      onSwitchChange={onSwitchChange}
                      key={index}
                      index={index}
                      toggleSwitch={toggleSwitch}
                      isEnabled={isEnabled}
                    />
                  ))}
                </DataTable>
              </View>
              <View style={styles.btn}>
                <Button
                  onPress={onPressStartSession}
                  title="Save"
                  color="#991e21"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </>
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
}) => (
  <DataTable.Row style={{height: 60}}>
    <DataTable.Cell style={{flex: 2}}>
      <Text>{name}</Text>
    </DataTable.Cell>
    <DataTable.Cell numeric>
      <View>
        {target && target.map((val, i) => <Text key={i}> {val}</Text>)}
      </View>
    </DataTable.Cell>
    <DataTable.Cell numeric>{deviation}</DataTable.Cell>
    <DataTable.Cell numeric>
      <Switch
        trackColor={{false: '#767577', true: '#767577'}}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={val => toggleSwitch(val, index)}
        value={isEnabled}
      />
    </DataTable.Cell>
  </DataTable.Row>
);
export default OpenSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 5,
    //   paddingTop: Constants.statusBarHeight,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    paddingVertical: 20,
    // height: 150,
    backgroundColor: '#ffffff',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    borderRadius: 5,
    elevation: 5,
  },
  boxMainText: {
    color: '#991e21',
    fontSize: 21,
  },
  boxSubText: {
    fontSize: 16,
    paddingTop: 5,
    color: '#000000',
  },
  sliderContainer: {
    marginTop: 15,
    // marginBottom: 10,
  },

  InputContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  InputText: {
    alignContent: 'center',
    justifyContent: 'center',
    color: '#000000',
    paddingLeft: 10,
    flexGrow: 1,
  },
  input: {
    // flex: 1,
    height: 40,
    color: '#000000',
    width: 50,
    margin: 12,
    borderWidth: 2,
    borderColor: '#e5e4e2',
    borderRadius: 5,
    marginLeft: 20,
    flexGrow: 4,
  },
  dataTable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e5e4e2',
    elevation: 4,
  },
  btn: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 1,
    elevation: 2,
    marginTop: 10,
    // backgroundColor: '#991e21',
  },
  error: {
    color: 'red',
    marginBottom: 5,
  },
});
