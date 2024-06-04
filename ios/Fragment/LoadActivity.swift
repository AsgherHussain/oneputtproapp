//
//  LoadActivity.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

import Foundation
import SwiftUI
import TensorFlowLite

struct LoadActivity{
  /*
   var sessionListViewModel = SessionListViewModel()
  @State var tfliteInterpreter: Interpreter?
  
  @State var isSensorThreadRunning: Bool = false
  @State var isLoopRunning: Bool = false
  @State var puttSessionName: String = ""
  
  @State var accelX1 : Double?
  @State var accelY1 : Double?
  @State var accelZ1 : Double?
  @State var gyroX1 : Double?
  @State var gyroY1 : Double?
  @State var gyroZ1 : Double?
  
  func loadModule(){
    interpret()
    startSensorThread()
  }
  
  
  func interpret() {
      do {
          // Create model path
          let modelFileName = "tflite_model_8"
          guard let modelPath = Bundle.main.path(
              forResource: modelFileName,
              ofType: "tflite"
          ) else {
              print("Failed to load the model file with name: \(modelFileName).")
              return
          }
          
          //Initialize Interpreter
        tfliteInterpreter = try Interpreter(modelPath: modelPath)
          
        
      } catch {
          print(error)
      }
  }
  
  
  func startSensorThread()
  {
    isSensorThreadRunning = true
    isLoopRunning = true;
  
    let sessionStartDateTime = getCurrentDateTime(format: yearTimeFormat)
    sessionListViewModel.getAllSessions()
    let sessionid = sessionData.map{$0.sessionId}
    print(sessionid.last)
  
    print("D : \(sessionid)")
    if let count = sessionid.last {
        // Use 'count' here
        print("Count: \(count)")
      sessionListViewModel.addSession(sessionId: Int(count)+1, userID: Int(getUserID()) ?? 0, start_date_time: sessionStartDateTime, end_date_time: sessionStartDateTime, total_puts: 10, isSync: false)
    } else {
        // Handle the case where 'optionalCount' is nil
        print("Count is nil")
      sessionListViewModel.addSession(sessionId: 1, userID: Int(getUserID()) ?? 0, start_date_time: sessionStartDateTime, end_date_time: sessionStartDateTime, total_puts: 10, isSync: false)
    }
    
     puttSessionName = getSessionName()
    if(puttSessionName.count == 0)
    {
      puttSessionName = "sesssion" + getCurrentDateTime(format: yearTimeFormat)
    }
    
  }
  
  
  func ReceiveSensorDataThread()
  {
    var isRunning :Bool = false
    var macAddress = getMacAddress()
    
    
    ///Bluetooth code need to be written
    /* let bleManager = BLEManager.shared
     bleManager.didUpdateValueForCharacteristic = { characteristic in
     print("Updated value for characteristic: \(characteristic)")
     
     guard let data = characteristic.value else {
     return
     }
     
     
     self.OtherParameterValue = String(data: data, encoding: .utf8) ?? ""
     print(String(data: data, encoding: .utf8) ?? "")
     let accelx = self.splitSensorReading(self.OtherParameterValue)
     
     print("\(accelx["ax"])")
     print("\(accelx["ay"])")
     print("\(accelx["az"])")
     print("\(accelx["gx"])")
     print("\(accelx["gy"])")
     print("\(accelx["gz"])")
     print("\(accelx["bat"])")
     
     bleManager.disconnect()*/
    
    let soundPlayer = SoundPlayer()
    var windowArray: [[Float]] = Array(repeating: Array(repeating: 0, count: 9), count: 6)
    var outputArray: [Int] = Array(repeating: 2, count: 30)
    var oldSensorData: [Float] = Array(repeating: 0, count: 9)
    var isStartTrue: Bool = false
    var isConditionMet: Bool = false
    var isConditionMet1: Bool = false
    var isConditionMet2: Bool = false
    var isSoundPlayed: Bool = false
    var isSoundPlayed1: Bool = false
    var isSoundPlayed2: Bool = false
    var record : Bool = false
    var calculate : Bool = false
    var isPracticePause : Bool = false
    var dataArray: [[Double]] = []
    var output_arr = [Int](repeating: 0, count: 30)
    var shot_num = 0;
    var puttingDistance = 0
    var putt = 0
    var count = 0
    var puttTime = 100
    var numPuttsCount = 1
    var numTime = puttTime * 60 * 1000;
    var frequencyCount = 0
    var lastBatteryCount = 0;
    var batPercentage1 = 0
    
