package com.oneputtproapp;

import android.Manifest;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.pm.PackageManager;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import java.util.UUID;

public class YoutGattCallback extends BluetoothGattCallback {
    private static final String TAG = "YourGattCallback";
    private static final String SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
    private static final String CHARACTERISTIC_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
    private BLEDataListner bleDataListener;
    private Context context;

    public YoutGattCallback(Context context) {
        this.context = context;
    }


    public void setBLEDataListener(BLEDataListner listener) {

        this.bleDataListener = listener;

    }


    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
        if (newState == BluetoothProfile.STATE_CONNECTED) {
            Log.i(TAG, "Connected to GATT server.");


            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            gatt.discoverServices();
        } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
            Log.i(TAG, "Disconnected from GATT server.");
            // Handle disconnection here
        }
    }


    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (status == BluetoothGatt.GATT_SUCCESS) {
            BluetoothGattService service = gatt.getService(UUID.fromString(SERVICE_UUID));
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(UUID.fromString(CHARACTERISTIC_UUID));
            System.out.println(characteristic);


            if (ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            gatt.requestMtu(200);
            gatt.setCharacteristicNotification(characteristic, true);
//

        }
    }


    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {

        // Handle characteristic changed here

        byte[] data = characteristic.getValue();

        String receivedData = new String(data);

//        Log.i(TAG, "Received data: " + receivedData);
  double accelX = extractValue(receivedData, "ax");

        double accelY = extractValue(receivedData, "ay");

        double accelZ = extractValue(receivedData, "az");

        double gyroX = extractValue(receivedData, "gx");

        double gyroY = extractValue(receivedData, "gy");

        double gyroZ = extractValue(receivedData, "gz");

        int batPercentage = (int) extractValue(receivedData, "bat");



        // Notify the callback listener with the received data

        if (bleDataListener != null) {

            bleDataListener.onBLEDataReceived(accelX, accelY, accelZ, gyroX, gyroY, gyroZ, batPercentage);


        }

    }



    // Helper method to extract values from the received data

    private double extractValue(String sensorReading, String key) {

        int startIndex = sensorReading.indexOf(key + ":") + key.length() + 1;

        int endIndex = sensorReading.indexOf(",", startIndex);

        if (endIndex == -1) {

            endIndex = sensorReading.length();

        }

        String valueString = sensorReading.substring(startIndex, endIndex).trim();

        try {
            return Double.parseDouble(valueString);
        } catch (NumberFormatException e) {
            // Handle the exception, log an error, or take appropriate action
            e.printStackTrace(); // Log the exception for debugging
            return 0.0; // or any default value you want to return in case of parsing failure
        }
    }

}

