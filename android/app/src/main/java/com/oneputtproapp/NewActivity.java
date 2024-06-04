package com.oneputtproapp;

import static java.lang.Float.NaN;
import static java.lang.Float.parseFloat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothManager;
import android.content.DialogInterface;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatTextView;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.view.ViewCompat;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.ViewModelProvider;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.utils.EntryXComparator;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.slider.Slider;
import com.google.gson.Gson;
import com.oneputtproapp.BLEDataListner;
import com.oneputtproapp.Calculation.CSVReaderMainMethod;
import com.oneputtproapp.DataBase.PuttModel;
import com.oneputtproapp.DataBase.PuttViewModel;
import com.oneputtproapp.DataBase.SinglePuttData;
import com.oneputtproapp.DataBase.SyncSessionDataModel;
import com.oneputtproapp.Network.APIClient;
import com.oneputtproapp.Network.API_Interface;
import com.oneputtproapp.Network.SoundPlayer;
import com.oneputtproapp.YoutGattCallback;

import org.tensorflow.lite.Interpreter;

import java.io.DataOutputStream;
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

import androidx.appcompat.widget.TooltipCompat;

public class NewActivity extends AppCompatActivity implements BLEDataListner, DefaultHardwareBackBtnHandler {
    private volatile boolean isSensorThreadRunning = false;
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    private boolean isLoopRunning = false;
    private double accelX1, accelY1, accelZ1, gyroX1, gyroY1, gyroZ1;
    private int batPercentage1;
    private PopupWindow popupWindow;
    private YoutGattCallback mGattcallback;
    private ImageView iconImageView, putt_resultViewDetailsImgGolfStick;
    private TextView descriptionTextView;
    private static final String TAG = "YourActivity";
    private LineChart mChart;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothGatt mBluetoothGatt;
    String[] receivedScoreData = new String[12];
    private boolean isConditionMet = false, isConditionMet1 = false, isConditionMet2 = false;
    private boolean isSoundPlayed = false, isSoundPlayed1 = false, isSoundPlayed2 = false;
    private SoundPlayer soundPlayer;
    LinearLayout btnLoftAngle, btnPuttingTempo, btnPuttingSetting, btnPutterFaceAngle, btnPutterAnglePosition,
            btnLieAngleChange, btnAccelerationImpact;
    List<SinglePuttData> singlePuttData = new ArrayList<>();
    Toolbar toolbar;
    MaterialButton btnSetting, btnStatistic;
     private AppPreferences appPreferences;
    String[] scoreData = new String[12];
    ArrayList<String> settingScoreData;
    EditText puttingAccelerationImpactTarget, puttingAcelerationImpactDeviation, puttingLoftangleTarget,
            puttingLoftangleDeviation, puttingLieImpactTarget, puttingLieImpactDeviation, puttingLieStartTarget,
            puttingLieStartDeviation;

    LinearLayout puttingTempoExpandableLayout, accelerationImpactExpandableLayout, lieAngleExpandableLayout,
            puttingExpandable, loftAngleExpandableLayout, putterFaceAngleExpandableLayout,
            putterFacePositionAngleExpandableLayout;
    TextView accelerationImpactDegreeTxt, accelerationImpactValueTxt, lieAngleValueTxt, lieAngleStart, lieAngleImpact,
            putterFacePositionAngleDecreeTxt, putterFacePositionAngleValueTxt, puttingTempoGreenTxt, puttingTempoRedTxt,
            puttingTempoValueTxt, batteryPercent, loftAngleDegreeTxt, loftAngleValueTxt, putterFaceAngleDegreeTxt,
            putterFaceAngleValueTxt;
    ImageView lieAngleArrow, PutterPositionImgGolfStick, lieAngleGolfStick, putterFacePositionAngleArrow,
            accelerationImpactArrow, puttingTempoArrow, loftAngleArrow, loftAngleStick, puttingSettingArrow,
            putterFaceAngleArrow, PutterFaceAngleImgGolfStick;
    Slider threshouldPuttingseekbar;
    AppCompatTextView putterPercentageValue, putterPuttNumberTxtValue, FtPuttingDistance;
    Button btnStart, btnPausePractice, btnStop;
    View screenColor;
    private int TotalputtDataScore = 0;
    // private LineChart mChart;
    private String sessionstart_datetime;

    int numPuttsCount = 1;

    Interpreter tfliteInterpreter = null;

    int puttMinutes = 0, puttingDistance = 0, userId = 0;
    String puttSessionName;
    int sessionId = 0;
    SyncSessionDataModel syncSessionDataModel;
    private  boolean isPracticePause = false;
    private final boolean isStartTrue = false;

    private DataOutputStream dataOutputStream;
    ProgressBar progressBar;
    private PuttViewModel puttViewModel;
    private boolean isRunning = true;
  
    private SettingViewModel viewModel1;
    ImageView loftInfoIcon;
    private PopupWindow tooltipPopup;
    private String macAddress;
    private Context context;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
         viewModel1 = new ViewModelProvider(this).get(SettingViewModel.class);
        // viewModel1 = new ViewModelProvider(requireActivity()).get(SettingViewModel.class);
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            // BLE is not supported
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "low_battery_channel",
                    "Low Battery Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        appPreferences = new AppPreferences(this);
        setContentView(R.layout.activity_my_new);
        soundPlayer = new SoundPlayer();
        screenColor = findViewById(R.id.putt_screencolor);


