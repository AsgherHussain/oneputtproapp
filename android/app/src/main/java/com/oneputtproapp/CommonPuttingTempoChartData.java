package com.oneputtproapp;

import com.google.gson.annotations.SerializedName;

public class CommonPuttingTempoChartData {

    @SerializedName("value")
    private String value;
    @SerializedName("id")
    private int id;
    @SerializedName("index")
    private int index;

    public CommonPuttingTempoChartData() {

    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getValue() {
        return value;
    }

    public int getId() {
        return id;
    }

    public int getIndex() {
        return index;
    }
}
