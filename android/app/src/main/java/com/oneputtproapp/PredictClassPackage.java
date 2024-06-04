package com.oneputtproapp;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.ViewManager;
import com.oneputtproapp.PredictClassModule;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PredictClassPackage implements ReactPackage  {


    private static ReactApplicationContext reactContext;

    // This method is called when your module is initialized


    // Your method to get the ReactContext
    public static ReactApplicationContext getReactContext() {
        return reactContext;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
modules.add(new PredictClassModule(reactContext));
 return modules;
    }

}