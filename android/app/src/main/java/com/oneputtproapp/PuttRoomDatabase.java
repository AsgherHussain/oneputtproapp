package com.oneputtproapp;


import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.oneputtproapp.DataBase.PuttDao;
import com.oneputtproapp.DataBase.PuttModel;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@Database(entities = {PuttModel.class, SessionModel.class}, version = 1, exportSchema = false)

//@Database(entities = {PuttModel.class}, version = 1)

public abstract class PuttRoomDatabase extends RoomDatabase {
    public abstract PuttDao puttDao();

    public abstract SessionDao sessiondao();

    private static volatile PuttRoomDatabase puttRoomDatabase;
    private static final int NUMBER_OF_THREADS = 4;
    static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    static PuttRoomDatabase getDatabase(final Context context) {
        if (puttRoomDatabase == null) {
            synchronized (PuttRoomDatabase.class) {
                if (puttRoomDatabase == null) {
                    puttRoomDatabase = Room.databaseBuilder(context.getApplicationContext(),
                                    PuttRoomDatabase.class, "onePuttPro_database")
                            .build();
                }
            }
        }
        return puttRoomDatabase;
    }

    // Method to delete the database
    public void deleteDatabase(Context context) {
        // Close the existing database connections
        close();

        // Delete the database file
        File databaseFile = context.getDatabasePath("Putt_database.db");
        databaseFile.delete();
    }
}

