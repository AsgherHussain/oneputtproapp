package com.oneputtproapp;


import android.graphics.Color;
import android.os.Bundle;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModelProvider;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.DefaultAxisValueFormatter;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.oneputtproapp.DataBase.PuttModel;
import com.oneputtproapp.DataBase.PuttViewModel;

import java.util.ArrayList;
import java.util.List;

public class FragmentPuttingStatistic extends Fragment {
    private LineChart puttingTempoChart, loftAngleChart, faceAngleImpactChart, lieAngleChangeChart, accelerationImpactChart, impactPositionChart;

    private SettingViewModel viewModel;
    private PuttViewModel puttViewModel;
    List<CommonLineChartData> puttingTempoList;
    List<CommonLineChartData> loftAngleList;
    List<CommonLineChartData> faceAngleImpactList;
    List<CommonLineChartData> lieAngleChangeList;
    List<CommonLineChartData> accelerationImpactList;
    List<CommonLineChartData> impactPositionList;

    boolean isContentVisible = true;

    HorizontalScrollView puttingTempoScrollView;
    ImageView puttingTempoArrow;

    Toolbar toolbar;

    public static FragmentPuttingStatistic newInstance(int sessionId) {
        FragmentPuttingStatistic fragment = new FragmentPuttingStatistic();
        Bundle args = new Bundle();
        args.putInt("sessionId", sessionId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        viewModel = new ViewModelProvider(requireActivity()).get(SettingViewModel.class);

    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.activity_session_performance, container, false);

        viewModel.setShouldExecuteBackButtonAction(true);
        puttingTempoChart = v.findViewById(R.id.session_performance_graph_putting_tempo);
        loftAngleChart = v.findViewById(R.id.session_performance_graph_loft_angle);
        faceAngleImpactChart = v.findViewById(R.id.session_performance_graph_face_angle_impact);
        lieAngleChangeChart = v.findViewById(R.id.session_performance_graph_lie_angle_change);
        accelerationImpactChart = v.findViewById(R.id.session_performance_graph_acceleration_impact);
        impactPositionChart = v.findViewById(R.id.session_performance_graph_impact_position);
        puttingTempoArrow = v.findViewById(R.id.puttingTempoArrow);
        puttingTempoScrollView = v.findViewById(R.id.putting_tempo_graph_layout);
        toolbar = v.findViewById(R.id.toolbar_session_performance);


        // Set the back icon
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back);

