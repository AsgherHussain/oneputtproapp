package com.oneputtproapp.DataBase;
import android.app.Application;
import android.util.Log;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;


import java.util.List;



public class PuttViewModel extends AndroidViewModel {
    private PuttRepository puttRepository;
    private final LiveData<List<PuttModel>> listLiveData;


    public PuttViewModel(Application application) {
        super(application);
        puttRepository = new PuttRepository(application);
        listLiveData = puttRepository.getAllStudents();

    }

    public LiveData<List<PuttModel>> getAllPuttFromVm() {
        return listLiveData;
    }

    public void insertPutt(PuttModel puttModel) {
 puttRepository.insertPutt(puttModel);
    }

    public LiveData<List<PuttModel>> getAllPuttBySessionIdFromVm(int sessionId) {
        return puttRepository.getAllPuttBySessionId(sessionId);
    }
    public void clearDatabase() {
        puttRepository.clearDatabase();
    }

}

