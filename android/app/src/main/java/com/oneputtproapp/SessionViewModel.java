package com.oneputtproapp;
import android.app.Application;
import android.os.AsyncTask;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;


import java.util.List;

public class SessionViewModel extends AndroidViewModel {
    private SessionDataRepository sessionDataRepository;
    private final LiveData<List<SessionModel>> listSessionLiveData;

    public LiveData<Long> insertSession(SessionModel sessionModel) {
        MutableLiveData<Long> insertedSessionId = new MutableLiveData<>();

        // Perform the insertion asynchronously
        AsyncTask.execute(() -> {
            long sessionId = sessionDataRepository.insertSession(sessionModel);
            insertedSessionId.postValue(sessionId);
        });

        return insertedSessionId;
    }

    public SessionViewModel(Application application) {
        super(application);
        sessionDataRepository = new SessionDataRepository(application);
        listSessionLiveData = sessionDataRepository.getAllSession();


    }

    public LiveData<List<SessionModel>> getAllsessionFromVm() {
        return listSessionLiveData;
    }


}
