
package com.oneputtproapp.Network;

import android.content.Context;
import android.media.MediaPlayer;

public class SoundPlayer {
    private MediaPlayer mediaPlayer;

    public void playSound(Context context, int soundResourceId) {
        mediaPlayer = MediaPlayer.create(context, soundResourceId);
        mediaPlayer.start();
    }

    public void stopSound() {
        if (mediaPlayer != null) {
            mediaPlayer.stop();
            mediaPlayer.release();
            mediaPlayer = null;
        }
    }
}
