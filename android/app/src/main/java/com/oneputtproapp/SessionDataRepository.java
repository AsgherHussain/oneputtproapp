package com.oneputtproapp;

import android.app.Application;
import android.os.AsyncTask;
import androidx.lifecycle.LiveData;
import java.util.List;

public class SessionDataRepository {
    // below line is the create a variable
    // for dao and list for all courses.
    PuttRoomDatabase puttRoomDatabase;
    private SessionDao sessiondao;
    private LiveData<List<SessionModel>> allSessions;


    public SessionDataRepository(Application application) {
        puttRoomDatabase = PuttRoomDatabase.getDatabase(application);
        sessiondao = puttRoomDatabase.sessiondao();
        allSessions = sessiondao.getAllSessions();


    }
    public long insertSession(SessionModel sessionModel) {
        return sessiondao.insert(sessionModel);
    }
//    public void insertSesssion(SessionModel sessionModel) {
//        puttRoomDatabase.databaseWriteExecutor.execute(() -> sessiondao.insert(sessionModel));
//    }

    public LiveData<List<SessionModel>> getAllSession() {
        return allSessions;
    }

}



