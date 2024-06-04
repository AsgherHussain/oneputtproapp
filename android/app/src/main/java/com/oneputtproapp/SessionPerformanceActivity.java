package com.oneputtproapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.appcompat.widget.Toolbar;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.DefaultAxisValueFormatter;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.oneputtproapp.Network.APIClient;
import com.oneputtproapp.Network.API_Interface;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SessionPerformanceActivity extends AppCompatActivity {

    private LineChart puttingTempoChart, loftAngleChart, faceAngleImpactChart, lieAngleChangeChart,
            accelerationImpactChart, impactPositionChart;

    AppPreferences appPreferences;
    LineChartDataResponse lineChartDataResponse;
    LineChartData lineChartData;

    List<CommonLineChartData> puttingTempoList;
    List<CommonLineChartData> loftAngleList;
    List<CommonLineChartData> faceAngleImpactList;
    List<CommonLineChartData> lieAngleChangeList;
    List<CommonLineChartData> accelerationImpactList;
    List<CommonLineChartData> impactPositionList;

    boolean isContentVisible = true;
    // private PuttViewModel puttViewModel;
    HorizontalScrollView puttingTempoScrollView;
    ImageView puttingTempoArrow;

    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_session_performance);
        // puttViewModel =
        // ViewModelProvider.AndroidViewModelFactory.getInstance(getApplication()).create(PuttViewModel.class);
        //
        // puttViewModel.clearDatabase();
        puttingTempoChart = findViewById(R.id.session_performance_graph_putting_tempo);
        loftAngleChart = findViewById(R.id.session_performance_graph_loft_angle);
        faceAngleImpactChart = findViewById(R.id.session_performance_graph_face_angle_impact);
        lieAngleChangeChart = findViewById(R.id.session_performance_graph_lie_angle_change);
        accelerationImpactChart = findViewById(R.id.session_performance_graph_acceleration_impact);
        impactPositionChart = findViewById(R.id.session_performance_graph_impact_position);
        puttingTempoArrow = findViewById(R.id.puttingTempoArrow);
        puttingTempoScrollView = findViewById(R.id.putting_tempo_graph_layout);
        toolbar = findViewById(R.id.toolbar_session_performance);

        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // Set the back icon
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back);

        // Handle click event on the back icon
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        appPreferences = new AppPreferences(SessionPerformanceActivity.this);
        int sessionid = appPreferences.getSessionId();
        int userid = appPreferences.getUserId();
        // int sessionid = getIntent().getIntExtra("sessionid",-1 );
        // int userid = getIntent().getIntExtra("userid",-1);

        LinearLayout puttingTempoHeaderLayout = findViewById(R.id.header_putting_tempo);
        puttingTempoHeaderLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isContentVisible) {
                    // If the content is currently visible, hide it
                    puttingTempoScrollView.setVisibility(View.GONE);
                    isContentVisible = false;
                    puttingTempoArrow.setRotation(0);
                } else {
                    // If the content is currently hidden, show it
                    puttingTempoScrollView.setVisibility(View.VISIBLE);
                    isContentVisible = true;
                    puttingTempoArrow.setRotation(180);
                }

            }
        });

        loadAllGraphs(userid, sessionid);
        // loadAllGraphs(38,19);
    }

    private void loadAllGraphs(int userid, int sessionid) {
        API_Interface api_interface = APIClient.getClient().create(API_Interface.class);
        Call<LineChartDataResponse> call = api_interface.getLineChartDataByUserIdandSessionId(userid, sessionid);

        call.enqueue(new Callback<LineChartDataResponse>() {
            @Override
            public void onResponse(Call<LineChartDataResponse> call, Response<LineChartDataResponse> response) {
                if (response.code() == 200) {

                    lineChartDataResponse = response.body();
                    lineChartData = lineChartDataResponse.getLineChartData();

                    puttingTempoList = lineChartData.getPuttingTempo();
                    System.out.println(puttingTempoList.get(0) + "0-0/////");
                    List<Entry> entryListPuttingTempo = dataValues(puttingTempoList);
                    plotPuttingTempoGraph(entryListPuttingTempo);

                    loftAngleList = lineChartData.getLoftAngle();
                    List<Entry> entryListLoftAngle = dataValues(loftAngleList);
                    plotLoftAngleGraph(entryListLoftAngle);

                    faceAngleImpactList = lineChartData.getFaceAngleImpact();
                    List<Entry> entryListFaceAngleImpact = dataValues(faceAngleImpactList);
                    plotFaceAngleImpactGraph(entryListFaceAngleImpact);

                    lieAngleChangeList = lineChartData.getLieAngleChange();
                    List<Entry> entryListLieAngleChange = dataValues(lieAngleChangeList);
                    plotLieAngleChangeGraph(entryListLieAngleChange);

                    accelerationImpactList = lineChartData.getAccelerationImpact();
                    List<Entry> entryListAccelerationImpact = dataValues(accelerationImpactList);
                    plotAccelerationImpactGraph(entryListAccelerationImpact);

                    impactPositionList = lineChartData.getImpactPosition();
                    List<Entry> entryListImpactPosition = dataValues(impactPositionList);
                    plotImpactPositionGraph(entryListImpactPosition);

                } else {
                    Toast.makeText(SessionPerformanceActivity.this, response.message(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<LineChartDataResponse> call, Throwable t) {
                Toast.makeText(SessionPerformanceActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private List<Entry> dataValues(List<CommonLineChartData> dataList) {
        ArrayList<Entry> entries = new ArrayList<>();

        for (int i = 0; i < dataList.size(); i++) {
            dataList.get(i).getValue();

            CommonLineChartData dataObject = dataList.get(i);
            float x = dataObject.getIndex();

            float y = (float) dataObject.getValue();

            // this works best
            entries.add(new Entry(Float.valueOf(x), Float.valueOf(y)));

        }
        return entries;
    }

    private List<Entry> puttingTempodataValues(List<CommonPuttingTempoChartData> dataList) {
        ArrayList<Entry> entries = new ArrayList<>();

        for (int i = 0; i < dataList.size(); i++) {

            CommonPuttingTempoChartData dataObject = dataList.get(i);
            float x = dataObject.getIndex();
            String y = dataObject.getValue();

            // this works best
            entries.add(new Entry(Float.valueOf(x), Float.valueOf(y)));

        }
        return entries;
    }

    private void plotPuttingTempoGraph(List<Entry> entryListPuttingTempo) {

        LineDataSet dataSet = new LineDataSet(entryListPuttingTempo, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setDrawFilled(true);
        dataSet.setFillColor(Color.RED);
        // experimental
        /*
         * dataSet.setHighlightEnabled(true);
         * dataSet.setHighLightColor(Color.WHITE);
         */

        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = puttingTempoChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = puttingTempoChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = puttingTempoChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        puttingTempoChart.getXAxis().setAxisMinimum(1);
        puttingTempoChart.getXAxis().setAxisMaximum(10);

        puttingTempoChart.setData(lineData);
        puttingTempoChart.getDescription().setEnabled(false);
        puttingTempoChart.getLegend().setTextColor(Color.WHITE);
        puttingTempoChart.getLegend().setForm(Legend.LegendForm.NONE);
        puttingTempoChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        puttingTempoChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);
        puttingTempoChart.getLegend().setDrawInside(false);

        puttingTempoChart.invalidate();
    }

    private void plotLoftAngleGraph(List<Entry> entryListLoftAngle) {

        LineDataSet dataSet = new LineDataSet(entryListLoftAngle, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setCircleHoleColor(Color.RED);
        dataSet.setDrawFilled(true);
        dataSet.setFillColor(Color.RED);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);

        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = loftAngleChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = loftAngleChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = loftAngleChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        loftAngleChart.getXAxis().setAxisMinimum(1);
        loftAngleChart.getXAxis().setAxisMaximum(10);

        loftAngleChart.setData(lineData);
        loftAngleChart.getDescription().setEnabled(false);

        loftAngleChart.getLegend().setTextColor(Color.WHITE);
        loftAngleChart.getLegend().setForm(Legend.LegendForm.NONE);
        loftAngleChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        loftAngleChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);
        loftAngleChart.getLegend().setDrawInside(false);

        loftAngleChart.invalidate();
    }

    private void plotFaceAngleImpactGraph(List<Entry> entryListFaceAngleImpact) {

        LineDataSet dataSet = new LineDataSet(entryListFaceAngleImpact, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleHoleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setFillColor(Color.RED);
        dataSet.setDrawFilled(true);
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = faceAngleImpactChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = faceAngleImpactChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = faceAngleImpactChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        faceAngleImpactChart.getXAxis().setAxisMinimum(1);
        faceAngleImpactChart.getXAxis().setAxisMaximum(10);

        faceAngleImpactChart.setData(lineData);
        faceAngleImpactChart.getDescription().setEnabled(false);

        faceAngleImpactChart.getLegend().setTextColor(Color.WHITE);
        faceAngleImpactChart.getLegend().setForm(Legend.LegendForm.NONE);
        faceAngleImpactChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        faceAngleImpactChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);

        faceAngleImpactChart.invalidate();
    }

    private void plotLieAngleChangeGraph(List<Entry> entryListLieAngleChange) {

        LineDataSet dataSet = new LineDataSet(entryListLieAngleChange, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setFillColor(Color.RED);
        dataSet.setDrawFilled(true);
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = lieAngleChangeChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = lieAngleChangeChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = lieAngleChangeChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        lieAngleChangeChart.getXAxis().setAxisMinimum(1);
        lieAngleChangeChart.getXAxis().setAxisMaximum(10);

        lieAngleChangeChart.setData(lineData);
        lieAngleChangeChart.getDescription().setEnabled(false);

        lieAngleChangeChart.getLegend().setTextColor(Color.WHITE);
        lieAngleChangeChart.getLegend().setForm(Legend.LegendForm.NONE);
        lieAngleChangeChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        lieAngleChangeChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);

        lieAngleChangeChart.invalidate();
    }

    private void plotAccelerationImpactGraph(List<Entry> entryListAccelerationImpact) {

        LineDataSet dataSet = new LineDataSet(entryListAccelerationImpact, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setFillColor(Color.RED);
        dataSet.setDrawFilled(true);
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = accelerationImpactChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = accelerationImpactChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = accelerationImpactChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        accelerationImpactChart.getXAxis().setAxisMinimum(1);
        accelerationImpactChart.getXAxis().setAxisMaximum(10);
        accelerationImpactChart.setData(lineData);
        accelerationImpactChart.getDescription().setEnabled(false);
        accelerationImpactChart.getLegend().setTextColor(Color.WHITE);
        accelerationImpactChart.getLegend().setForm(Legend.LegendForm.NONE);
        accelerationImpactChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        accelerationImpactChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);

        accelerationImpactChart.invalidate();
    }

    private void plotImpactPositionGraph(List<Entry> entryListImpactPosition) {

        LineDataSet dataSet = new LineDataSet(entryListImpactPosition, "Putt No.");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setFillColor(Color.RED);
        dataSet.setDrawFilled(true);
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(dataSet);

        LineData lineData = new LineData(dataSet);

        XAxis xAxis = impactPositionChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE); // Set X-axis label text color
        xAxis.setLabelCount(10, true);
        xAxis.setValueFormatter(new DefaultAxisValueFormatter(0));

        YAxis yAxisLeft = impactPositionChart.getAxisLeft();
        yAxisLeft.setTextColor(Color.WHITE); // Set Y-axis label text color

        YAxis yAxisRight = impactPositionChart.getAxisRight();
        yAxisRight.setEnabled(false);

        // to set X axis values from 1-10
        impactPositionChart.getXAxis().setAxisMinimum(1);
        impactPositionChart.getXAxis().setAxisMaximum(10);

        impactPositionChart.setData(lineData);
        impactPositionChart.getDescription().setEnabled(false);

        impactPositionChart.getLegend().setTextColor(Color.WHITE);
        impactPositionChart.getLegend().setForm(Legend.LegendForm.NONE);
        impactPositionChart.getLegend().setVerticalAlignment(Legend.LegendVerticalAlignment.BOTTOM);
        impactPositionChart.getLegend().setOrientation(Legend.LegendOrientation.HORIZONTAL);

        impactPositionChart.invalidate();
    }

    @Override
public void onBackPressed() {
    // Emit an event to notify the React Native side
    PredictClassModule.getInstance().emitBackPressEvent();
    // Handle any other logic if needed
}
    // @Override
    // public void onBackPressed() {
    //     // Handle the back press event here
    //     PredictClassModule.getInstance().handleBackPress();
    //     finish();
    //     super.onBackPressed();
    // }
}