
package com.oneputtproapp;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import org.apache.commons.math3.geometry.euclidean.twod.Line;

public class LineChartDataResponse {

    @SerializedName("status")
    private int status;

    @SerializedName("message")
    private String message;

    @SerializedName("data")
    private LineChartData lineChartData;

    public LineChartDataResponse() {
    }

    public LineChartDataResponse(int status, String message, LineChartData lineChartData) {
        this.status = status;
        this.message = message;
        this.lineChartData = lineChartData;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LineChartData getLineChartData() {
        return lineChartData;
    }

    public void setLineChartData(LineChartData lineChartData) {
        this.lineChartData = lineChartData;
    }
}
