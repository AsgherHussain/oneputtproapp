package com.oneputtproapp.Network;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APIClient {
    private static Retrofit retrofit = null;

    public static Retrofit getClient() {

        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor).build();
        https://2afa-203-192-245-109.ngrok-free.app/UserManagement/getuserdetails?email=saurabh.rawool@softlabsgroup.com

        retrofit = new Retrofit.Builder()
//                .baseUrl("https://oneputtapi.softlabsgroup.in/api/")
                .baseUrl("http://185.146.166.147:21000/")
                .addConverterFactory(GsonConverterFactory.create())
                .client(client)
                .build();

        return retrofit;
    }
}
