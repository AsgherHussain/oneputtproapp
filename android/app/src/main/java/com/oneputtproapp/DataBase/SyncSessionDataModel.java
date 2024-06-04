package com.oneputtproapp.DataBase;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class SyncSessionDataModel {



    @SerializedName("id")
    private int id;
private Boolean is_sync;
 @SerializedName("session_id")
   public int sessionid;
 public String session_name;
    public int user_id;
    public int coach_id;
    public String start_datetime;
    public String end_datetime;
    public int total_puts;
    public String time_ratio;
    public double angle_of_impact;
    public int session_score;



    private List<SinglePuttData> putt;

    public SyncSessionDataModel() {

    }

    public int getId() {
        return id;
    }

    public Boolean getIs_sync() {
        return is_sync;
    }

    public int getSessionid() {
        return sessionid;
    }

    public String getSession_name() {
        return session_name;
    }

    public void setSession_name(String session_name) {
        this.session_name = session_name;
    }

    public int getUser_id() {
        return user_id;
    }

    public int getCoach_id() {
        return coach_id;
    }

    public String getStart_datetime() {
        return start_datetime;
    }

    public String getEnd_datetime() {
        return end_datetime;
    }

    public int getTotal_puts() {
        return total_puts;
    }

    public String getTime_ratio() {
        return time_ratio;
    }

    public double getAngle_of_impact() {
        return angle_of_impact;
    }

    public int getSession_score() {
        return session_score;
    }



    public void setId(int id) {
        this.id = id;
    }

    public void setIs_sync(Boolean is_sync) {
        this.is_sync = is_sync;
    }

    public void setSessionid(int sessionid) {
        this.sessionid = sessionid;
    }



    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setCoach_id(int coach_id) {
        this.coach_id = coach_id;
    }

    public void setStart_datetime(String start_datetime) {
        this.start_datetime = start_datetime;
    }

    public void setEnd_datetime(String end_datetime) {
        this.end_datetime = end_datetime;
    }

    public void setTotal_puts(int total_puts) {
        this.total_puts = total_puts;
    }

    public void setTime_ratio(String time_ratio) {
        this.time_ratio = time_ratio;
    }

    public void setAngle_of_impact(double angle_of_impact) {
        this.angle_of_impact = angle_of_impact;
    }

    public void setSession_score(int session_score) {
        this.session_score = session_score;
    }

    public List<SinglePuttData> getPutt() {
        return putt;
    }

    public void setPutt(List<SinglePuttData> putt) {
        this.putt = putt;
    }


}
