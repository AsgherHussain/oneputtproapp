package com.oneputtproapp;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface SessionDao {

//    @Insert
//    void insert(SessionModel model);

    @Insert
    long insert(SessionModel sessionModel);
    @Update
    void update(SessionModel model);

    @Delete
    void delete(SessionModel model);

    @Query("DELETE FROM session_table")
    void deleteAllSessions();

    @Query("SELECT * from session_table ")
    LiveData<List<SessionModel>> getAllSessions();



}
