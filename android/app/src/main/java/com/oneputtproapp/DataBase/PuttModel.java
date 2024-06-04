package com.oneputtproapp.DataBase;


import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.util.ArrayList;
import java.util.List;

@Entity(tableName = "putt_table")
public class PuttModel {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private int userId;
    private int sessionId;
    private String bbstrokeRatio;
    private Double elevationAtImp;
    private Double offCenterImp;
    private Double loftAngle;
    private Double angLieStart;
    private Double angLieImp;
    private Double putterFaceAng;
    private String frontStroke;
    private String backStroke;
    private String velocityAbs;
private Double accelerationImpact;
private int score_putt;


    public PuttModel(int userId, int sessionId, String bbstrokeRatio, Double elevationAtImp, Double offCenterImp, Double loftAngle, Double angLieStart, Double angLieImp, Double putterFaceAng, String frontStroke, String backStroke, String velocityAbs, Double accelerationImpact, int score_putt) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.bbstrokeRatio = bbstrokeRatio;
        this.elevationAtImp = elevationAtImp;
        this.offCenterImp = offCenterImp;
        this.loftAngle = loftAngle;
        this.angLieStart = angLieStart;
        this.angLieImp = angLieImp;
        this.putterFaceAng = putterFaceAng;
        this.frontStroke = frontStroke;
        this.backStroke = backStroke;
        this.velocityAbs = velocityAbs;
        this.accelerationImpact = accelerationImpact;
        this.score_putt = score_putt;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }

    public void setBbstrokeRatio(String bbstrokeRatio) {
        this.bbstrokeRatio = bbstrokeRatio;
    }

    public void setElevationAtImp(Double elevationAtImp) {
        this.elevationAtImp = elevationAtImp;
    }

    public void setOffCenterImp(Double offCenterImp) {
        this.offCenterImp = offCenterImp;
    }

    public void setLoftAngle(Double loftAngle) {
        this.loftAngle = loftAngle;
    }

    public void setAngLieStart(Double angLieStart) {
        this.angLieStart = angLieStart;
    }

    public void setAngLieImp(Double angLieImp) {
        this.angLieImp = angLieImp;
    }

    public void setPutterFaceAng(Double putterFaceAng) {
        this.putterFaceAng = putterFaceAng;
    }

    public void setFrontStroke(String frontStroke) {
        this.frontStroke = frontStroke;
    }

    public void setBackStroke(String backStroke) {
        this.backStroke = backStroke;
    }

    public void setVelocityAbs(String velocityAbs) {
        this.velocityAbs = velocityAbs;
    }

    public void setAccelerationImpact(Double accelerationImpact) {
        this.accelerationImpact = accelerationImpact;
    }

    public void setScore_putt(int score_putt) {
        this.score_putt = score_putt;
    }

    public int getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public int getSessionId() {
        return sessionId;
    }

    public String getBbstrokeRatio() {
        return bbstrokeRatio;
    }

    public Double getElevationAtImp() {
        return elevationAtImp;
    }

    public Double getOffCenterImp() {
        return offCenterImp;
    }

    public Double getLoftAngle() {
        return loftAngle;
    }

    public Double getAngLieStart() {
        return angLieStart;
    }

    public Double getAngLieImp() {
        return angLieImp;
    }

    public Double getPutterFaceAng() {
        return putterFaceAng;
    }

    public String getFrontStroke() {
        return frontStroke;
    }

    public String getBackStroke() {
        return backStroke;
    }

    public String getVelocityAbs() {
        return velocityAbs;
    }

    public Double getAccelerationImpact() {
        return accelerationImpact;
    }

    public int getScore_putt() {
        return score_putt;
    }
}
