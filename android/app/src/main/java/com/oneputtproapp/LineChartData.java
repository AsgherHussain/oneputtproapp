package com.oneputtproapp;
import com.google.gson.annotations.SerializedName;
import java.util.List;
public class LineChartData {
    @SerializedName("loft_angle")
    private List<CommonLineChartData> loftAngle;
    @SerializedName("putting_tempo")
    private List<CommonLineChartData> puttingTempo;
    @SerializedName("face_angle_impact")
    private List<CommonLineChartData> faceAngleImpact;
    @SerializedName("lie_angle_change")
    private List<CommonLineChartData> lieAngleChange;
    @SerializedName("acceleration_impact")
    private List<CommonLineChartData> accelerationImpact;
    @SerializedName("impact_position")
    private List<CommonLineChartData> impactPosition;

    public LineChartData() {
    }

    public LineChartData(List<CommonLineChartData> loftAngle, List<CommonLineChartData> puttingTempo, List<CommonLineChartData> faceAngleImpact,
                         List<CommonLineChartData> lieAngleChange, List<CommonLineChartData> accelerationImpact, List<CommonLineChartData> impactPosition) {
        this.loftAngle = loftAngle;
        this.puttingTempo = puttingTempo;
        this.faceAngleImpact = faceAngleImpact;
        this.lieAngleChange = lieAngleChange;
        this.accelerationImpact = accelerationImpact;
        this.impactPosition = impactPosition;
    }

    public List<CommonLineChartData> getLoftAngle() {
        return loftAngle;
    }

    public void setLoftAngle(List<CommonLineChartData> loftAngle) {
        this.loftAngle = loftAngle;
    }

    public List<CommonLineChartData> getPuttingTempo() {
        return puttingTempo;
    }

    public void setPuttingTempo(List<CommonLineChartData> puttingTempo) {
        this.puttingTempo = puttingTempo;
    }

    public List<CommonLineChartData> getFaceAngleImpact() {
        return faceAngleImpact;
    }

    public void setFaceAngleImpact(List<CommonLineChartData> faceAngleImpact) {
        this.faceAngleImpact = faceAngleImpact;
    }

    public List<CommonLineChartData> getLieAngleChange() {
        return lieAngleChange;
    }

    public void setLieAngleChange(List<CommonLineChartData> lieAngleChange) {
        this.lieAngleChange = lieAngleChange;
    }

    public List<CommonLineChartData> getAccelerationImpact() {
        return accelerationImpact;
    }

    public void setAccelerationImpact(List<CommonLineChartData> accelerationImpact) {
        this.accelerationImpact = accelerationImpact;
    }

    public List<CommonLineChartData> getImpactPosition() {
        return impactPosition;
    }

    public void setImpactPosition(List<CommonLineChartData> impactPosition) {
        this.impactPosition = impactPosition;
    }
}