        // viewModel1 = new ViewModelProvider(this).get(SettingViewModel.class);
        putt_resultViewDetailsImgGolfStick = findViewById(R.id.putt_resultViewDetailsImgGolfStick);
        progressBar = findViewById(R.id.putt_progress_bar_single_putt);
        putterPercentageValue = findViewById(R.id.putt_resultViewPutterPercentage);
        putterPuttNumberTxtValue = findViewById(R.id.putt_resultViewPutterPuttNumber);
        batteryPercent = findViewById(R.id.batteryPercentage);
        //ids for putting tempo
        mChart = findViewById(R.id.putt_lineChart);
        btnStart = findViewById(R.id.putt_btnStopPractice);
        btnStop = findViewById(R.id.putt_btnStopPractice);
        FtPuttingDistance = findViewById(R.id.putt_ftText);
        btnPausePractice = findViewById(R.id.putt_btnPausePractice);
        btnPuttingTempo = findViewById(R.id.putt_puttingTempoLayout);
//        btnPuttingSetting = findViewById(R.id.btnPuttingSetting);
        puttingTempoExpandableLayout = findViewById(R.id.putt_resultViewPuttingExpandableLayout);
//        puttingExpandable = findViewById(R.id.puttingExpandableLayout);
        puttingTempoValueTxt = findViewById(R.id.putt_resultViewPuttingValueTxt);
        puttingTempoGreenTxt = findViewById(R.id.putt_PuttingGreenTxtValue);
        puttingTempoRedTxt = findViewById(R.id.putt_PuttingRedTxtValue);
        puttingTempoArrow = findViewById(R.id.putt_puttingTempoArrow);
//        puttingSettingArrow = findViewById(R.id.puttingSettingArrow);
        //ids for loft angle
        btnLoftAngle = findViewById(R.id.putt_loftAngleLayout);
        loftAngleExpandableLayout = findViewById(R.id.putt_resultViewDetailsLoftAngleExpandableLayout);
        loftAngleValueTxt = findViewById(R.id.putt_loftAngleValueTxt);
        loftAngleDegreeTxt = findViewById(R.id.putt_loftAngleDegreeTxt);
        loftAngleArrow = findViewById(R.id.putt_loftAngleArrowImg);
        loftAngleStick = findViewById(R.id.putt_loftAngleStick);

        //ids for Putter Face Angle
        btnPutterFaceAngle = findViewById(R.id.putt_putterFaceAngleLayout);
        putterFaceAngleExpandableLayout = findViewById(R.id.putt_resultViewDetailsPutterFaceAngleExpandableLayout);
        putterFaceAngleValueTxt = findViewById(R.id.putt_resultViewPutterFaceAngleValue);
        putterFaceAngleDegreeTxt = findViewById(R.id.putt_resultViewPutterFaceAngleDegreeTxt);
        putterFaceAngleArrow = findViewById(R.id.putt_resultViewPutterFaceAngleArrowImg);
        PutterFaceAngleImgGolfStick = findViewById(R.id.putt_resultViewPutterFaceAngleImgGolfStick);

        //ids for Putter  Angle Position
        btnPutterAnglePosition = findViewById(R.id.putt_putterFacePositionAngleLayout);
        putterFacePositionAngleExpandableLayout = findViewById(R.id.putt_resultViewDetailsPutterFaceAnglePositionExpandableLayout);
        putterFacePositionAngleValueTxt = findViewById(R.id.putt_resultViewPutterFacePositionAngleValue);
        putterFacePositionAngleDecreeTxt = findViewById(R.id.putt_resultViewDetailsPutterFacePositionDegreeTxt);
        putterFacePositionAngleArrow = findViewById(R.id.putt_resultViewPutterFacePositionArrow);
        PutterPositionImgGolfStick = findViewById(R.id.putt_resultViewPutterPositionImgGolfStick);

        //ids for Lie  Angle Position
        btnLieAngleChange = findViewById(R.id.putt_lieAngleLayout);
        lieAngleExpandableLayout = findViewById(R.id.putt_resultViewDetailsLieExpandableLayout);
        lieAngleValueTxt = findViewById(R.id.putt_resultViewDetailsLieAngleValueTxt);
        lieAngleStart = findViewById(R.id.putt_lieAngleStart);
        lieAngleImpact = findViewById(R.id.putt_resultViewImageLieAngleImpact);
        lieAngleArrow = findViewById(R.id.putt_resultViewDetailsLieAngleImgArrow);
        lieAngleGolfStick = findViewById(R.id.putt_resultViewImageLieAngle);

        //ids for  Acceleration-Impact Position
        btnAccelerationImpact = findViewById(R.id.putt_accelerationImpactLayout);
        accelerationImpactExpandableLayout = findViewById(R.id.putt_resultViewDetailsAccelerationImpactExpandableLayout);
        accelerationImpactValueTxt = findViewById(R.id.putt_resultViewAccelerationValue);
        accelerationImpactDegreeTxt = findViewById(R.id.putt_resultViewDetailsAcceleratioImpactDegreeTxt);
        accelerationImpactArrow = findViewById(R.id.putt_resultViewAccelerationImageArrow);



        btnSetting = findViewById(R.id.btnSetting);
        btnStatistic = findViewById(R.id.btnStatistic);
        // Open the Settings Fragment when the settings button is clicked
        btnSetting.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.e("in open ", "frgmnent");
                openSettingsFragment();
            }
        });
        btnStatistic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.e("in open ", "frgmnent");
                openStatisticFragment(sessionId);
            }
        });


