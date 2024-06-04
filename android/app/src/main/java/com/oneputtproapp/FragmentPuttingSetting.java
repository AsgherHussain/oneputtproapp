package com.oneputtproapp;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import static java.lang.Float.NaN;
import static java.lang.Float.parseFloat;
import android.widget.CompoundButton;
import android.widget.Switch;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.AppCompatEditText;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.ViewModelProvider;
import android.widget.TextView;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.slider.Slider;
import androidx.appcompat.widget.AppCompatTextView;
import androidx.appcompat.widget.SwitchCompat;

public class FragmentPuttingSetting extends Fragment {

    Slider settingPuttingSeekbar;
    MaterialButton saveButton;
    int sliderValue;
    EditText settingAcelerationImpactTarget, settingAcelerationImpactDeviation, settingLoftangleDeviation,
            settingLoftangleTarget, settingLieImpactTarget, settingLieImpactDeviation, settingLieStartTarget,
            settingLieStartDeviation;
    private SettingViewModel viewModel;
    String[] settingScoreData = new String[12];
    Toolbar toolbar;
    TextView distanceValue;
    SwitchCompat switchLieStart, switchLieImpact, switchLoftAngle, switchAcelerationImpact;

    // startPracticeDistanceValue;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize the ViewModel
        viewModel = new ViewModelProvider(requireActivity()).get(SettingViewModel.class);

    }

    @SuppressLint("MissingInflatedId")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {

        View v = inflater.inflate(R.layout.fragmentsettinglayout, container, false);
        settingPuttingSeekbar = v.findViewById(R.id.settingPuttingSeekbar);
        saveButton = v.findViewById(R.id.btnSettingSave);
        switchLieStart = v.findViewById(R.id.switchLieStart);
        switchLieImpact = v.findViewById(R.id.switchLieImpact);
        switchLoftAngle = v.findViewById(R.id.switchLoftAngle);
        switchAcelerationImpact = v.findViewById(R.id.switchAcelerationImpact);

        viewModel.setShouldExecuteBackButtonAction(true);
        settingAcelerationImpactTarget = v.findViewById(R.id.settingAcelerationImpactTarget);
        settingAcelerationImpactDeviation = v.findViewById(R.id.settingAcelerationImpactDeviation);
        settingLoftangleDeviation = v.findViewById(R.id.settingLoftangleDeviation);
        settingLoftangleTarget = v.findViewById(R.id.settingLoftangleTarget);
        settingLieImpactTarget = v.findViewById(R.id.settingLieImpactTarget);
        settingLieImpactDeviation = v.findViewById(R.id.settingLieImpactDeviation);
        settingLieStartTarget = v.findViewById(R.id.settingLieStartTarget);
        settingLieStartDeviation = v.findViewById(R.id.settingLieStartDeviation);
        distanceValue = v.findViewById(R.id.startPracticeDistanceValue);

        switchLieStart.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // updateEditTextState(isChecked, settingLieStartDeviation,
                // settingLieStartTarget);
                // updateScoreData();
            }
        });

        switchLieImpact.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // updateEditTextState(isChecked, settingLieImpactDeviation,
                // settingLieImpactTarget);
                // updateScoreData();
            }
        });

        switchLoftAngle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // updateEditTextState(isChecked, settingLoftangleDeviation,
                // settingLoftangleTarget);
                // updateScoreData();
            }
        });

        switchAcelerationImpact.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // updateEditTextState(isChecked, settingAcelerationImpactDeviation,
                // settingAcelerationImpactTarget);
                // updateScoreData();
            }
        });
        settingScoreData = viewModel.getScoreDataValue();
        for (int i = 0; i < settingScoreData.length; i++) {
            System.out.print( settingScoreData[i]+",");
        }
        // Assuming you have initialized your EditText fields in the fragment


        settingLieStartDeviation.setText(settingScoreData[0]);
        settingLieStartTarget.setText(settingScoreData[1]);
        switchLieStart.setChecked(Boolean.parseBoolean(settingScoreData[2]));
        settingLieImpactDeviation.setText(settingScoreData[3]);
        settingLieImpactTarget.setText(settingScoreData[4]);
        switchLieImpact.setChecked(Boolean.parseBoolean(settingScoreData[5]));
        settingLoftangleDeviation.setText(settingScoreData[6]);
        settingLoftangleTarget.setText(settingScoreData[7]);
        switchLoftAngle.setChecked(Boolean.parseBoolean(settingScoreData[8]));
        settingAcelerationImpactDeviation.setText(settingScoreData[9]);
        settingAcelerationImpactTarget.setText(settingScoreData[10]);
        switchAcelerationImpact.setChecked(Boolean.parseBoolean(settingScoreData[11]));
        viewModel.setScoreDataValue(settingScoreData);

        // settingScoreData[0] = settingLieStartDeviation.getText().toString();
        // settingScoreData[1] = settingLieStartTarget.getText().toString();
        // settingScoreData[2] = switchLieStart.getText().toString();
        // settingScoreData[3] = settingLieImpactDeviation.getText().toString();
        // settingScoreData[4] = settingLieImpactTarget.getText().toString();
        // settingScoreData[5] = switchLieImpact.getText().toString();
        // settingScoreData[6] = settingLoftangleDeviation.getText().toString();
        // settingScoreData[7] = settingLoftangleTarget.getText().toString();
        // settingScoreData[8] = switchLoftAngle.getText().toString();
        // settingScoreData[9] = settingAcelerationImpactDeviation.getText().toString();
        // settingScoreData[10] = settingAcelerationImpactTarget.getText().toString();
        // settingScoreData[11] = switchAcelerationImpact.getText().toString();
        

       
        toolbar = v.findViewById(R.id.toolbar_settings);
        System.out.println("scorevalue" + viewModel.getScoreDataValue());
        // Assuming settingScoreData is an array of strings received from the ViewModel
        // or another source
        settingPuttingSeekbar.setValue(Float.parseFloat(viewModel.getSliderValue()));
        viewModel.setSliderValue(viewModel.getSliderValue());
        distanceValue.setText(viewModel.getSliderValue());

        // Set the back icon
        toolbar.setNavigationIcon(R.drawable.ic_arrow_back);

        // Handle click event on the back icon
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                navigateBackToPreviousFragment();
            }
        });
        settingPuttingSeekbar.addOnSliderTouchListener(new Slider.OnSliderTouchListener() {
            @Override
            public void onStartTrackingTouch(@NonNull Slider slider) {
            }

            @Override
            public void onStopTrackingTouch(@NonNull Slider slider) {
                sliderValue = (int) slider.getValue();
                distanceValue.setText(String.valueOf(sliderValue));
                viewModel.setSliderValue(String.valueOf(sliderValue));

                // distanceValue.setText(String.valueOf(sliderValue));
            }
        });

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // System.out.println("settingScoreData"+settingScoreData[0]);
                // viewModel.setScoreDataValue(settingScoreData);
                updateScoreData();
                // updateScoreData();
                // viewModel.setScoreDataValue(viewModel.getScoreDataValue());
                // Navigate back to the previous fragment or activity
                navigateBackToPreviousFragment();

            }
        });
        return v;
    }

    // private void updateEditTextState(boolean isChecked, EditText
    // deviationEditText, EditText targetEditText) {
    // deviationEditText.setEnabled(isChecked);
    // targetEditText.setEnabled(isChecked);
    // }

    private void updateScoreData() {
        System.out.print("settingScoreDataupdated" + settingLieImpactDeviation.getText().toString());

        settingScoreData[0] = settingLieStartDeviation.getText().toString();
        settingScoreData[1] = settingLieStartTarget.getText().toString();
        settingScoreData[2] = String.valueOf(switchLieStart.isChecked());
        settingScoreData[3] = settingLieImpactDeviation.getText().toString();
        settingScoreData[4] = settingLieImpactTarget.getText().toString();
        settingScoreData[5] = String.valueOf(switchLieImpact.isChecked());
        settingScoreData[6] = settingLoftangleDeviation.getText().toString();
        settingScoreData[7] = settingLoftangleTarget.getText().toString();
        settingScoreData[8] = String.valueOf(switchLoftAngle.isChecked());
        settingScoreData[9] = settingAcelerationImpactDeviation.getText().toString();
        settingScoreData[10] = settingAcelerationImpactTarget.getText().toString();
        settingScoreData[11] = String.valueOf(switchAcelerationImpact.isChecked());

        for (int i = 0; i < settingScoreData.length; i++) {
            System.out.print("updadeData" + settingScoreData[i]);
        }
        // Update the viewModel
        viewModel.setScoreDataValue(settingScoreData);
    }

    private void navigateBackToPreviousFragment() {
        FragmentManager fragmentManager = getFragmentManager();

        if (fragmentManager.getBackStackEntryCount() > 0) {
            fragmentManager.popBackStack();
        } else {
        }
    }

    public void onBackButtonPressed() {
        // Add your code to handle the back button press here

        navigateBackToPreviousFragment(); // Call your navigation method
    }

}
