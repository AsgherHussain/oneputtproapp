package com.oneputtproapp;


import androidx.room.Entity;
import androidx.room.PrimaryKey;


@Entity(tableName = "session_table")
public class SessionModel {

    @PrimaryKey(autoGenerate = true)
    private int sessionId;



    private int user_id;

    private int coach_id;

    private String start_date_time;

    private String end_date_time;

    private int total_puts;


    private Boolean isSync;

    public SessionModel(int user_id, int coach_id, String start_date_time, String end_date_time, int total_puts, Boolean isSync) {

        this.user_id = user_id;
        this.coach_id = coach_id;
        this.start_date_time = start_date_time;
        this.end_date_time = end_date_time;
        this.total_puts = total_puts;
        this.isSync = isSync;
    }

    public int getSessionId() {
        return sessionId;
    }



    public int getUser_id() {
        return user_id;
    }

    public int getCoach_id() {
        return coach_id;
    }

    public String getStart_date_time() {
        return start_date_time;
    }

    public String getEnd_date_time() {
        return end_date_time;
    }

    public int getTotal_puts() {
        return total_puts;
    }

    public Boolean getSync() {
        return isSync;
    }

    public void setSessionId(int sessionId) {
        this.sessionId = sessionId;
    }


    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public void setCoach_id(int coach_id) {
        this.coach_id = coach_id;
    }

    public void setStart_date_time(String start_date_time) {
        this.start_date_time = start_date_time;
    }

    public void setEnd_date_time(String end_date_time) {
        this.end_date_time = end_date_time;
    }

    public void setTotal_puts(int total_puts) {
        this.total_puts = total_puts;
    }

    public void setSync(Boolean sync) {
        isSync = sync;
    }
}
