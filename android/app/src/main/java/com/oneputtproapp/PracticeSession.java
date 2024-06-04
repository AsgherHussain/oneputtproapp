package com.oneputtproapp;


import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;
import static java.lang.Float.NaN;

import android.Manifest;

import android.app.AlertDialog;
import android.app.Application;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;

import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ViewModelProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.google.gson.Gson;
import com.oneputtproapp.Calculation.CSVReaderMainMethod;
import com.oneputtproapp.DataBase.PuttModel;
import com.oneputtproapp.DataBase.PuttViewModel;
import com.oneputtproapp.DataBase.SinglePuttData;

import com.oneputtproapp.DataBase.SyncSessionDataModel;
import com.oneputtproapp.Network.APIClient;
import com.oneputtproapp.Network.API_Interface;

import org.tensorflow.lite.Interpreter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class PracticeSession implements BLEDataListner {

    private BluetoothManager bluetoothManager;
    private PuttViewModel puttViewModel;

    private ReceiveSensorDataThread dataThread;
    private String macAddress;
    private volatile boolean isSensorThreadRunning = false;
    private boolean isLoopRunning = false;
    private double accelX1, accelY1, accelZ1, gyroX1, gyroY1, gyroZ1;
    private int batPercentage1;
    List<SinglePuttData> singlePuttData = new ArrayList<>();
    private YoutGattCallback mGattcallback;
    public Map dataMap;
    SyncSessionDataModel syncSessionDataModel;
    private BluetoothAdapter mBluetoothAdapter;
    public BluetoothGatt mBluetoothGatt;

    private boolean isConditionMet = false, isConditionMet1 = false, isConditionMet2 = false;
    private boolean isSoundPlayed = false, isSoundPlayed1 = false, isSoundPlayed2 = false;
    String[] settingScoreData = new String[8];

    private int TotalputtDataScore = 0;

    private String sessionstart_datetime;

    int numPuttsCount = 1;

    Interpreter tfliteInterpreter = null;

    int puttMinutes = 8, puttingDistance = 3;
    String puttSessionName;
    int sessionId = 0;
    String[] receivedScoreData = {"2", "3", "4", "2", "6", "5", "6", "7"};
    private final boolean isPracticePause = false;
    private final boolean isStartTrue = false;
    private boolean isRunning = true;

    private Context context;
    private BLEDataListner bleDataListener;

    public PracticeSession(ReactApplicationContext reactContext, String macAddress) {
        this.macAddress = macAddress;
        this.context = reactContext.getApplicationContext();
        this.bluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        if (bluetoothManager != null) {
            mBluetoothAdapter = bluetoothManager.getAdapter();
        } else {
            Log.e("PracticeSession", "BluetoothManager is null. Make sure to initialize it.");
            // Handle the error appropriately
        }
        // Initialize other properties and start your sensor thread as needed.
    }

    public void onBLEDataReceived(double accelX, double accelY, double accelZ, double gyroX, double gyroY, double gyroZ, int batPercentage) {
        accelX1 = accelX;
        accelY1 = accelY;
        accelZ1 = accelZ;
        gyroX1 = gyroX;
        gyroY1 = gyroY;
        gyroZ1 = gyroZ;
        batPercentage1 = batPercentage;
    }

    public Map startSensorThread() throws IOException {
 String modelPath = "tflite_model_8.tflite";
        tfliteInterpreter = new Interpreter(loadModelFile(modelPath), null);
        if (context == null) {
            Log.e("PracticeSession", "Context is null. Make sure to initialize the context.");

        }

        isSensorThreadRunning = true;
        isLoopRunning = true;
        Log.d(macAddress, "macAddress");
        // Check if the BluetoothManager and BluetoothAdapter are available
        if (bluetoothManager == null || mBluetoothAdapter == null) {
            Log.e("PracticeSession", "BluetoothManager or BluetoothAdapter is null. Make sure to initialize them.");

        }

        // Initialize the GattCallback if not already done
        if (mGattcallback == null) {
            mGattcallback = new YoutGattCallback(context);
            mGattcallback.setBLEDataListener(this);
        }

        ReceiveSensorDataThread dataThread = new ReceiveSensorDataThread();
        Thread startThread = new Thread(dataThread);
        if (isLoopRunning) {
            startThread.start();
        }

        int TIMEOUT_MS = puttMinutes * 60 * 1000;
        Handler handler = new Handler(Looper.getMainLooper());

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                dataThread.stopRunning();
            }
        }, TIMEOUT_MS);
        syncSessionDataModel = new SyncSessionDataModel();

        return getDataMap();
    }

    public Map getDataMap() {
        return dataMap;
    }

    public class ReceiveSensorDataThread implements Runnable {
        private boolean isRunning = true;

        @Override
        public void run() {
            try {
                BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(macAddress);

                if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                mBluetoothGatt = device.connectGatt(context, false, mGattcallback);

                byte[] data = new byte[56];
                // Initialize BluetoothAdapter
                float[][] windowArray = {{0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0, 0}};

                PredictClass predictClass = new PredictClass();
                int[] output_arr = new int[30];
                float[] oldSensorData = new float[]{0, 0, 0, 0, 0, 0, 0, 0, 0};
                //String timestamp = getCurrentDateWithSpecificFormat();

                long frequencyStartTime = System.currentTimeMillis();
                boolean record = false;
                List<float[]> dataArray = new ArrayList<float[]>();


                Arrays.fill(output_arr, 2);
                int shot_num = 0;
                long check_time = System.currentTimeMillis();
                long check_time1 = System.currentTimeMillis();
                long start_time = System.currentTimeMillis();
                int count = 0;

                int puttTime = 100;
                long startTime = System.currentTimeMillis();
                int numTime = puttTime * 60 * 1000;
                int frequencyCount = 0;
                int lastBatteryCount = 0;
                //boolean isButtonResetPressed = false;

                File root = new File(Environment.getExternalStorageDirectory(), "/Android/media/" + context.getPackageName());
                root.mkdir();
                Log.d("root", String.valueOf(root));

                //create day-wise sub-folder
                String timestampDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
                boolean calculate = false;

                File subFolder = new File(root, timestampDate);
                subFolder.mkdir();


                //number of putts
//                while (System.currentTimeMillis() - startTime < numTime) {
                Thread.sleep(4000);
                while (isSensorThreadRunning) {

                    Log.e("currentTime", String.valueOf(new Date()));
                    Thread.sleep(6);

                    if (!isStartTrue) {


                        if ((System.currentTimeMillis() - frequencyStartTime) < 1000) {
                            frequencyCount++;
                        } else {
                            //double frequency = (double) frequencyCount / 1.0; // Divide by 1 second
                            int finalFrequencyCount = frequencyCount;
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    //txtFrequency.setText(String.valueOf(finalFrequencyCount));
                                }
                            });

                            frequencyCount = 0;
                            frequencyStartTime = System.currentTimeMillis();
                        }


                        if (lastBatteryCount == 0) {
                            lastBatteryCount = batPercentage1;
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    if (batPercentage1 > 100) {
//                                        batteryPercent.setText("Battery: " + "100" + "%");
                                    } else {
//                                        batteryPercent.setText("Battery: " + String.valueOf(batPercentage1) + "%");
                                    }
                                    if (batPercentage1 < 10) {
//                                        showLowBatteryDialog();
//                                        vibrateDevice(getBaseContext());
                                    }
                                }
                            });
                        }
                        double accelX2 = accelX1;
                        double accelY2 = accelY1;
                        double accelZ2 = accelZ1;
                        double gyroX2 = gyroX1;
                        double gyroY2 = gyroY1;
                        double gyroZ2 = gyroZ1;
                        Log.e("run: ",
                                "ax" + String.valueOf(accelX1)
                                        + " ay " + String.valueOf(accelY1)
                                        + " az " + String.valueOf(accelZ1)
                                        + " gx " + String.valueOf(gyroX1)
                                        + " gy " + String.valueOf(gyroY1)
                                        + " gz " + String.valueOf(gyroZ1)
                                        + " battery " + String.valueOf(batPercentage1)


                        );


                        double[][] sensorArray = {{accelX2, accelY2, accelZ2, gyroX2, gyroY2, gyroZ2}};
                        double[] getRotationData = getRotation(sensorArray[0][0], sensorArray[0][1], sensorArray[0][2], sensorArray[0][3], sensorArray[0][4], sensorArray[0][5]);

                        double[] input = {sensorArray[0][0], sensorArray[0][1], sensorArray[0][2], sensorArray[0][3], sensorArray[0][4], sensorArray[0][5], getRotationData[0], getRotationData[1], getRotationData[2]};
                        for (int k = 0; k < input.length; k++) {

                        }

                        float[] newSensorData = new float[input.length];
                        for (int k = 0; k < input.length; k++) {
                            newSensorData[k] = (float) (input[k] * 0.1f + oldSensorData[k] * 0.9f);
                        }

                        // update old_sensor_data with new_sensor_data
                        oldSensorData = newSensorData.clone();
                        float[][] result = vstackWithFifo(windowArray, newSensorData);
                        windowArray = result;

                        float[][][] arr3D = new float[1][6][9];
                        for (int k = 0; k < windowArray.length; k++) {
                            for (int l = 0; l < windowArray[k].length; l++) {
                                arr3D[0][k][l] = windowArray[k][l];

                            }
                        }


                        int outputIndex = predictClass.predict(tfliteInterpreter, arr3D);
                        Log.d("outputIndex1", String.valueOf(outputIndex));

                        int[] outputIdxArray = new int[1];
                        outputIdxArray[0] = outputIndex;
                        int[] outputIndexresult = vstackForOutputIndex(output_arr, outputIdxArray);
                        output_arr = outputIndexresult;

                        Integer count0 = 0;
                        Integer count1 = 0;
                        Integer count2 = 0;
                        for (int j = 0; j < output_arr.length; j++) {
                            if (output_arr[j] == 0) {
                                count0++;
                            } else if (output_arr[j] == 1) {
                                count1++;
                            } else if (output_arr[j] == 2) {
                                count2++;
                            }

                        }
                        List<Integer> maxValueIndexArray = new ArrayList<Integer>();
                        maxValueIndexArray.add(0, count0);
                        maxValueIndexArray.add(1, count1);
                        maxValueIndexArray.add(2, count2);

                        int max = Collections.max(maxValueIndexArray);
                        int max_value = maxValueIndexArray.indexOf((max));
                        Log.e("outputIndex: ", String.valueOf(outputIndex));
                        Log.e("maxvalue: ", String.valueOf(max_value));


                        if (max_value != 0 && !record) {

                            check_time = System.currentTimeMillis();  // Reset the start time if pred is not equal to 2
                            Log.e("==WAITING====: ", count + "  ===WAITING===");


                        } else if (System.currentTimeMillis() - check_time >= 1000) {

                            Log.e("==SAVING====: ", count + "  ===SAVING===");
                            float current_time = (System.currentTimeMillis() - start_time) / 1000f;

                            float[] data_point = {current_time, (float) gyroX1, (float) gyroY1, (float) gyroZ1, (float) accelX1, (float) accelY1, (float) accelZ1,}; // create new data point as a float array
                            dataArray.add(data_point);
                            record = true;
//

                            if (max_value == 1 && record) {

                                calculate = true;
                                Log.e("==RESETTING====: ", count + "  Calculate");

//                                // Update the screen
                            } else if (max_value == 0) {
//
                            } else {
                                Log.e("==RESETTING====: ", count + "  ===RESETTING===");

                                if (calculate) {


                                    try {
                                        Log.e("Calculate: ", count + "  Calculating");

                                        //create .csv files
                                        String timestamp = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss").format(new Date());
                                        File f = new File(subFolder, "sensor_data_" + timestamp + ".csv");
                                        FileWriter writer = new FileWriter(f);
                                        Log.d("dataarray388", String.valueOf(dataArray.size()));
                                        for (int i = 0; i < dataArray.size(); i++) {
                                            writer.write(dataArray.get(i)[0] + "," + dataArray.get(i)[1] + "," + dataArray.get(i)[2] + "," + dataArray.get(i)[3] + "," + dataArray.get(i)[4] + "," + dataArray.get(i)[5] + "," + dataArray.get(i)[6] + "\n"
                                            );
                                        }
                                        writer.close();
                                        System.out.println("puttingDistance3" + puttingDistance);

                                        Map dataMap = CSVReaderMainMethod.calculation(dataArray, puttingDistance, receivedScoreData);
//                                        plotLineChartWithSingleLineDataSet(dataMap);
                                        check_time1 = System.currentTimeMillis();
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                puttViewModel = ViewModelProvider.AndroidViewModelFactory.getInstance((Application) context).create(PuttViewModel.class);
                                                String jsonFrontStrokeString = new Gson().toJson(dataMap.get("front_stroke"));
                                                String jsonBackStrokeString = new Gson().toJson(dataMap.get("backstroke"));
                                                String jsonVelocityabsString = new Gson().toJson(dataMap.get("velocity_abs"));
                                                PuttModel puttModel = new PuttModel(1, sessionId, dataMap.get("ratio_back_front").toString(), Math.round(Double.parseDouble(dataMap.get("elevation_impact").toString()) * 100.0) / 100.0, Math.round(Double.parseDouble(dataMap.get("pos_y_impact").toString()) * 100.0) / 100.0, Math.round(Double.parseDouble(dataMap.get("loft_angle").toString()) * 100.0) / 100.0, Math.round(Double.parseDouble(dataMap.get("roll_start").toString()) * 100.0) / 100.0, Math.round(Double.parseDouble(dataMap.get("roll_impact").toString()) * 100.0) / 100.0, Math.round(Double.parseDouble(dataMap.get("diff_yaw").toString()) * 100.0) / 100.0, jsonFrontStrokeString, jsonBackStrokeString, jsonVelocityabsString, Math.round(Double.parseDouble(dataMap.get("accelerationImpact").toString()) * 100.0) / 100.0, (int) dataMap.get("avgScore"));
                                                Log.d("puttData", (puttModel).getBbstrokeRatio());
                                                puttViewModel.insertPutt(puttModel);

                                            }
                                        });

                                        while (true) {
                                            if (System.currentTimeMillis() - check_time1 <= 3000 || isPracticePause) {
                                                if (isPracticePause) {

                                                    isSoundPlayed = false;
                                                    isSoundPlayed1 = false;
                                                    check_time1 = System.currentTimeMillis();
                                                } else if (System.currentTimeMillis() - check_time1 <= 5000) {
                                                    isSoundPlayed = false;
                                                    isSoundPlayed1 = false;

                                                }
                                            } else {
                                                break;
                                            }
                                        }

                                        start_time = System.currentTimeMillis();
                                        Log.e("End", "End Session ");
                                        record = false;
                                        ;
                                        dataArray.clear();

                                        numPuttsCount++;

////                                isButtonResetPressed = true;
                                    } catch (Exception e) {

                                        e.printStackTrace();


                                        Log.e("Check: ", "Invalid Putt");
                                        start_time = System.currentTimeMillis();
                                        Log.e("End", "End Session ");
                                        record = false;

                                        dataArray.clear();
                                        isSoundPlayed2 = false;

                                    }
                                }
                            }
                        }


                        count++;
                    } else {


                    }
                }


            } catch (Exception e) {
                Log.e("Exception: ", e.toString());

            }

        }

        public void stopRunning() {
            isRunning = false;
        }


    }


    public void stopRunning() {
        Log.e("method","in stopRunning");
        isRunning = false;
    }

    private String getCurrentDateWithSpecificFormat() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss");
        String timestamp = formatter.format(new Date());
        return timestamp;
    }

    private double[] getRotation(double ax, double ay, double az, double gx, double gy, double gz) {

        double accel_magnitude = Math.sqrt((ax * ax + ay * ay + az * az));
        double pitch = Math.toDegrees(Math.atan2(ax, Math.sqrt(ay * ay + az * az)));
        double roll = Math.toDegrees(Math.atan2(ay, Math.sqrt(ax * ax + az * az)));

        double tilt_angle = Math.acos(az / accel_magnitude);
        double tilt = Math.toDegrees(tilt_angle);

        if (tilt == NaN) {
            tilt = 0;
        }
        if (pitch == NaN) {
            pitch = 0;
        }
        if (roll == NaN) {
            roll = 0;
        }
        // Log.i("tilt", String.valueOf(tilt));

        if (Double.isNaN(tilt)) {
            tilt = 0.0;
        }
        double[] rotation = {roll, pitch, tilt};
        // Log.i("tilt", String.valueOf(tilt));

        return rotation;
    }

    public static float[][] vstackWithFifo(float[][] array, float[] input) {
        // Get the number of rows and columns of the original array
        int rows = array.length;
        int cols = array[0].length;

        // Create a new array with the same number of rows and columns
        float[][] result = new float[rows][cols];

        // Shift the existing rows upward by one position
        System.arraycopy(array, 1, result, 0, rows - 1);

        // Add the new input as the last row
        System.arraycopy(input, 0, result[rows - 1], 0, cols);
        // Log.e("vstackWithFifo: ", result.toString());

        // create 3D array with shape (1, 6, 9)
        float[][][] arr3D = new float[1][6][9];

        // copy elements from 2D array to 3D array
        System.arraycopy(result, 0, arr3D[0], 0, result.length);

        return result;
    }

    public int[] vstackForOutputIndex(int[] array, int[] input) {
        // Create a new array with the combined size
        int[] result = new int[array.length];

        // Copy the elements of the original array
        System.arraycopy(array, 1, result, 0, array.length - 1);

        // Copy the elements of the input array
        result[array.length - 1] = input[0];

        return result;
    }

    public MappedByteBuffer loadModelFile(String modelPath) throws IOException {
        AssetFileDescriptor fileDescriptor = context.getAssets().openFd("tflite_model_8.tflite");
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }


    private void SyncSessionMethod(List<SinglePuttData> singlePuttData) {

        int total_puts = singlePuttData.size();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SS");
        String endDate = dateFormat.format(new Date());
        int avgScore = TotalputtDataScore / total_puts;
        Log.e(String.valueOf(TotalputtDataScore), String.valueOf(avgScore));
        syncSessionDataModel.setSessionid(sessionId);
        syncSessionDataModel.setSession_name(puttSessionName);
        syncSessionDataModel.setCoach_id(0);
        syncSessionDataModel.setUser_id(1);
        syncSessionDataModel.setStart_datetime(sessionstart_datetime);
        syncSessionDataModel.setEnd_datetime(endDate);
        syncSessionDataModel.setPutt(singlePuttData);
        syncSessionDataModel.setTotal_puts(total_puts);
        syncSessionDataModel.setTime_ratio("2:1");
        syncSessionDataModel.setSession_score(avgScore);
        syncSessionDataModel.setIs_sync(true);

        Log.e("setStart_datetime", String.valueOf(syncSessionDataModel.start_datetime));


        API_Interface api_interface = APIClient.getClient().create(API_Interface.class);
        Call<SyncSessionDataModel> call = api_interface.syncSessionData(syncSessionDataModel);

        call.enqueue(new Callback<SyncSessionDataModel>() {
            @Override
            public void onResponse(Call<SyncSessionDataModel> call, Response<SyncSessionDataModel> response) {
                if (response.code() == 200) {
                    SyncSessionDataModel syncSessionDataModel = response.body();
                    int sessionid = syncSessionDataModel.getSessionid();
//                    appPreferences.setSessionId(sessionid);

//                    Toast.makeText(StartedPracticeDetailsActivity.this, "successfully", Toast.LENGTH_SHORT).show();
//                    stopService(new Intent(StartedPracticeDetailsActivity.this, ForegroundService.class));
//                    Intent i = new Intent(StartedPracticeDetailsActivity.this, SessionPerformanceActivity.class);
//                    startActivity(i);
                    Log.e("Check", "success");
                } else {
                    Log.e("Check", "Failed");

                }

            }

            @Override
            public void onFailure(Call<SyncSessionDataModel> call, Throwable t) {
                t.printStackTrace();
                Log.e("Check", "errors thrown");
            }
        });

    }

    private void stopSensorThread() {
        Log.e("method","in stopRunning");
        isRunning = false;
        isSensorThreadRunning = false;
        isLoopRunning = false;
    }

    public void stopSesisonClick() {

        stopSensorThread();

        if (mBluetoothGatt != null) {
            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            mBluetoothGatt.disconnect();

        }

//            puttViewModel = ViewModelProvider.AndroidViewModelFactory.getInstance((Application) context).create(PuttViewModel.class);
//
//        puttViewModel.getAllPuttBySessionIdFromVm(sessionId).observe((LifecycleOwner) context, puttModels -> {
////            singlePuttData.clear();
//            if (puttModels != null && !puttModels.isEmpty()) {
//
//                for (PuttModel puttModel : puttModels) {
//                    SinglePuttData singlePutt = new SinglePuttData();
//
//                    singlePutt.setBbstrokeRatio(puttModel.getBbstrokeRatio());
//                    singlePutt.setElevationAtImp(puttModel.getElevationAtImp());
//                    singlePutt.setOffCentreImp(puttModel.getOffCenterImp());
//                    singlePutt.setLoftAngle(puttModel.getLoftAngle());
//                    singlePutt.setAngLieStart(puttModel.getAngLieStart());
//                    singlePutt.setAngLieImp(puttModel.getAngLieImp());
//                    singlePutt.setPutterFaceAng(puttModel.getPutterFaceAng());
//                    singlePutt.setFrontStroke(puttModel.getFrontStroke());
//                    singlePutt.setBackStroke(puttModel.getBackStroke());
//                    singlePutt.setVelocityAbs(puttModel.getVelocityAbs());
//                    singlePutt.setAcceleration_impact(puttModel.getAccelerationImpact());
//                    singlePutt.setScorePutt(puttModel.getScore_putt());
//                    singlePutt.setFtDistance(puttingDistance);
//                    singlePutt.setAvg_score(0);
//                    singlePuttData.add(singlePutt);
//                    TotalputtDataScore = puttModel.getScore_putt() + TotalputtDataScore;
//                }
//            } else {
//                Log.d("LiveData :", "Data not found");
//            }
////            SessionViewModel sessionViewModel = (SessionViewModel) new ViewModelProvider(StartedPracticeDetailsActivity.this).get(SessionViewModel.class);
//            SyncSessionMethod(singlePuttData);
//
//        });
    }

}
