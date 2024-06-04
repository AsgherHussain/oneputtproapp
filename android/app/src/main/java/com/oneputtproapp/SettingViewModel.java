package com.oneputtproapp;
import androidx.lifecycle.ViewModel;
public class SettingViewModel extends ViewModel {

    private String sliderValue;
    private  String[] scoreDataValue;
    private Boolean shouldExecuteBackButtonAction;

    public String getSliderValue() {
        return sliderValue;
    }

    public void setSliderValue(String sliderValue) {
        this.sliderValue = sliderValue;
    }

    public String[] getScoreDataValue() {
        return scoreDataValue;
    }

    public void setScoreDataValue(String[] scoreDataValue) {
        this.scoreDataValue = scoreDataValue;
    }

    public Boolean getShouldExecuteBackButtonAction() {
        return shouldExecuteBackButtonAction;
    }

    public void setShouldExecuteBackButtonAction(Boolean shouldExecuteBackButtonAction) {
        this.shouldExecuteBackButtonAction = shouldExecuteBackButtonAction;
    }
}
