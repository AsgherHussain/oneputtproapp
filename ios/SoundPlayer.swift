//
//  SoundPlayer.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 29/11/23.
//

import Foundation
import AVFoundation

class SoundPlayer {
  var audioPlayer: AVAudioPlayer?
  
  func playSound(soundName: String, fileType: String = "mp3") {
    guard let path = Bundle.main.path(forResource: soundName, ofType: fileType) else {
      print("Sound file not found")
      return
    }
    
    let url = URL(fileURLWithPath: path)
    
    do {
      audioPlayer = try AVAudioPlayer(contentsOf: url)
      audioPlayer?.volume = 1.0
      audioPlayer?.play()
//      sleep(1)
    } catch {
      print("Error playing sound: \(error.localizedDescription)")
    }
  }
}