        // Handle click event on the back icon
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateBackToPreviousFragment();
            }
        });
        int sessionid = getArguments().getInt("sessionId", 1);

        loadAllGraphs(sessionid);
        return v;

    }

    private void loadAllGraphs(int sessionid) {
        puttViewModel = new ViewModelProvider(this).get(PuttViewModel.class);
        List<CommonLineChartData> puttingTempoList = new ArrayList<>();
        List<CommonLineChartData> loftAngleList = new ArrayList<>();
        List<CommonLineChartData> faceAngleImpactList = new ArrayList<>();
        List<CommonLineChartData> lieAngleChangeList = new ArrayList<>();
        List<CommonLineChartData> accelerationImpactList = new ArrayList<>();
        List<CommonLineChartData> impactPositionList = new ArrayList<>();

        puttViewModel.getAllPuttBySessionIdFromVm(sessionid).observe(getViewLifecycleOwner(), puttModels -> {
            int x = 1;
            for (PuttModel puttModel : puttModels) {
                String bbstrokeRatioStr = puttModel.getBbstrokeRatio();
                String loftAngleStr = String.valueOf(puttModel.getLoftAngle());
                String faceAngleImpactStr = String.valueOf(puttModel.getPutterFaceAng());
                String lieAngleChangeStr = String.valueOf(puttModel.getAngLieStart());
                String accelerationImpactStr = String.valueOf(puttModel.getAccelerationImpact());
                String  impactPositionStr = String.valueOf(puttModel.getElevationAtImp());



                try {
                    float bbstrokeRatio = Float.parseFloat(bbstrokeRatioStr);
                    CommonLineChartData dataObject = new CommonLineChartData();
                    dataObject.setValue(bbstrokeRatio);
                    dataObject.setId(x + 50);  // Adjust the id as needed
                    dataObject.setIndex(x);

                    puttingTempoList.add(dataObject);

                    float loftAngle = Float.parseFloat(loftAngleStr);
                    CommonLineChartData dataObject1 = new CommonLineChartData();
                    dataObject1.setValue(loftAngle);
                    dataObject1.setId(x + 50);  // Adjust the id as needed
                    dataObject1.setIndex(x);

                    loftAngleList.add(dataObject1);

                    float faceAngleImpact = Float.parseFloat(faceAngleImpactStr);
                    CommonLineChartData dataObject2 = new CommonLineChartData();
                    dataObject2.setValue(faceAngleImpact);
                    dataObject2.setId(x + 50);  // Adjust the id as needed
                    dataObject2.setIndex(x);

                    faceAngleImpactList.add(dataObject2);

                    float lieAngleChange = Float.parseFloat(lieAngleChangeStr);
                    CommonLineChartData dataObject3 = new CommonLineChartData();
                    dataObject3.setValue(lieAngleChange);
                    dataObject3.setId(x + 50);  // Adjust the id as needed
                    dataObject3.setIndex(x);

                    lieAngleChangeList.add(dataObject3);


                    float accelerationImpact = Float.parseFloat(accelerationImpactStr);
                    CommonLineChartData dataObject4 = new CommonLineChartData();
                    dataObject4.setValue(accelerationImpact);
                    dataObject4.setId(x + 50);  // Adjust the id as needed
                    dataObject4.setIndex(x);

                    accelerationImpactList.add(dataObject4);

                    float  impactPosition = Float.parseFloat( impactPositionStr);
                    CommonLineChartData dataObject5 = new CommonLineChartData();
                    dataObject5.setValue(impactPosition);
                    dataObject5.setId(x + 50);  // Adjust the id as needed
                    dataObject5.setIndex(x);
                    x++;
                    impactPositionList.add(dataObject5);

                } catch (NumberFormatException e) {
                    e.printStackTrace();
                }
            }
            List<Entry> entryListPuttingTempo = dataValues(puttingTempoList);
            plotPuttingTempoGraph(entryListPuttingTempo);
            List<Entry> entryListLoftAngle = dataValues(loftAngleList);
            plotLoftAngleGraph(entryListLoftAngle);
            List<Entry> entryListFaceAngleImpact = dataValues(faceAngleImpactList);
            plotFaceAngleImpactGraph(entryListFaceAngleImpact);
            List<Entry> entryListLieAngleChange = dataValues(lieAngleChangeList);
            plotLieAngleChangeGraph(entryListLieAngleChange);
            List<Entry> entryListAccelerationImpact = dataValues(accelerationImpactList);
            plotAccelerationImpactGraph(entryListAccelerationImpact);
            List<Entry> entryListImpactPosition = dataValues(impactPositionList);
            plotImpactPositionGraph(entryListImpactPosition);
        });


    }

    private List<Entry> dataValues(List<CommonLineChartData> dataList) {
        ArrayList<Entry> entries = new ArrayList<>();

        for (int i = 0; i < dataList.size(); i++) {
            dataList.get(i).getValue();

            CommonLineChartData dataObject = dataList.get(i);
            float x = dataObject.getIndex();

            float y = (float) dataObject.getValue();

            //this works best
            entries.add(new Entry(Float.valueOf(x), Float.valueOf(y)));

        }
        return entries;
    }


    private void plotPuttingTempoGraph(List<Entry> entryListPuttingTempo) {

        LineDataSet dataSet = new LineDataSet(entryListPuttingTempo, "x");
        dataSet.setColor(Color.RED);
        dataSet.setLineWidth(1f);
        dataSet.setCircleColor(Color.RED);
        dataSet.setCircleRadius(2f);
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setDrawCircleHole(false);
        dataSet.setDrawFilled(true);
        dataSet.setFillColor(Color.RED);
        //experimental
       /*dataSet.setHighlightEnabled(true);
       dataSet.setHighLightColor(Color.WHITE);*/


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

        //to set X axis values from 1-10
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

        //to set X axis values from 1-10
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

        //to set X axis values from 1-10
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

        //to set X axis values from 1-10
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

        //to set X axis values from 1-10
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

        //to set X axis values from 1-10
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

    private void navigateBackToPreviousFragment() {
        FragmentManager fragmentManager = getFragmentManager();

        if (fragmentManager.getBackStackEntryCount() > 0) {
            fragmentManager.popBackStack();
        } else {
        }
    }

}
