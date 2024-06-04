import React, { useEffect } from 'react';
import { View, Text, NativeEventEmitter, NativeModules, BackHandler, DeviceEventEmitter } from 'react-native';
import { getLoginData } from '../helpers/asyncStorage';

const PredictClassModule = NativeModules.PredictClassModule;

// Create a dedicated NativeEventEmitter class
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

function ResultViewStartPractice({ navigation, route }) {
  const { sliderValue, sessionName, Sessiontime, macAddress, scoreData, userId } = route.params;



  useEffect(() => {
    if(Platform.OS === "android") 
    {

    const backPressEventEmitter = new BackPressEventEmitter(PredictClassModule);

    const backPressListener = backPressEventEmitter.addListener('onBackPress', () => {
     navigation.goBack(); 
         });

    const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
     
      return true;
    });

    return () => {
      backPressListener.remove();
      backHandlerListener.remove();
    };
  }
  }, [navigation]);

  useEffect(() => {
    
    if(Platform.OS === "android") 
    {
    const stopButtonEventEmitter = new NativeEventEmitter(PredictClassModule);
  
    const stopButtonListener = stopButtonEventEmitter.addListener('onStopButtonPress', (item) => {
    
      navigation.navigate('PuttingSession',{sessionId:item})
    });
  
    return () => {
      stopButtonListener.remove();
    };
  }
  else{
   
  }

  }, [navigation]);
  

  useEffect(() => {
      if(Platform.OS === "android") 
      {

    PredictClassModule.startNewActivity(sliderValue, sessionName, Sessiontime, macAddress, scoreData, userId)
      .then(result => {
    
      })
      .catch(error => {
        console.error(error); // Handle any errors
      });
      }
      else{
        NativeModules.StartPracticeBridge.practiceModuleView(sliderValue, sessionName, Sessiontime, macAddress, scoreData, userId)
        const stopButtonEventEmitter = new NativeEventEmitter(NativeModules.BridgeEvent);
        const stopButtonListener = stopButtonEventEmitter.addListener(
          'onEvent',
          (item) => {
            //navigation.goBack(); 
        
            if(item.length != 0)
            {
            navigation.navigate('PuttingSession',{sessionId:item})
            }
            else{
             // navigation.goBack(); 
             navigation.navigate('Parent')
            }
          }
      );
      }
  }, []);

    if(Platform.OS === "android") 
    {
    const myModuleEventEmitter = new NativeEventEmitter(NativeModules.PredictClassModule);

    myModuleEventEmitter.addListener('eventName', (event) => {
        // Handle the event
    
    });
  }
    
    // Trigger the callback from native code

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello, this is my React Native app!</Text>
       
      </View>
    );
  }
export default ResultViewStartPractice;
