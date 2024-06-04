package com.oneputtproapp;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class CommonLineChartData {

    @SerializedName("value")
    private double value;
    @SerializedName("id")
    private int id;
    @SerializedName("index")
    private int index;

    public CommonLineChartData() {
    }

    public CommonLineChartData(double value, int id, int index) {
        this.value = value;
        this.id = id;
        this.index = index;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
