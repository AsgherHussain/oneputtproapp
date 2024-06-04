package com.oneputtproapp;

public interface BLEDataListner {
    void onBLEDataReceived(double accelX, double accelY, double accelZ,double gyroX,double gyroY,double gyroZ, int batPercentage);
}
