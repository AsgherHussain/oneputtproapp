import React, {useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  FlatList,
  PermissionsAndroid,
  Alert,

} from 'react-native';

// packages
import {ScaledSheet} from 'react-native-size-matters';
import {BleManager} from 'react-native-ble-plx';
import {setUser} from '../Service/slice';
import {useDispatch} from 'react-redux';
import {setMacAddress} from '../Service/slice';

// stylesheet
import commonstyle from '../styles/style';
import colors from '../styles/colors';
import {Rect, Svg} from 'react-native-svg';

 const bleManager = new BleManager();
const BluetoothDevice = () => {
  const [disconnect, setDisconnect] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const bleManager = useMemo(() => new BleManager(), []);
  const dispatch = useDispatch();
  const [connectedDevice, setConnectedDevice] = useState(null);
 // Add loading state
  useEffect(() => {

    const subscription = bleManager.onStateChange(state => {
      // Handle state changes if needed
    }, true);
    startScanning();
    return () => {
      subscription.remove();
      stopScanning();
      bleManager.destroy();
    };
  }, []);

  const requestBLEPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        if (
          granted['android.permission.BLUETOOTH_CONNECT'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_SCAN'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
       
        } else {
          
        }
      } catch (err) {
        // Handle permission request error
        Alert.alert('Error Requesting Permissions', err.message);
      }
    }
  };

  const startScanning = async () => {
    await requestBLEPermissions();
    setScanning(true);
    setDevices([]);
 
    const scannedDevices = {};

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        if (error.message === 'BluetoothLE is powered off') {
          Alert.alert(
            'Bluetooth Error',
            'Bluetooth is powered off. Please turn it on.',
          );
        } else {
          console.log(`An error occurred: ${error.message}`);
          Alert.alert('Error', `An error occurred: ${error.message}`);
        }
        return;
      }

      // Check if the device with the same MAC address already exists in the scannedDevices object
      if (!scannedDevices[device.id] && device.name !== null) {
        dispatch(setMacAddress(device.id));
        // If it doesn't exist and has a non-'N/A' name, add it to the list and the scannedDevices object
        setDevices(prevDevices => [...prevDevices, device]);
        scannedDevices[device.id] = true;
       
      }
    });

    setTimeout(() => {
      stopScanning();
    }, 2000);
  };


  const stopScanning = () => {
    bleManager.stopDeviceScan();
    dispatch(setMacAddress(null));
    setScanning(false);
  };

  const handleConnect = async (device) => {
    if (device.name === "1puttpro") {
      global.MyVar = device.id;
      // Check if the clicked device is already connected
      if (connectedDevice && connectedDevice.id === device.id) {
        Alert.alert('Error', 'Already connected');
      } else {
        setSelectedDevice(device.id);
  
        // Dispatch the setUser actionr with the device payload
        if (device) {
          await dispatch(setMacAddress(device.id));
          await dispatch(setUser(device.id));
     
          setConnectedDevice(device); // Set the connected device
  
          // Display alert after updating state
          Alert.alert(device.name || 'Device', 'Connected Successfully');
        } else {
          await dispatch(setMacAddress(device.id));
          setConnectedDevice(null); // Clear the connected device
          Alert.alert('Error', 'Already connected');
        }
      }
    } else {
      Alert.alert(device.name || 'Device', 'Cannot connect to this device');
    }
  };

  const handleDisconnect = async device => {
    try {
      if (device) {
        await bleManager.onDeviceDisconnected(device.id);
        setSelectedDevice(null);
        global.MyVar = null;
        setConnectedDevice(null);
        dispatch(setMacAddress(null));
        Alert.alert('Device Disconnected', `MAC Address: ${device.id}`);
      } else {
        Alert.alert('Device is not connected.');
      }
    } catch (error) {
      Alert.alert('Error disconnecting from device:', error.message);
    }
  };

  return (
    <View style={{margin: 15}}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.primaryBtn,
          {backgroundColor: '#991e21', marginBottom: 15},
        ]}
        onPress={startScanning}>
        <Text style={styles.primaryBtnTxt}>SCAN DEVICE</Text>
      </TouchableOpacity>

      <FlatList
        data={devices.slice(0, 10)}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({item}) => (
          <View style={styles.deviceContainer}>
            <View style={styles.deviceDetails}>
              <View style={styles.scanner}>
                <Svg width={20} height={50}>
                  <Rect
                    x="0"
                    y="0"
                    width={10}
                    height={80}
                    fill={
                      selectedDevice && selectedDevice === item.id
                        ? '#00FF00'
                        : 'grey'
                    }
                  />
                </Svg>
              </View>
              <View style={styles.deviceTextContainer}>
                <Text style={styles.deviceText} numberOfLines={2}>
                  {`Name: ${item.name || 'N/A'}`}
                </Text>
                <Text style={styles.deviceID}>{`ID: ${item.id}`}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.disconnectButton,
                  {
                    backgroundColor:
                      selectedDevice && selectedDevice === item.id
                        ? '#991e21' // Device is connected
                        : '#00FF00', // Device is not connected
                  },
                ]}
                key={item.id}
                onPress={() =>
                  selectedDevice && selectedDevice === item.id
                    ? handleDisconnect(item)
                    : handleConnect(item)
                }>
                <Text style={styles.disconnectButtonText}>
                  {selectedDevice === item.id ? 'DISCONNECT' : 'CONNECT'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151412',
    width: '90%',
    height: '50@mvs',
    padding: 5,
    margin: 2,
    borderRadius: 0,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryBtn: {
    width: '40%',
    padding: 10,
    marginTop: 15,
    borderRadius: 4,
    // marginLeft: 'auto',
    marginRight: 'auto',
  },
  scanner: {
    marginRight: 'auto',
  },
  primaryBtn2: {
    width: '110%',
    padding: 2,
    borderRadius: 4,
    // marginLeft: 'auto',
    marginRight: 'auto',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },

  deviceContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items to the left and right
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  deviceDetails: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Align items vertically
  },
  deviceTextContainer: {
    flex: 1, // Take the remaining space
  },
  deviceText: {
    fontSize: '14@ms',
    fontWeight: '600',
    color: colors.DARKESTGREY,
    paddingRight: 5,
  },
  deviceID: {
    fontSize: '12@ms',
    fontWeight: '400',
    color: colors.DARKGREY,
  },
  disconnectButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#991e21',
  },
  disconnectButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default BluetoothDevice;
