package com.oneputtproapp.DataBase;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface PuttDao {
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    void insert(PuttModel puttModel);

    @Update
    void update(PuttModel puttModel);

    @Query("SELECT * from putt_table ")
    LiveData<List<PuttModel>> getStudent();

    @Query("DELETE from putt_table")
    void deleteAll();

    @Query("SELECT * FROM putt_table WHERE sessionId = :sessionId")
    LiveData<List<PuttModel>> getPuttDataForSession(int sessionId);
}


