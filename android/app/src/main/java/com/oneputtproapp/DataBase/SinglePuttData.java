package com.oneputtproapp.DataBase;

import com.google.gson.annotations.SerializedName;

public class SinglePuttData {
    @SerializedName("id")
    private int id;
    @SerializedName("user_id")

    private int userId;
    @SerializedName("session_id")

    private int sessionId;
    @SerializedName("bbstroke_ratio")
    public String bbstrokeRatio;
    @SerializedName("elevation_at_imp")

    private Double elevationAtImp;
    @SerializedName("off_centre_imp")

    private Double offCentreImp;
    @SerializedName("loft_angle")

    private Double loftAngle;
    @SerializedName("ang_lie_start")

    private Double angLieStart;
    @SerializedName("ang_lie_imp")

    private Double angLieImp;
    @SerializedName("putter_face_ang")

    private Double putterFaceAng;
    @SerializedName("front_stroke")

    private String frontStroke;
    @SerializedName("back_stroke")

    private String backStroke;
    @SerializedName("velocity_abs")

    private String velocityAbs;
    @SerializedName("score_putt")

    private int scorePutt;

    private int ftDistance;
    private int avg_score;

    private Double acceleration_impact;


    public int getAvg_score() {
        return avg_score;
    }

    public void setAvg_score(int avg_score) {
        this.avg_score = avg_score;
    }

    public SinglePuttData() {
    }

    public SinglePuttData(String bbstrokeRatio) {
        this.bbstrokeRatio = bbstrokeRatio;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getSessionId() {
        return sessionId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    public String getBbstrokeRatio() {
        return bbstrokeRatio;
    }

    public void setBbstrokeRatio(String bbstrokeRatio) {
        this.bbstrokeRatio = bbstrokeRatio;
    }

    public Double getElevationAtImp() {
        return elevationAtImp;
    }

    public void setElevationAtImp(Double elevationAtImp) {
        this.elevationAtImp = elevationAtImp;
    }

    public Double getOffCentreImp() {
        return offCentreImp;
    }

    public void setOffCentreImp(Double offCentreImp) {
        this.offCentreImp = offCentreImp;
    }

    public Double getLoftAngle() {
        return loftAngle;
    }

    public void setLoftAngle(Double loftAngle) {
        this.loftAngle = loftAngle;
    }

    public Double getAngLieStart() {
        return angLieStart;
    }

    public void setAngLieStart(Double angLieStart) {
        this.angLieStart = angLieStart;
    }

    public Double getAngLieImp() {
        return angLieImp;
    }

    public void setAngLieImp(Double angLieImp) {
        this.angLieImp = angLieImp;
    }

    public Double getPutterFaceAng() {
        return putterFaceAng;
    }

    public void setPutterFaceAng(Double putterFaceAng) {
        this.putterFaceAng = putterFaceAng;
    }

    public String getFrontStroke() {
        return frontStroke;
    }

    public void setFrontStroke(String frontStroke) {
        this.frontStroke = frontStroke;
    }

    public String getBackStroke() {
        return backStroke;
    }

    public void setBackStroke(String backStroke) {
        this.backStroke = backStroke;
    }

    public String getVelocityAbs() {
        return velocityAbs;
    }

    public void setVelocityAbs(String velocityAbs) {
        this.velocityAbs = velocityAbs;
    }

    public int getScorePutt() {
        return scorePutt;
    }

    public void setScorePutt(int scorePutt) {
        this.scorePutt = scorePutt;
    }


    public Double getAcceleration_impact() {
        return acceleration_impact;
    }

    public void setAcceleration_impact(Double acceleration_impact) {
        this.acceleration_impact = acceleration_impact;
    }

    public int getFtDistance() {
        return ftDistance;
    }

    public void setFtDistance(int ftDistance) {
        this.ftDistance = ftDistance;
    }
}