//        toolbar = findViewById(R.id.toolbar);
        ImageView graphview = findViewById(R.id.graphview);
        ImageView informationIcon = findViewById(R.id.puttingTempoInfoIcon);
        ImageView loftInfoIcon = findViewById(R.id.loftInfoIcon);
        ImageView putterFaceinfoIcon = findViewById(R.id.putterFaceinfoIcon);
        ImageView PutterFacePosiInfoIcon = findViewById(R.id.PutterFacePosiInfoIcon);
        ImageView lieAngleInfoIcon = findViewById(R.id.lieAngleInfoIcon);
        ImageView accelrationImpactInfoIcon = findViewById(R.id.accelrationImpactInfoIcon);


        graphview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "The path followed by putter head");
            }
        });
        informationIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "The ratio between front to backstroke");
            }
        });

        loftInfoIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "Determines the spin applied on the golf ball.(Forward/Backward)");
            }
        });
        putterFaceinfoIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "Determines if the face of putter is square, open or closed ");
            }
        });
        PutterFacePosiInfoIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "Determines the impact point difference from centre of putter");
            }
        });

        lieAngleInfoIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "Angle at which the putter is held with relation to the ground");
            }
        });

        accelrationImpactInfoIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showTooltip(v, "The acceleration determines the distance covered by the golf ball");
            }
        });

        useFunctionalityByPassingMainLayout(btnPuttingTempo, puttingTempoExpandableLayout, puttingTempoArrow);//for puttingTempo
        useFunctionalityByPassingMainLayout(btnLoftAngle, loftAngleExpandableLayout, loftAngleArrow);
        useFunctionalityByPassingMainLayout(btnPutterFaceAngle, putterFaceAngleExpandableLayout, putterFaceAngleArrow);
        useFunctionalityByPassingMainLayout(btnPutterAnglePosition, putterFacePositionAngleExpandableLayout, putterFacePositionAngleArrow);
        useFunctionalityByPassingMainLayout(btnLieAngleChange, lieAngleExpandableLayout, lieAngleArrow);
        useFunctionalityByPassingMainLayout(btnAccelerationImpact, accelerationImpactExpandableLayout, accelerationImpactArrow);
        progressBar.setProgress(0);

        syncSessionDataModel = new SyncSessionDataModel();
        // Set up the BluetoothGattCallback and connect to the Bluetooth device
        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();


        // Check if Bluetooth is supported on the device
        if (mBluetoothAdapter == null) {
            Log.e(TAG, "Bluetooth not supported.");
           
            return;
        }

        // Initialize the GattCallback if not already done

        mGattcallback = new YoutGattCallback(this);
        mGattcallback.setBLEDataListener(this);
        String modelPath = "tflite_model_8.tflite";
        btnPausePractice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (isPracticePause) {
                    isPracticePause = false;
                    btnPausePractice.setText("Pause Practice");
                    
                    btnPausePractice.setBackgroundColor(getResources().getColor(R.color.loginBtnColor));
                    btnPausePractice.setTextColor(getResources().getColor(R.color.white));
                    
                } else {
                    isPracticePause = true;
                    btnPausePractice.setText("Resume Practice");
                    btnPausePractice.setBackgroundColor(getResources().getColor(R.color.black));
       btnPausePractice.setTextColor(getResources().getColor(R.color.white));
                }

                Log.e("onClick: ", String.valueOf(isPracticePause));
            }
        });
        btnStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopSensorThread();
                stopRunning();
                if (mBluetoothGatt != null) {
                    if (ActivityCompat.checkSelfPermission(NewActivity.this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                        return;
                    }
                    mBluetoothGatt.disconnect();
                }
                puttViewModel = ViewModelProvider.AndroidViewModelFactory.getInstance(getApplication()).create(PuttViewModel.class);
                puttViewModel.getAllPuttBySessionIdFromVm(sessionId).observe(NewActivity.this, puttModels -> {
                    singlePuttData.clear();
                    if (puttModels != null && !puttModels.isEmpty()) {

                        for (PuttModel puttModel : puttModels) {
                            SinglePuttData singlePutt = new SinglePuttData();

                            singlePutt.setBbstrokeRatio(puttModel.getBbstrokeRatio());
                            singlePutt.setElevationAtImp(puttModel.getElevationAtImp());
                            singlePutt.setOffCentreImp(puttModel.getOffCenterImp());
                            singlePutt.setLoftAngle(puttModel.getLoftAngle());
                            singlePutt.setAngLieStart(puttModel.getAngLieStart());
                            singlePutt.setAngLieImp(puttModel.getAngLieImp());
                            singlePutt.setPutterFaceAng(puttModel.getPutterFaceAng());
                            singlePutt.setFrontStroke(puttModel.getFrontStroke());
                            singlePutt.setBackStroke(puttModel.getBackStroke());
                            singlePutt.setVelocityAbs(puttModel.getVelocityAbs());
                            singlePutt.setAcceleration_impact(puttModel.getAccelerationImpact());
                            singlePutt.setScorePutt(puttModel.getScore_putt());
                            singlePutt.setFtDistance(puttingDistance);
                            singlePutt.setAvg_score(0);

                            singlePuttData.add(singlePutt);
                            TotalputtDataScore = puttModel.getScore_putt() + TotalputtDataScore;
                        }
                    SessionViewModel sessionViewModel = (SessionViewModel) new ViewModelProvider(NewActivity.this).get(SessionViewModel.class);
                    SyncSessionMethod(singlePuttData);
                    Log.d("singlePuttData", String.valueOf(singlePuttData.size()));
                    } else {
                        Log.d("LiveData :", "Data not found");
                     PredictClassModule.getInstance().handleBackPress();
                            finish();
                    
                    }
                 });
              
            }
        });

        try {
            tfliteInterpreter = new Interpreter(loadModelFile(modelPath), null);
            startSensorThread();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void showTooltip(View anchorView, String tooltipText) {
        // Inflate the custom tooltip layout
        LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View tooltipView = inflater.inflate(R.layout.popup_layout, null);

        // Set the tooltip text based on the provided parameter
        TextView tooltipTextView = tooltipView.findViewById(R.id.tooltip_text);
        tooltipTextView.setText(tooltipText);

        // Create a PopupWindow with the custom layout
        PopupWindow tooltipPopup = new PopupWindow(tooltipView, ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, true);

        // Customize the appearance and behavior of the tooltipPopup
        tooltipPopup.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        tooltipPopup.setElevation(8); // Optional: Add elevation for shadow effect
        tooltipPopup.setOutsideTouchable(true);
        tooltipPopup.setFocusable(true);
        int xOffset = 0; // Adjust this value as needed
        int yOffset = -20;

        // // Show the tooltip below the anchorView
        // tooltipPopup.showAsDropDown(anchorView);
        tooltipPopup.showAsDropDown(anchorView, xOffset, yOffset);

    }

    private void addDescriptionToExpandableLayout() {
        // Create a TextView to hold the description
        TextView descriptionTextView = new TextView(this);
        descriptionTextView.setLayoutParams(
                new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT));
        descriptionTextView.setText("Your description goes here.");
        descriptionTextView.setTextColor(getResources().getColor(R.color.red));
       
        // Add the TextView to the expandable layout
        // putt_resultViewDetailsImgGolfStick(descriptionTextView);
    }

    private void useFunctionalityByPassingMainLayout(LinearLayout lnrMainLayout, LinearLayout lnrExpandableLayout,
            ImageView imageArrow) {
        lnrMainLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showHideExpandbleLayout(imageArrow, lnrExpandableLayout);
            }
        });

    }

    private void showCustomTooltip(View anchorView, String tooltipText) {
        Log.d("Tooltip", "Click event triggered");
        View tooltipView = getLayoutInflater().inflate(R.layout.popup_layout, null);
        ((TextView) tooltipView.findViewById(R.id.tooltip_text)).setText(tooltipText);

        PopupWindow popupWindow = new PopupWindow(tooltipView, ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT, true);
        popupWindow.showAsDropDown(anchorView);
    }

    public void stopRunning() {
        isRunning = false;
    }

    public void setUpPutterProgressData(int putterPercentage, int putterPuttNumber) {
        progressBar.setProgress(putterPercentage* 10);
        progressBar.setMax(100);
        putterPercentageValue.setText(putterPercentage * 10 + "%");
        putterPuttNumberTxtValue.setText("Putt Number " + putterPuttNumber);

    }

    public void setUpValuesForPuttingTempo(String puttingTempoValue, String redArrowValue, String greenArrowValue) {

        puttingTempoValueTxt.setText(puttingTempoValue);
        puttingTempoRedTxt.setText(redArrowValue + " sec");
        puttingTempoGreenTxt.setText(greenArrowValue + " sec");

    }

    private void setUpValuesForLoftAngle(String loftAngleValue, String loftAngleDecree) {
        loftAngleValueTxt.setText("Open : " + loftAngleValue);
        loftAngleDegreeTxt.setText(loftAngleDecree + getString(R.string.degree_symbol_string));
    }

    private void setUpValuesForLoftAnglePosition(int newTopMargin) {
        loftAngleStick.setTranslationY(newTopMargin);
    }

    private void setUpValuesForPutterFaceAngle(String putterFaceAngleValue, String putterFaceAngleDegree) {
        if (parseFloat(putterFaceAngleDegree) > 0) {
            putterFaceAngleDegreeTxt
                    .setText("Open : " + putterFaceAngleDegree + getString(R.string.degree_symbol_string));
            putterFaceAngleValueTxt.setText("Open : " + putterFaceAngleValue);
        } else {
            putterFaceAngleDegreeTxt
                    .setText("Close : " + putterFaceAngleDegree + getString(R.string.degree_symbol_string));
            putterFaceAngleValueTxt.setText("Close : " + putterFaceAngleValue);
        }

    }

    private void setUpValuesForPutterAnglePosition(String putterFacePositionAngleValue,
            String putterFacePositionAngleDecree) {

        putterFacePositionAngleValueTxt.setText(putterFacePositionAngleValue);
        putterFacePositionAngleDecreeTxt.setText("Putter Face Pos: " + putterFacePositionAngleDecree);
    }

    private void setUpValuesForLieAngle(String lieAnglestartValue, String lieAngleimpactValue) {
        lieAngleStart.setText("Lie Angle Start : " + lieAnglestartValue);
        lieAngleImpact.setText("Lie Angle Impact : " + lieAngleimpactValue);
        lieAngleValueTxt.setText(lieAngleimpactValue);
    }

    private void setUpValuesForPutterAccelarationImpact(String accelerationImpactValue,
            String accelerationImpactDegree) {
        accelerationImpactValueTxt.setText(accelerationImpactValue + "m/s");
        accelerationImpactDegreeTxt.setText(accelerationImpactValue + "m/s");
    }

    private void showHideExpandbleLayout(ImageView imgArrow,
            LinearLayout expandableLnrLayout) {
        if (expandableLnrLayout.getVisibility() == View.VISIBLE) { // need to hide layout
            expandableLnrLayout.setVisibility(View.GONE);
            imgArrow.setRotation(180);
        } else { // need to show layout
            expandableLnrLayout.setVisibility(View.VISIBLE);
            imgArrow.setRotation(0);
        }

    }

    private void stopSensorThread() {
        // Set the flag to stop the SensorThread gracefully
        isSensorThreadRunning = false;
        isLoopRunning = false;
    }

    private void startSensorThread() {
        isSensorThreadRunning = true;

        Handler handler;
        handler = new Handler(Looper.getMainLooper());
        isLoopRunning = true;

        ReceiveSensorDataThread dataThread = new ReceiveSensorDataThread();
        Thread startThread = new Thread(dataThread);
        if (isLoopRunning) {
            startThread.start();
        }
        try {
            SessionViewModel sessionViewModel = (SessionViewModel) new ViewModelProvider(this)
                    .get(SessionViewModel.class);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SS");
            sessionstart_datetime = dateFormat.format(new Date());
            SessionModel sessionModel = new SessionModel(userId, 0, sessionstart_datetime, "0", 0, false);
            sessionViewModel.insertSession(sessionModel).observe(this, sessionId1 -> {
                sessionId = Math.toIntExact(sessionId1);

                System.out.println("Generated sessionId: " + sessionId);
                // // Perform further operations with the sessionId
            });

        } catch (Exception e) {
            e.printStackTrace();
            Log.e("Check: ", "Invalid session");
        }

        userId = getIntent().getIntExtra("userId", 0);
        puttMinutes = Integer.parseInt(getIntent().getExtras().getString("noOfPuttMinutes", "0"));
        puttingDistance = getIntent().getIntExtra("puttingDistance", 0);
        settingScoreData=getIntent().getStringArrayListExtra("scoreData");
 

// Now, `scoreDataList` contains the ArrayList you sent from the other activity

        puttSessionName = getIntent().getExtras().getString("sessionName", "session");
        if (puttSessionName == "") {
            puttSessionName = "sesssion" + getCurrentDateWithSpecificFormat();
        }
        FtPuttingDistance.setText("(" + puttingDistance + " ft)");
      
       
        if (settingScoreData != null && settingScoreData.size() == 12) {
            // Copy values from settingScoreData to scoredata
            for (int i = 0; i < 12; i++) {
                scoreData[i] = settingScoreData.get(i);
               }
 System.out.println("scorevalue: " + Arrays.toString(scoreData));
         } 
                

        viewModel1.setScoreDataValue(scoreData);
        viewModel1.setSliderValue(String.valueOf(puttingDistance));
        int TIMEOUT_MS = 8 * 60 * 1000;
        // After a certain time, stop the thread
        Log.e("df", "sdfd");
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                dataThread.stopRunning();
            }
        }, TIMEOUT_MS);
    }

    @Override
    public void onBLEDataReceived(double accelX, double accelY, double accelZ, double gyroX, double gyroY, double gyroZ,
            int batPercentage) {
        accelX1 = accelX;
        accelY1 = accelY;
        accelZ1 = accelZ;
        gyroX1 = gyroX;
        gyroY1 = gyroY;
        gyroZ1 = gyroZ;
        batPercentage1 = batPercentage;
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
//    @Override
//    public void onBackPressed() {
//        FragmentPuttingSetting fragment = (FragmentPuttingSetting) getSupportFragmentManager().findFragmentById(R.id.fragment_container2);
//
//        if (fragment != null && viewModel1.getShouldExecuteBackButtonAction()) {
//            fragment.onBackButtonPressed();
//            System.out.println("in if ");
//
//            viewModel1.setShouldExecuteBackButtonAction(false);
//        } else {
//            // The fragment-specific logic has been handled, now proceed with the activity logic
//            stopSensorThread();
//            stopRunning();
//
//            if (mBluetoothGatt != null) {
//                if (ActivityCompat.checkSelfPermission(NewActivity.this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
//                    return;
//                }
//                mBluetoothGatt.disconnect();
//            }
//            System.out.println("inelse");
//            PredictClassModule.getInstance().handleBackPress();
//            finish();
//            super.onBackPressed();
//        }
//    }


    @Override
    public void onBackPressed() {
        System.out.println(viewModel1.getShouldExecuteBackButtonAction());
//        if (viewModel1.getShouldExecuteBackButtonAction()  && viewModel1.getShouldExecuteBackButtonAction() ==true ) {
        Boolean shouldExecuteAction = viewModel1.getShouldExecuteBackButtonAction();
        if (shouldExecuteAction != null && shouldExecuteAction) {
FragmentPuttingSetting fragment = (FragmentPuttingSetting) getSupportFragmentManager().findFragmentById(R.id.fragment_container2);
            System.out.println("in if ");
            if (fragment != null) {
                fragment.onBackButtonPressed();
                viewModel1.setShouldExecuteBackButtonAction(false);

            }else{
                PredictClassModule.getInstance().handleBackPress();
                finish();
            }
        } else {
         System.out.println("inelse");
            stopSensorThread();
            stopRunning();
            if (mBluetoothGatt != null) {
                if (ActivityCompat.checkSelfPermission(NewActivity.this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                mBluetoothGatt.disconnect();
            }

            PredictClassModule.getInstance().handleBackPress();
            finish();

        }
        super.onBackPressed();
    }
 
//     @Override
//     public void onBackPressed() {
//         // Handle the back press event here
//         stopSensorThread();
//         stopRunning();
//         if (mBluetoothGatt != null) {
//             if (ActivityCompat.checkSelfPermission(NewActivity.this,
//                     Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
//                 return;
//             }
//             mBluetoothGatt.disconnect();
//         }
//         PredictClassModule.getInstance().handleBackPress();
//          finish();
//         super.onBackPressed();
//     }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mReactInstanceManager.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    // for connection this is first thread
    public class ReceiveSensorDataThread implements Runnable {
        private boolean isRunning = true;

        @Override
        public void run() {
            try {
                // SharedPreferences preferences = getSharedPreferences("device",
                // Context.MODE_PRIVATE);

                String macAddress = getIntent().getStringExtra("mac_address");
               
                BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(macAddress);
                Log.e("device", String.valueOf(device));
                if (ActivityCompat.checkSelfPermission(NewActivity.this,
                        Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {

                    return;
                }
                Log.e("device", String.valueOf(device));

                if (device != null) {

                    mBluetoothGatt = device.connectGatt(NewActivity.this, false, mGattcallback);
                    Log.e("device", String.valueOf(device));

                    updateNoOfPuttUi(0);
                    byte[] data = new byte[56];
                    // Initialize BluetoothAdapter

                    Handler handler;
                    handler = new Handler(Looper.getMainLooper());
                    // Connect to your Bluetooth device
                    // assume that the data is received as a byte array called "receivedData"

                    float[][] windowArray = { { 0, 0, 0, 0, 0, 0, 0, 0, 0 }, { 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0 }, { 0, 0, 0, 0, 0, 0, 0, 0, 0 }, { 0, 0, 0, 0, 0, 0, 0, 0, 0 },
                            { 0, 0, 0, 0, 0, 0, 0, 0, 0 } };

                    PredictClass predictClass = new PredictClass();
                    int[] output_arr = new int[30];
                    float[] oldSensorData = new float[] { 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                    // String timestamp = getCurrentDateWithSpecificFormat();

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
                    // boolean isButtonResetPressed = false;

                    File root = new File(Environment.getExternalStorageDirectory(),
                            "/Android/media/" + getPackageName());
                    root.mkdir();

                    // create day-wise sub-folder
                    String timestampDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
                    boolean calculate = false;

                    File subFolder = new File(root, timestampDate);
                    subFolder.mkdir();

                    // number of putts
                    // while (System.currentTimeMillis() - startTime < numTime) {
                    Thread.sleep(4000);
                    while (isSensorThreadRunning) {

                        Log.e("currentTime", String.valueOf(new Date()));
                        Thread.sleep(6);

                        if (!isStartTrue) {

                            if ((System.currentTimeMillis() - frequencyStartTime) < 1000) {
                                frequencyCount++;
                            } else {
                                // double frequency = (double) frequencyCount / 1.0; // Divide by 1 second
                                int finalFrequencyCount = frequencyCount;
                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        // txtFrequency.setText(String.valueOf(finalFrequencyCount));
                                    }
                                });

                                frequencyCount = 0;
                                frequencyStartTime = System.currentTimeMillis();
                            }

                            if (lastBatteryCount == 0) {
                                lastBatteryCount = batPercentage1;
                                if (lastBatteryCount != 0) {
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            if (batPercentage1 > 100) {
                                                batteryPercent.setText("Battery: " + "100" + "%");
                                            } else {
                                                batteryPercent.setText("Battery: " + batPercentage1 + "%");
                                            }
                                            if (batPercentage1 < 10) {
                                                showLowBatteryDialog();

                                            }
                                        }
                                    });
                                }
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

                            double[][] sensorArray = { { accelX2, accelY2, accelZ2, gyroX2, gyroY2, gyroZ2 } };
                            double[] getRotationData = getRotation(sensorArray[0][0], sensorArray[0][1],
                                    sensorArray[0][2], sensorArray[0][3], sensorArray[0][4], sensorArray[0][5]);

                            double[] input = { sensorArray[0][0], sensorArray[0][1], sensorArray[0][2],
                                    sensorArray[0][3], sensorArray[0][4], sensorArray[0][5], getRotationData[0],
                                    getRotationData[1], getRotationData[2] };
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

                                check_time = System.currentTimeMillis(); // Reset the start time if pred is not equal to
                                                                         // 2
                                screenColor.setBackgroundColor(getResources().getColor(R.color.red));
                                Log.e("==WAITING====: ", count + "  ===WAITING===");

                            } else if (System.currentTimeMillis() - check_time >= 1000) {
                                screenColor.setBackgroundColor(getResources().getColor(R.color.blue));
                                Log.e("==SAVING====: ", count + "  ===SAVING===");

                                isConditionMet = true;
                                if (isConditionMet && !isSoundPlayed) {
                                    soundPlayer.playSound(NewActivity.this, R.raw.start);
                                    isSoundPlayed = true;
                                    isConditionMet = false;
                                }

                                float current_time = (System.currentTimeMillis() - start_time) / 1000f;

                                float[] data_point = { current_time, (float) gyroX1, (float) gyroY1, (float) gyroZ1,
                                        (float) accelX1, (float) accelY1, (float) accelZ1, }; // create new data point
                                                                                              // as a float array
                                dataArray.add(data_point);
                                record = true;
                                //

                                if (max_value == 1 && record) {
                                    screenColor.setBackgroundColor(getResources().getColor(R.color.green));
                                    calculate = true;
                                    Log.e("==RESETTING====: ", count + "  Calculate");

                                    // // Update the screen
                                } else if (max_value == 0) {
                                    //
                                } else {
                                    Log.e("==RESETTING====: ", count + "  ===RESETTING===");

                                    if (calculate) {

                                        try {
                                            Log.e("Calculate: ", count + "  Calculating");

                                            // create .csv files
                                            String timestamp = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss")
                                                    .format(new Date());
                                            File f = new File(subFolder, "sensor_data_" + timestamp + ".csv");
                                            FileWriter writer = new FileWriter(f);
                                            for (int i = 0; i < dataArray.size(); i++) {
                                                writer.write(dataArray.get(i)[0] + "," + dataArray.get(i)[1] + ","
                                                        + dataArray.get(i)[2] + "," + dataArray.get(i)[3] + ","
                                                        + dataArray.get(i)[4] + "," + dataArray.get(i)[5] + ","
                                                        + dataArray.get(i)[6] + "\n");
                                            }

                                            writer.close();

                                             String updatedSliderValue = viewModel1.getSliderValue();

                                             if (updatedSliderValue != null) {
                                             // Log the updatedValue to the log
                                             Log.e("Updated Value", updatedSliderValue);
                                             puttingDistance = Integer.parseInt(updatedSliderValue);
                                             } else {
                                             Log.e("Updated Value", "Value is null");
                                             }
                                           
                                            String[] updatedScoreValue = viewModel1.getScoreDataValue();
                                            System.out.println("updatedScoreValue"+updatedScoreValue[0]);
                                             if (updatedScoreValue != null) {
                                            //  receivedScoreData = updatedScoreValue;
                                            scoreData=updatedScoreValue;
                                            viewModel1.setScoreDataValue(scoreData);


                                             } else {
                                             Log.e("Updated Value", "Value is null");
                                             }
                                             System.out.println("puttingDistance3" + puttingDistance);
                                            //  receivedScoreData=
                                            int[] positionsToRemove = {2, 5, 8, 11};

                                            // Calculate the new array length after removing elements
                                            int newArrayLength = scoreData.length - positionsToRemove.length;
                                            
                                            String[] receivedScoreData = new String[newArrayLength];

                                            // Index for the new array
                                            int newIndex = 0;
                                            
                                            for (int i = 0; i < scoreData.length; i++) {
                                                // Check if the current position should be removed
                                                if (Arrays.binarySearch(positionsToRemove, i) < 0) {
                                                    // Element at this position should not be removed, add it to the new array
                                                    receivedScoreData[newIndex] = scoreData[i];
                                                    System.out.println("receivedScoreData"+receivedScoreData[newIndex]);
                                                    newIndex++;
                                                }
                                            }
                                          
                                            Map dataMap = CSVReaderMainMethod.calculation(dataArray, puttingDistance,
                                            receivedScoreData);//receivedata
                                            plotLineChartWithSingleLineDataSet(dataMap);
                                            enablePauseBtn();
                                            check_time1 = System.currentTimeMillis();

                                            isConditionMet1 = true;
                                            if (isConditionMet1 && !isSoundPlayed1) {
                                                soundPlayer.playSound(NewActivity.this, R.raw.stop);
                                                isSoundPlayed1 = true;
                                                isConditionMet1 = false;
                                            }

                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {
                                                    setUpPutterProgressData((int) dataMap.get("avgScore"),
                                                            numPuttsCount);
                                                    setUpValuesForPuttingTempo(
                                                            String.valueOf(dataMap.get("ratio_back_front")),
                                                            String.format("%.2f", dataMap.get("backstroke_time")),
                                                            String.format("%.2f", dataMap.get("front_impact_time")));
                                                    setUpValuesForLoftAngle(
                                                            String.format("%.2f", dataMap.get("loft_angle")),
                                                            String.format("%.2f", dataMap.get("loft_angle")));
                                                    double newTopMargin = (double) dataMap.get("elevation_impact") * 10;
                                                    loftAngleStick.setTranslationY((float) newTopMargin);
                                                    FtPuttingDistance.setText("(" + puttingDistance + " ft)");
                                                    setUpValuesForPutterFaceAngle(
                                                            String.format("%.2f", dataMap.get("diff_yaw")),
                                                            String.format("%.2f", dataMap.get("diff_yaw")));
                                                    double newRotation = (double) dataMap.get("diff_yaw");
                                                    PutterFaceAngleImgGolfStick
                                                            .setPivotX((PutterFaceAngleImgGolfStick.getWidth() / 2));
                                                    PutterFaceAngleImgGolfStick
                                                            .setPivotY(PutterFaceAngleImgGolfStick.getHeight() / 2);
                                                    PutterFaceAngleImgGolfStick.setRotation((float) newRotation);
                                                    setUpValuesForPutterAnglePosition(
                                                            String.format("%.2f", dataMap.get("pos_y_impact")),
                                                            String.format("%.2f", dataMap.get("pos_y_impact")));
                                                    double newTopMargin1 = (double) dataMap.get("pos_y_impact") * 10;
                                                    PutterPositionImgGolfStick.setTranslationY((float) newTopMargin1);
                                                    setUpValuesForLieAngle(
                                                            String.format("%.2f", dataMap.get("roll_start")),
                                                            String.format("%.2f", dataMap.get("roll_impact")));
                                                    setUpValuesForPutterAccelarationImpact(
                                                            String.format("%.2f", dataMap.get("accelerationImpact")),
                                                            String.format("%.2f", dataMap.get("accelerationImpact")));
                                                    puttViewModel = ViewModelProvider.AndroidViewModelFactory
                                                            .getInstance(getApplication()).create(PuttViewModel.class);
                                                    String jsonFrontStrokeString = new Gson()
                                                            .toJson(dataMap.get("front_stroke"));
                                                    String jsonBackStrokeString = new Gson()
                                                            .toJson(dataMap.get("backstroke"));
                                                    String jsonVelocityabsString = new Gson()
                                                            .toJson(dataMap.get("velocity_abs"));
                                                    PuttModel puttModel = new PuttModel(userId, sessionId,
                                                            dataMap.get("ratio_back_front").toString(),
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("elevation_impact").toString()) * 100.0)
                                                                    / 100.0,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("pos_y_impact").toString()) * 100.0)
                                                                    / 100.0,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("loft_angle").toString()) * 100.0)
                                                                    / 100.0,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("roll_start").toString()) * 100.0)
                                                                    / 100.0,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("roll_impact").toString()) * 100.0)
                                                                    / 100.0,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("diff_yaw").toString()) * 100.0)
                                                                    / 100.0,
                                                            jsonFrontStrokeString, jsonBackStrokeString,
                                                            jsonVelocityabsString,
                                                            Math.round(Double.parseDouble(
                                                                    dataMap.get("accelerationImpact").toString())
                                                                    * 100.0) / 100.0,
                                                            (int) dataMap.get("avgScore"));
                                                    Log.d("puttData", (puttModel).getBbstrokeRatio());
                                                    puttViewModel.insertPutt(puttModel);
                                                }
                                            });

                                            while (true) {
                                                if (System.currentTimeMillis() - check_time1 <= 3000
                                                        || isPracticePause) {
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
                                            disablePauseBtn();
                                            dataArray.clear();

                                            numPuttsCount++;
                                            updateNoOfPuttUi(numPuttsCount);
                                            screenColor.setBackgroundColor(getResources().getColor(R.color.black));
                                            //// isButtonResetPressed = true;
                                        } catch (Exception e) {

                                            e.printStackTrace();
                                            runOnUiThread(new Runnable() {
                                                @Override
                                                public void run() {

                                                    Toast.makeText(NewActivity.this, "Invalid Putt", Toast.LENGTH_SHORT)
                                                            .show();
                                                    isConditionMet2 = true;
                                                    if (isConditionMet2 && !isSoundPlayed2) {
                                                        soundPlayer.playSound(NewActivity.this, R.raw.invalidput);
                                                        isSoundPlayed2 = true;
                                                        isConditionMet2 = false;
                                                    }
                                                    dataArray.clear();
                                                    isSoundPlayed = false;
                                                    isSoundPlayed1 = false;
                                                }
                                            });

                                            Log.e("Check: ", "Invalid Putt");
                                            start_time = System.currentTimeMillis();
                                            Log.e("End", "End Session ");
                                            record = false;
                                            disablePauseBtn();
                                            dataArray.clear();
                                            isSoundPlayed2 = false;

                                        }
                                    }
                                }
                            }

                            count++;
                        } else {

                            if (ActivityCompat.checkSelfPermission(NewActivity.this,
                                    Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {

                                return;
                            }
                            break;
                        }
                    }

                }
                else{
                    Toast.makeText(NewActivity.this, "Please check your Device.", Toast.LENGTH_SHORT)
                        .show();}
            } catch (Exception e) {
                Log.e("Exception: ", e.toString());

            }

        }

        public void stopRunning() {
            isRunning = false;
        }
        private void showAlert(String message) {
            AlertDialog.Builder builder = new AlertDialog.Builder(NewActivity.this);
            builder.setTitle("Time Limit Reached");
            builder.setMessage(message);
            builder.setPositiveButton("Add Limit", new DialogInterface.OnClickListener() {

                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    dialogInterface.dismiss();
                }
            });

            AlertDialog dialog = builder.create();
            dialog.show();
        }

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
        double[] rotation = { roll, pitch, tilt };
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

    public float[] vstackForDataArray(float[][] array, float[] input) {
        // Create a new array with the combined size
        float[] result = new float[array.length];

        // Copy the elements of the original array
        System.arraycopy(array, 1, result, 0, array.length - 1);

        // Copy the elements of the input array
        result[array.length - 1] = input[0];

        return result;
    }

    public MappedByteBuffer loadModelFile(String modelPath) throws IOException {
        AssetFileDescriptor fileDescriptor = this.getAssets().openFd("tflite_model_8.tflite");
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }

    private void plotLineChartWithSingleLineDataSet(Map dataMap) {
        // x-axis values
        ArrayList<String> xAxisValues = new ArrayList<String>();

        ArrayList<Entry> frontStrokeEntries = new ArrayList<>();
        ArrayList<Entry> backStrokeEntries = new ArrayList<>();
        backStrokeEntries = parseValueFromFrontAndBackStroke(dataMap, "front_stroke");
        frontStrokeEntries = parseValueFromFrontAndBackStroke(dataMap, "backstroke");

        int splitIndex = (int) dataMap.get("splitIndex");
        float FrontX = Float.valueOf(String.valueOf(frontStrokeEntries.get(frontStrokeEntries.size() - 1).getX()));
        float BackX = Float.valueOf(String.valueOf(backStrokeEntries.get(backStrokeEntries.size() - 1).getX()));

        Collections.sort(frontStrokeEntries, new EntryXComparator());
        Collections.sort(backStrokeEntries, new EntryXComparator());
        mChart.getAxisRight().setEnabled(false);
        mChart.getXAxis().setPosition(XAxis.XAxisPosition.BOTTOM);
        mChart.getXAxis().setAxisMinimum(BackX - 0.2f);
        mChart.getXAxis().setAxisMaximum(FrontX + 0.2f);
        mChart.getAxisLeft().setAxisMinimum(-0.4f);
        mChart.getAxisLeft().setAxisMaximum(0.3f);
        ArrayList<LineDataSet> lines = new ArrayList<LineDataSet>();

        LineDataSet set1 = new LineDataSet(frontStrokeEntries, "");
        set1.setDrawFilled(true);
        set1.setFillColor(Color.WHITE);
        set1.setLineWidth(5f);
        set1.setCircleColor(Color.DKGRAY);
        set1.setColor(Color.GREEN);
        set1.setDrawCircles(false);
        set1.setDrawFilled(true);
        set1.setFillAlpha(80);
        set1.setDrawValues(false);
        set1.setCubicIntensity(0.5f);
        LineDataSet set2 = new LineDataSet(backStrokeEntries, "");
        set2.setDrawFilled(true);
        set2.setFillColor(Color.WHITE);
        set2.setLineWidth(5f);
        set2.setCircleColor(Color.DKGRAY);
        set2.setColor(Color.RED);

        set2.setDrawCircles(false);
        set2.setDrawValues(false);
        set2.setDrawFilled(true);
        List<Integer> listOfColors = new ArrayList<>();
        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(set1);
        dataSets.add(set2);
        mChart.setData(new LineData(dataSets));
        mChart.getDescription().setText("");
        mChart.getXAxis().setDrawGridLines(false);
        mChart.getAxisLeft().setDrawGridLines(false);
        mChart.getAxisRight().setDrawGridLines(false);
        mChart.getDescription().setTextColor(Color.RED);
        mChart.invalidate();
    }

    private ArrayList<Entry> parseValueFromFrontAndBackStroke(Map dataMap, String type) {
        // Get the double array from the map
        double[][] data = (double[][]) dataMap.get(type);
        ArrayList<String> backStrokeX = new ArrayList<>();
        ArrayList<String> backStrokeY = new ArrayList<>();

        // Flatten the double array into a simple array

        // double[] flatData = new double[data.length * data[0].length];
        int index = 0;
        // Log.e("data.length: ", String.valueOf(data.length));
        for (int i = 0; i < data.length; i++) {
            for (int j = 0; j < data.length; j++) {
                if (j == 1) {
                    backStrokeX.add(String.valueOf(data[i][j]));

                } else if (j == 2) {
                    backStrokeY.add(String.valueOf(data[i][j]));
                    // Log.e( "parseValueFromFrontAndBackStroke: ",String.valueOf(data[i][j]) );
                }

            }
        }

        ArrayList<Entry> entries = new ArrayList<>();
        for (int i = 0; i < backStrokeY.size(); i++) {
            // xAxisValues.add(String.valueOf(i));
            entries.add(new Entry(parseFloat(backStrokeX.get(i)), parseFloat(backStrokeY.get(i)), String.valueOf(i)));
        }

        return entries;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Disconnect and close BluetoothGatt
        if (mBluetoothGatt != null) {
            if (ActivityCompat.checkSelfPermission(NewActivity.this,
                    Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            mBluetoothGatt.disconnect();
            mBluetoothGatt.close();
            mBluetoothGatt = null;
        }
    }

    public boolean isServiceRunning(String serviceClassName) {
        final ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        final List<ActivityManager.RunningServiceInfo> services = activityManager.getRunningServices(Integer.MAX_VALUE);
        for (ActivityManager.RunningServiceInfo runningServiceInfo : services) {
            if (runningServiceInfo.service.getClassName().equals(serviceClassName)) {
                return true;
            }
        }
        return false;
    }

    private void enablePauseBtn() throws InterruptedException {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                btnPausePractice.setEnabled(true);
            }
        });
    }

    private void disablePauseBtn() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                btnPausePractice.setBackgroundColor(getResources().getColor(R.color.disabledBtn));
                btnPausePractice.setTextColor(getResources().getColor(R.color.black));
                btnPausePractice.setEnabled(false);
            }
        });

    }

    private void updateNoOfPuttUi(int count) {
        // txtNoPutt.setText(String.valueOf(count + "/" + maxNoOfPutt));
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
        syncSessionDataModel.setUser_id(userId);
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
        Log.d("api_interface", api_interface.toString());
        Log.d("call", call.toString());

        call.enqueue(new Callback<SyncSessionDataModel>() {
            @Override
            public void onResponse(Call<SyncSessionDataModel> call, Response<SyncSessionDataModel> response) {
                Log.d("respose code", String.valueOf(response.code()));
                if (response.code() == 200) {
                    SyncSessionDataModel syncSessionDataModel = response.body();
                    int sessionid = syncSessionDataModel.getSessionid();
                    // appPreferences.setSessionId(sessionid);
                    // appPreferences.setUserId(userId);
                    // Toast.makeText(NewActivity.this, "successfully", Toast.LENGTH_SHORT).show();
                    // Intent i = new Intent(NewActivity.this, SessionPerformanceActivity.class);
                    // startActivity(i);

                    // PredictClassModule.getInstance().handleBackPress();
                    PredictClassModule.getInstance().handleStopButton(sessionid);
                    finish();
                } else {

                    Toast.makeText(NewActivity.this, "error", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<SyncSessionDataModel> call, Throwable t) {
                t.printStackTrace();
                Log.e("Check", t.getMessage());
                Toast.makeText(NewActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }

        });

    }


    private void openSettingsFragment() {
        // Create a new instance of your SettingsFragment
        FragmentPuttingSetting settingsFragment = new FragmentPuttingSetting();

        // Use FragmentManager to replace the content of fragmentContainer with the
        // SettingsFragment
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.fragmentContainerActivity, settingsFragment);
        transaction.addToBackStack(null); // This allows you to navigate back to the previous fragment
        transaction.commit();
    }

    private void openStatisticFragment(int sessionId) {
        // Create a new instance of your SettingsFragment
        FragmentPuttingStatistic settingsFragment = FragmentPuttingStatistic.newInstance(sessionId);
        // StatisticsFragment statisticsFragment =
        // StatisticsFragment.newInstance(sessionid);
        // Use FragmentManager to replace the content of fragmentContainer with the
        // SettingsFragment
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.fragmentContainerActivity, settingsFragment);
        transaction.addToBackStack(null); // This allows you to nav         igate back to the previous fragment
        transaction.commit();
    }

    private void showLowBatteryDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Low Battery Alert");
        builder.setMessage("Your battery is below 10%. Please charge your device.");
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // Handle OK button click if needed
            }
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void sendCallbackToReactNative(String message) {
        ReactContext reactContext = PredictClassPackage.getReactContext();

        if (reactContext != null) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("eventName", message);
        }
    }

    // private void vibrateDevice(Context context) {
    // Vibrator vibrator = (Vibrator)
    // context.getSystemService(Context.VIBRATOR_SERVICE);
    // if (vibrator != null) {
    // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    // VibrationEffect vibrationEffect = VibrationEffect.createOneShot(1000,
    // VibrationEffect.DEFAULT_AMPLITUDE);
    // vibrator.vibrate(vibrationEffect);
    // } else {
    // vibrator.vibrate(1000);
    // }
    // }
    // }
}
