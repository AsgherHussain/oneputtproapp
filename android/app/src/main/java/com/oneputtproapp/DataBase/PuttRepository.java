package com.oneputtproapp.DataBase;

import android.app.Application;

import androidx.lifecycle.LiveData;

import java.util.List;

public class PuttRepository {
    PuttRoomDatabase puttRoomDatabase;
    PuttDao puttDao;
    private LiveData<List<PuttModel>> puttRecords;
    private LiveData<List<PuttModel>> allPuttBySessionId;

    public PuttRepository(Application application) {
        puttRoomDatabase = PuttRoomDatabase.getDatabase(application);
        puttDao = puttRoomDatabase.puttDao();
        puttRecords = puttDao.getStudent();

    }

    public void insertPutt(PuttModel puttModel) {
        puttRoomDatabase.databaseWriteExecutor.execute(() -> puttDao.insert(puttModel));
    }

    public LiveData<List<PuttModel>> getAllStudents() {
        return puttRecords;
    }


    public LiveData<List<PuttModel>> getAllPuttBySessionId(int sessionId) {
        if (allPuttBySessionId == null) {
            allPuttBySessionId = puttDao.getPuttDataForSession(sessionId);
        }
        return allPuttBySessionId;
    }
    public void clearDatabase() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                puttDao.deleteAll();
            }
        }).start();
    }

}
