package com.oneputtproapp.Network;

import com.oneputtproapp.DataBase.SyncSessionDataModel;
import com.oneputtproapp.LineChartDataResponse;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface API_Interface {


    @Multipart
    @POST("https://oneputtapi.softlabsgroup.in/api/ElectionManagement/CitizenImage/SaveFile")
    Call<ResponseBody> postFile(@Part MultipartBody.Part file);

 @POST(EndpointUrls.SYNC_SESSION_URL)
    Call<SyncSessionDataModel> syncSessionData(@Body SyncSessionDataModel syncSessionDataModel);

    @GET(EndpointUrls.GET_LINE_CHART_DATA+"{userid}/{sessionid}")
    Call<LineChartDataResponse> getLineChartDataByUserIdandSessionId(@Path("userid") int userid, @Path("sessionid") int sessionid);

}
