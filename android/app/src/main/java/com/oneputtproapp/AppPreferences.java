package com.oneputtproapp;


import android.content.Context;
import android.content.SharedPreferences;

public class AppPreferences {
    private SharedPreferences preference;
    private SharedPreferences.Editor editor;
    private Context context;


    public AppPreferences(Context context) {
        preference = context.getSharedPreferences("One-Putt-Pro", Context.MODE_PRIVATE);
        editor = preference.edit();
        this.context = context;
    }

    public String getUserEmail(){

        return preference.getString("user_email","");
    }

    public void setUserEmail(String user_email){

        editor.putString("user_email",user_email);
        editor.commit();

    }

    public int getUserId(){

        return preference.getInt("user_id",-1);
    }

    public void setUserId(int user_id){

        editor.putInt("user_id",user_id);
        editor.commit();

    }

    public int getSessionId(){

        return preference.getInt("session_id",-1);
    }

    public void setSessionId(int session_id){

        editor.putInt("session_id",session_id);
        editor.commit();

    }

    public String getAccessToken(){
        return preference.getString("accessToken","");
    }

    public void setAccessToken(String accessToken){

        editor.putString("accessToken",accessToken);
        editor.commit();

    }

    public String getRefreshToken(){
        return preference.getString("accessToken","");
    }

    public void setRefreshToken(String refreshToken){

        editor.putString("refreshToken",refreshToken);
        editor.commit();

    }

    public int getRoleId(){

        return preference.getInt("role_id",-1);
    }

    public void setRoleId(int role_id){

        editor.putInt("role_id",role_id);
        editor.commit();

    }

    public String getExpire_in(){
        return preference.getString("accessToken","");
    }

    public void setExpire_in(String expire_in){

        editor.putString("expire_in",expire_in);
        editor.commit();

    }


    public int getPuttId(){

        return preference.getInt("putt_id",-1);
    }

    public void setPuttId(int putt_id){

        editor.putInt("putt_id",putt_id);
        editor.commit();

    }

    public void setLoggedIn(boolean isLoggedIn){
        editor.putBoolean("isLoggedIn", false);
        editor.commit();
    }

    public boolean getLoggedIn(){

        return preference.getBoolean("isLoggedIn",false);
    }
}
