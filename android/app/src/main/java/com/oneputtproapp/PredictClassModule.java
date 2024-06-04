package com.oneputtproapp;


import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.oneputtproapp.PredictClass;
import com.oneputtproapp.PracticeSession;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import org.tensorflow.lite.Interpreter;

import android.app.Application;
import android.content.Intent;
import android.util.Log;
import android.content.res.AssetFileDescriptor;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;

import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.Arrays;

import com.rnfs.RNFSPackage;
import java.io.BufferedWriter;
import java.util.List;
import java.util.Map;


public class PredictClassModule extends ReactContextBaseJavaModule {
 private Interpreter tfliteInterpreter;
  
    private static PredictClassModule instance;
    private ReactContext reactContext;

    public static PredictClassModule getInstance() {
        return instance;
    }

    public PredictClassModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        instance = this;
    }
    @ReactMethod
    public void sendCallback(String message) {
        // Implement your logic here
        // You can send a callback to JavaScript using ReactContext and EventEmitter
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("eventName", message);
    }


    @ReactMethod
    public void turnOn(String Message, Callback successCallback) {
            String var1="world"+Message;
        String filePath = getReactApplicationContext().getFilesDir().getAbsolutePath() + "/Logdata.txt";
        System.out.println("File Path: " + filePath);

            System.out.println("File Path: " + Message+"123");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) {
            writer.write(Message);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
     successCallback.invoke(null, var1);
    }
    

    @ReactMethod
    public void loadModel(String modelPath, Callback successCallback) {
        try {
            // Load the model from the assets directory
            
            MappedByteBuffer tfliteModel = loadModelFile(modelPath);
            tfliteInterpreter = new Interpreter(tfliteModel);
            successCallback.invoke(null, "Model Load successfully");
        } catch (Exception e) {
            successCallback.invoke("Error loading model: " + e.getMessage(), null);
        }
    }

    private MappedByteBuffer loadModelFile(String modelPath) {
        try {
            AssetFileDescriptor fileDescriptor = getReactApplicationContext().getAssets().openFd(modelPath);
            FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
            FileChannel fileChannel = inputStream.getChannel();
            long startOffset = fileDescriptor.getStartOffset();
            long declaredLength = fileDescriptor.getDeclaredLength();
            return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    
    

    @Override
    public String getName() {
        return "PredictClassModule"; // Make sure the name matches
    }
   

@ReactMethod
public void predict(String macAddress, Callback successCallback) {
    try {
    // Create an instance of PracticeSession
        ReactApplicationContext reactApplicationContext = getReactApplicationContext(); // Access ReactApplicationContext
        PracticeSession practiceSession = new PracticeSession(reactApplicationContext,macAddress);
     Map dataMap = practiceSession.startSensorThread();
        successCallback.invoke(null, dataMap);
    } catch (Exception e) {
        successCallback.invoke("Error predicting: " + e.getMessage(), -1);
    }
}

    @ReactMethod
    public void startNewActivity( int sliderValue, String sessionName, String Sessiontime, String macAddress, ReadableArray scoreData, int user_id,
   Promise promise) {
        List<String> scoreDataList = new ArrayList<>();
        for (int i = 0; i < scoreData.size(); i++) {
            scoreDataList.add(scoreData.getString(i));
        }
        try {
            // Create an Intent to start the new activity
                  System.out.println(sliderValue+"sliderValue133");
            Intent intent = new Intent(getCurrentActivity(), NewActivity.class);
            intent.putExtra("puttingDistance", sliderValue);
            intent.putExtra("sessionName", sessionName);
            intent.putExtra("noOfPuttMinutes", Sessiontime);
            intent.putExtra("mac_address", macAddress);
            intent.putStringArrayListExtra("scoreData", new ArrayList<>(scoreDataList));
intent.putExtra("userId", user_id);
            System.out.println(intent+"intent");
            getCurrentActivity().startActivity(intent);
            promise.resolve("Activity started successfully");
        } catch (Exception e) {
            promise.reject("ACTIVITY_ERROR", e.getMessage());
        }
    }


    @ReactMethod
    public void handleStopButton(int sessionId) {
        // Send an event to React Native with sessionid
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onStopButtonPress", sessionId);
    }

    @ReactMethod
public void emitBackPressEvent() {
    if (reactContext != null) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onBackPressed", null);
    }
}
@ReactMethod
    public void handleBackPress() {
        // Send an event to React Native
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onBackPress", null);
    }

    
}