    var frequencyStartTime = Date().timeIntervalSince1970 * 1000
    var check_time = Date().timeIntervalSince1970 * 1000
    var check_time1 = Date().timeIntervalSince1970 * 1000
    var start_time = Date().timeIntervalSince1970 * 1000
    var startTime = Date().timeIntervalSince1970 * 1000
    
    var timestampDate = getCurrentDateTime(format: "yyyy-MM-dd")
    
    var rootCreatedFolderURL : URL?
    var subCreatedFolderURL : URL?
    // Get the document directory
    if let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
      
      // Create the root folder
      let rootURL = documentsDirectory.appendingPathComponent("iOS/media/" + Bundle.main.bundleIdentifier!)
      rootCreatedFolderURL = rootURL
      
      do {
        try FileManager.default.createDirectory(at: rootURL, withIntermediateDirectories: true, attributes: nil)
      } catch {
        print("Error creating root folder: \(error.localizedDescription)")
      }
      
      // Create the subfolder
      
      let subFolderURL = rootURL.appendingPathComponent(timestampDate)
      subCreatedFolderURL = subFolderURL
      do {
        try FileManager.default.createDirectory(at: subFolderURL, withIntermediateDirectories: true, attributes: nil)
      } catch {
        print("Error creating subfolder: \(error.localizedDescription)")
      }
    }
    sleep(4000)
    
    while (isSensorThreadRunning) {
      
      if (!isStartTrue) {
        
        if (((Date().timeIntervalSince1970 * 1000) - frequencyStartTime) < 1000) {
          frequencyCount+=1;
        } else {
          //double frequency = (double) frequencyCount / 1.0; // Divide by 1 second
          let finalFrequencyCount = frequencyCount;
          
          frequencyCount = 0;
          frequencyStartTime = Date().timeIntervalSince1970 * 1000
        }
        
      }
      
      if (lastBatteryCount == 0) {
        lastBatteryCount = batPercentage1;
        if (lastBatteryCount != 0)
        {
          DispatchQueue.main.async {
            if (batPercentage1 > 100) {
             // batteryPercent.setText("Battery: " + "100" + "%");
            } else {
              //batteryPercent.setText("Battery: " +batPercentage1 + "%");
            }
            if (batPercentage1 < 10) {
             // showLowBatteryDialog();
              
            }
          }
          
        }
      }
      
      
      var accelX2 : Double = accelX1 ?? 0.0;
      var accelY2 : Double = accelY1 ?? 0.0;
      var accelZ2 : Double = accelZ1 ?? 0.0;
      var gyroX2 : Double = gyroX1 ?? 0.0;
      var gyroY2 : Double = gyroY1 ?? 0.0;
      var gyroZ2 : Double = gyroZ1 ?? 0.0;
      
      
      var sensorArray: [[Double]] = [[accelX2, accelY2, accelZ2, gyroX2, gyroY2, gyroZ2]]
      let rotationData = getRotation(ax: sensorArray[0][0], ay: sensorArray[0][1], az: sensorArray[0][2], gx: sensorArray[0][3], gy: sensorArray[0][4], gz: sensorArray[0][5])

      var input: [Double] = [
          sensorArray[0][0], sensorArray[0][1], sensorArray[0][2],
          sensorArray[0][3], sensorArray[0][4], sensorArray[0][5],
          rotationData[0], rotationData[1], rotationData[2]
      ]

      var newSensorData: [Float] = []
      for k in 0..<input.count {
          newSensorData.append(Float(input[k] * 0.1 + Double(oldSensorData[k]) * 0.9))
      }

      // Update old_sensor_data with new_sensor_data
      oldSensorData = newSensorData

      var result = vstackWithFifo(array: windowArray, input: newSensorData)
      windowArray = result

      var arr3D: [[[Float]]] = Array(repeating: Array(repeating: Array(repeating: Float(0), count: 9), count: 6), count: 1)
      for k in 0..<windowArray.count {
          for l in 0..<windowArray[k].count {
            arr3D[0][k][l] = (windowArray[k][l])
          }
      }
      
      let predictClass = PredictClass()
      do{
        let outputIndex = try predictClass.predict(tfliteInterpreter: tfliteInterpreter!, inputArray: arr3D)
        
        var outputIdxArray = [Int](repeating: 0, count: 1)
        outputIdxArray[0] = outputIndex
        var outputIndexresult = vstackForOutputIndex(array: output_arr, input: outputIdxArray)
        output_arr = outputIndexresult

        var count0 = 0
        var count1 = 0
        var count2 = 0

        for j in 0..<output_arr.count {
            switch output_arr[j] {
            case 0:
                count0 += 1
            case 1:
                count1 += 1
            case 2:
                count2 += 1
            default:
                break
            }
        }

        var maxValueIndexArray = [count0, count1, count2]
        let max = maxValueIndexArray.max() ?? 0
        let max_value = maxValueIndexArray.firstIndex(of: max) ?? 0

        print("outputIndex: \(outputIndex)")
        print("maxvalue: \(max_value)")

        if max_value != 0 && !record {
            check_time = Date().timeIntervalSince1970 * 1000 // Reset the start time if pred is not equal to 2
            // Assuming `screenColor` is a UIView
       //     screenColor.backgroundColor = UIColor.red
            print("==WAITING====: \(count)  ===WAITING===")
        } else if (Date().timeIntervalSince1970 * 1000) - check_time >= 1_000_000_000 { // 1 second in nanoseconds
            // Assuming `screenColor` is a UIView
           // screenColor.backgroundColor = UIColor.blue
            print("==SAVING====: \(count)  ===SAVING===")

            isConditionMet = true
            if isConditionMet && !isSoundPlayed {
                // Assuming `soundPlayer` is an instance of a sound player class
              soundPlayer.playSound(soundName: "start")
                isSoundPlayed = true
                isConditionMet = false
            }

            let current_time = Double(DispatchTime.now().uptimeNanoseconds) - start_time / Double(1_000_000_000)

          let data_point: [Double] = [current_time, Double(gyroX1 ?? 0.0), Double(gyroY1 ?? 0.0), Double(gyroZ1 ?? 0.0), Double(accelX1 ?? 0.0), Double(accelY1 ?? 0.0), Double(accelZ1 ?? 0.0)]
            dataArray.append(data_point)
            record = true

            if max_value == 1 && record {
                // Assuming `screenColor` is a UIView
               // screenColor.backgroundColor = UIColor.green
                calculate = true
                print("==RESETTING====: \(count)  Calculate")
                // Update the screen
            } else if max_value == 0 {
                // Do nothing
            } else {
                print("==RESETTING====: \(count)  ===RESETTING===")

                if calculate {
                  do {
                    print("Calculate: \(count)  Calculating")
                    
                    // create .csv files
                    let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .short, timeStyle: .short)
                    let f = URL(fileURLWithPath: subCreatedFolderURL!.path).appendingPathComponent("sensor_data_\(timestamp).csv")
                    try dataArray.map { "\($0[0]),\($0[1]),\($0[2]),\($0[3]),\($0[4]),\($0[5]),\($0[6])\n" }.joined().write(to: f, atomically: true, encoding: .utf8)
                    
                    let csv = CSVReaderMainMethod()
                    if let dataMap = csv.calculation(file: dataArray, threshold: putt, scoreData: ScoreData ?? []) as? [String: Any] {
                      // Use dataMap as needed
                    } else {
                      print("Failed to get dataMap from CSVReaderMainMethod.calculation")
                    }
                    
                    //plotLineChartWithSingleLineDataSet(dataMap);
                    // enablePauseBtn();
                    check_time1 =  Date().timeIntervalSince1970 * 1000
                    
                    isConditionMet1 = true;
                    if (isConditionMet1 && !isSoundPlayed1) {
                      soundPlayer.playSound(soundName: "stop");
                      isSoundPlayed1 = true;
                      isConditionMet1 = false;
                    }
                    
                    
                    while (true) {
                      if ((Date().timeIntervalSince1970 * 1000) - check_time1 <= 3000 || isPracticePause) {
                        if (isPracticePause) {
                          
                          isSoundPlayed = false;
                          isSoundPlayed1 = false;
                          check_time1 = Date().timeIntervalSince1970 * 1000
                        } else if ((Date().timeIntervalSince1970 * 1000) - check_time1 <= 5000) {
                          isSoundPlayed = false;
                          isSoundPlayed1 = false;
                          
                        }
                      } else {
                        break;
                      }
                    }
                    
                    start_time = Date().timeIntervalSince1970 * 1000
                    print("End", "End Session ");
                    record = false;
                   // disablePauseBtn();
                    dataArray = []
                    
                    numPuttsCount += 1;
                   
                  //  screenColor.setBackgroundColor(getResources().getColor(R.color.black));
                  } catch {
                      isConditionMet2 = true;
                      if (isConditionMet2 && !isSoundPlayed2) {
                        soundPlayer.playSound(soundName: "invalidput");
                        isSoundPlayed2 = true;
                        isConditionMet2 = false;
                      }
                      dataArray = []
                      isSoundPlayed = false;
                      isSoundPlayed1 = false;
                      print(error.localizedDescription)
                    }
                }
            }
        }

      }
      catch{
        
      }
     
      
    }
    
  }
  
  func stopSensorThread() {
          // Set the flag to stop the SensorThread gracefully
          isSensorThreadRunning = false;
          isLoopRunning = false;
      }
  
  func getRotation(ax: Double, ay: Double, az: Double, gx: Double, gy: Double, gz: Double) -> [Double] {
      let accelMagnitude = sqrt(ax * ax + ay * ay + az * az)
      let pitch = atan2(ax, sqrt(ay * ay + az * az)).degrees
      let roll = atan2(ay, sqrt(ax * ax + az * az)).degrees

      let tiltAngle = acos(az / accelMagnitude)
      let tilt = tiltAngle.degrees.isNaN ? 0.0 : tiltAngle.degrees

      let rotation = [roll, pitch, tilt]
      return rotation
  }

  func vstackWithFifo(array: [[Float]], input: [Float]) -> [[Float]] {
      var result = array
      let rows = array.count
      let cols = array[0].count

      result.removeFirst()
      result.append(input)

      // Create a 3D array with shape (1, 6, 9)
      var arr3D = [[[Float]]](repeating: [[Float]](repeating: [Float](repeating: 0, count: 9), count: 6), count: 1)

      // Copy elements from 2D array to 3D array
      for i in 0..<result.count {
          arr3D[0][i] = result[i]
      }

      return result
  }

  func vstackForOutputIndex(array: [Int], input: [Int]) -> [Int] {
      var result = array
      result.removeFirst()
      result.append(input[0])
      return result
  }

  func vstackForDataArray(array: [[Float]], input: [Float]) -> [Float] {
      var result = array.flatMap { $0 }
      result.removeFirst()
      result.append(input[0])
      return result
  }
  
  func callAPI()
  {
    // Define your API endpoint URL
    let apiUrl = URL(string: "http://185.146.166.147:21000/PuttManagement/SyncSessionData")!

    // Define your request parameters
    let parameters: [String: Any] = [
        "sessionid": "13",
        "session_name": "Demo_iOS",
        "user_id": "14",
        "coach_id": "12",
        "start_datetime": "29/11/23 13:12:02",
        "end_datetime": "29/11/23 13:13:02",
        "total_puts": "12",
        "time_ratio": "3",
        "SinglePuttData": "[1,2,3,4]",
        "session_score": "15",
        "isSync": "true"
    ]

    // Convert parameters to Data
    guard let jsonData = try? JSONSerialization.data(withJSONObject: parameters) else {
        print("Error converting parameters to JSON data")
        return
    }

    // Create the request
    var request = URLRequest(url: apiUrl)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = jsonData

    // Create a URLSession data task
    let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
        // Handle the response
        if let error = error {
            print("Error: \(error.localizedDescription)")
            return
        }

        if let data = data {
            // Parse the response data (if needed)
            do {
                let jsonResponse = try JSONSerialization.jsonObject(with: data, options: [])
                print("Response: \(jsonResponse)")
            } catch {
                print("Error parsing JSON: \(error.localizedDescription)")
            }
        }
    }

    // Resume the task to initiate the request
    task.resume()
  }*/


  
}


extension Double {
    var radians: Double { return Measurement(value: self, unit: UnitAngle.degrees).converted(to: UnitAngle.radians).value }
    var degrees: Double { return Measurement(value: self, unit: UnitAngle.radians).converted(to: UnitAngle.degrees).value }
}
