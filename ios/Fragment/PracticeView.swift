//
//  ExpandableListView.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 25/11/23.
//

import Foundation
import SwiftUI
import DGCharts
import Charts
import TensorFlowLite
import Darwin

extension Array where Element: Hashable{
      func mode() -> Element? {
        let counts = reduce(into: [:]) { $0[$1, default: 0] += 1 }
        let sortedCounts = counts.sorted { $0.value > $1.value }
        return sortedCounts.first?.key
      }
    }
  

struct PracticeView: View {
  var dismiss : () -> Void
  @State var progress: Double = 0.0
  @State private var isPauseConditionMet = true
  @State private var isNavigationSettingLink = false
  @State private var isNavigationStatisticLink = false
  @StateObject private var puttListViewModel = PuttsListViewModel()
  @StateObject private var sessionListViewModel = SessionListViewModel()
  @State private var isTooltipVisible = false
  @State private var isTooltipText = ""
  @State private var batteryPercent = ""
  @State var tfliteInterpreter: Interpreter?
  
  @State var isSensorThreadRunning: Bool = false
  @State var isLoopRunning: Bool = false
  @State var isPracticePause : Bool = false
  @State var isResumeClicked : Bool = false
  @State var puttSessionName: String = ""
  @State var puttNumber: Int = 0
  @State var accelX1 : Double = 0.0
  @State var accelY1 : Double = 0.0
  @State var accelZ1 : Double = 0.0
  @State var gyroX1 : Double = 0.0
  @State var gyroY1 : Double = 0.0
  @State var gyroZ1 : Double = 0.0
  @State private var showAlert = false
  @State private var screenColor = ""
  
  @State private var PuttingTempoValue = "0.0"
  @State private var PuttingTempoRedArrowValue : String = "0.0"
  @State private var PuttingTempoGreenArrowValue : String = "0.0"
  @State private var loftAngleValue : String = "0.0"
  @State private var loftAngleValueTxt : String = "0.0"
  @State private var loftAngleDecreeTxt : String = "0.0"
  @State private var loftAngleStick : Int = 0
  @State private var FtPuttingDistance : String = ""
  @State private var PutterPositionImgGolfStick : Int = 0
  @State private var PutterFaceAngleImgGolfStickRotation : Double = 0
  
  @State private var putterFaceAngleDegreeTxt :String = "0.0"
  @State private var putterFaceAngleValueTxt : String = "0.0"
  @State private var putterFacePositionAngleValueTxt : String = "0.0"
  
  @State private var putterFacePositionAngleDecreeTxt :String = "0.0"
  @State private var lieAngleStart : String = "0.0"
  @State private var lieAngleImpact : String = "0.0"
  @State private var lieAngleValueTxt : String = "0.0"
  @State private var PutterFaceAngleImgGolfStickXPosition : Double = 0.0
  @State private var PutterFaceAngleImgGolfStickYPosition : Double = 0.0
  
  
  @State private var accelerationImpactValueTxt : String = "0.0"
  @State private var accelerationImpactDegreeTxt : String = "0.0"
  @State private var PuttDataArray : [SinglePuttData] = []
  @State private var PuttDataString = ""
  @State private var TotalputtDataScore : Int = 0
  @State private var puttingDistance = 0
  @State private var CalculationMap : [String :Any] = [:]
  @State private var puttsIdIndex = 0
  
  @State private var thresholdSliderValue = 3
  @State private var scoreData = ["2", "3", "4", "2", "6", "5", "6", "7"]
  @State private var bleReponseData: [Data] = []
  @StateObject private var chartViewModel = ChartViewModel()
  let bleManager  = BLEManager.shared
  let concurrentQueue = DispatchQueue(label: "com.example.concurrentQueue", attributes: .concurrent)
   
  

  
  var body: some View {
    GeometryReader { geometry in
      ScrollView{
        if #available (iOS 15.0,*)
        {
          VStack{
            Button(" Back") {
              DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                withAnimation {
                  BLEManager.destroy()
                  puttListViewModel.deleteCompletsPutts()
                  stopSensorThread()
                  dismiss()
                  let events = BridgeEvent()
                  events.doMyAction("")
                }
              }
            }
              .foregroundColor(.white)
              .frame(maxWidth: .infinity, alignment:.leading)
              .padding(.bottom,10)
              .padding(.top,10)
          }.background(Color.appRed)
          VStack{
            Text(batteryPercent.count != 0 ? "Battery : \(batteryPercent) %" : "")
              .foregroundColor(.white)
              .frame(maxWidth: .infinity, alignment:.trailing)
              .padding(10)
          }.background(.black)
            .padding(10)
            .alert(isPresented: $showAlert) {
              
              showBatteryAlert()
              
            }
        }
        
        VStack{
          VStack(spacing :20){
            HStack(spacing : 50){
              Button("OPEN SETTING") {
                // Action to be performed when the button is tapped
                print("Button tapped!")
                isNavigationSettingLink.toggle()
                
              }
              .padding(10)
              .foregroundColor( .white)
              .background(Color.appRed)
              .cornerRadius(5)
              Button("OPEN STATISTIC") {
                // Action to be performed when the button is tapped
                print("Button tapped!")
                isNavigationStatisticLink.toggle()
                
              }
              .padding(10)
              .foregroundColor(.white)
              .background(Color.appRed)
              .cornerRadius(5)
            }
            
            VStack{
              VStack
              {
                Rectangle()
                  .fill(screenColor == "RED" ? Color.appRed : screenColor == "GREEN" ? Color.appGreen : screenColor == "BLUE" ? Color.appBlue :Color.black)
                  .frame(width: 60,height: 60)
              }.frame(maxWidth: .infinity, alignment: .trailing)
                .padding(.trailing,50)
              
              VStack(){
                ZStack {
                  // 2
                  CircularProgressView(progress: progress/10)
                  // 3
                  Text("\(progress * 10, specifier: "%.0f")%")
                    .font(.title3)
                    .bold()
                }.frame(width: 200, height: 200)
                
                Text("Putt Numbers \(puttNumber)")
                Text("\(getSliderValue()) ft")
                
              }.padding(.top, -40)
              
              VStack{
                VStack(){
                  
                  HStack{
                    Text("Top View")
                      .overlay(
                        Rectangle()
                          .fill(.black).frame(height: 1).offset(y: 4)
                        , alignment: .bottom)
                      .padding(.bottom,5)
                    
                    VStack {
                      Image(systemName: "info.circle.fill")
                        .resizable()
                        .frame(width: 15,height: 15 )
                        .onTapGesture {
                          // Toggle the visibility of the tooltip
                          withAnimation {
                            isTooltipVisible.toggle()
                            isTooltipText = "The path followed by putter head"
                            showTooltip()
                          }
                        }
                      
                    }
                  }
                  
                }.frame(maxWidth: .infinity, alignment:.leading)
                  .overlay(
                    Rectangle()
                      .fill(.gray).frame(height: 2).offset(y: 1)
                    , alignment: .bottom)
                
              }.padding(10)
                .overlay(
                  TooltipView(isVisible: $isTooltipVisible, message: $isTooltipText))
              
              VStack {
                LineDGChartView(viewModel: chartViewModel)
                  .frame(height: 150)
                  .onAppear {
                    // Simulating data change
                  }
              }
            //  LineDGChartView(dataArray: $CalculationMap)
              //  .frame(height: 200)
              
              
              HStack(spacing : 50){
                Button(isPracticePause ? "RESUME PRACTICE" : "PAUSE PRACTICE") {
                  // Action to be performed when the button is tapped
                 
                    if(isPracticePause) {
                      isPracticePause = false
                      isResumeClicked = true
                    }
                    else {
                      isPracticePause = true
                      isResumeClicked = false
                    }
                  
                  print("Button tapped!")
                }
                .disabled(isPauseConditionMet)
                .padding(10)
                .foregroundColor(isPauseConditionMet ? .appPurple200 : .white)
                .background(isPracticePause ? .black : Color.appRed)
                .cornerRadius(5)
                Button("STOP SESSION") {
                  // Action to be performed when the button is tapped
                  SyncUploading()
                  
                }
                .padding(10)
                .foregroundColor(.white)
                .background(Color.appRed)
                .cornerRadius(5)
              }
              
              
            }
            
          }
          
          ExpandableListView(
            PuttingTempoValue: $PuttingTempoValue, PuttingTempoRedArrowValue: $PuttingTempoRedArrowValue, PuttingTempoGreenArrowValue: $PuttingTempoRedArrowValue,
            loftAngleValueTxt : $loftAngleValueTxt,loftAngleValue : $loftAngleValue ,loftAngleDecreeTxt : $loftAngleDecreeTxt, loftAngleStick : $loftAngleStick, putterFaceAngleDegreeTxt : $putterFaceAngleDegreeTxt, putterFaceAngleValueTxt : $putterFaceAngleValueTxt, putterFacePositionAngleValueTxt : $putterFacePositionAngleValueTxt, putterFacePositionAngleDecreeTxt : $putterFacePositionAngleDecreeTxt, lieAngleStart :$lieAngleStart , lieAngleImpact : $lieAngleImpact, lieAngleValueTxt : $lieAngleValueTxt, accelerationImpactValueTxt : $accelerationImpactValueTxt, accelerationImpactDegreeTxt : $accelerationImpactDegreeTxt,
            PutterPositionImgGolfStick : $PutterPositionImgGolfStick, PutterFaceAngleImgGolfStickRotation : $PutterFaceAngleImgGolfStickRotation, PutterFaceAngleImgGolfStickXPosition : $PutterFaceAngleImgGolfStickXPosition, PutterFaceAngleImgGolfStickYPosition : $PutterFaceAngleImgGolfStickYPosition
          )
        }
      }
    }.onAppear{
      
      
      loadModule()
      //let csv = CSVReaderMainMethod()
      //CalculationMap = csv.calculation(file: dum1, threshold: 3, scoreData: scoreData)
      
      let paths = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)
      print(paths[0])
       
      
    }
    
    .sheet(isPresented: $isNavigationSettingLink) {
      SettingView(isNavigationSettingLink: $isNavigationSettingLink)
    }
    .sheet(isPresented: $isNavigationStatisticLink) {
      StatisticView()
    }
    
    
  }
  
  func SyncUploading()
  {
    
    print("Button tapped!")
    ///stoping session
    isSensorThreadRunning = false;
    isLoopRunning = false;
    let bleManager = BLEManager.shared
    bleManager().disconnect()
    callAPI()
    
  }
  
  func showTooltip() {
    isTooltipVisible = true
    
    // Dismiss the tooltip after a certain duration (e.g., 3 seconds)
    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
      withAnimation {
        isTooltipVisible = false
      }
    }
  }
  
  ///Actual Calculation
  func loadModule(){
    DispatchQueue.global().async {
      interpret()
      startSensorThread()
    }
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
      
      scoreData = getScoredata()
      thresholdSliderValue = Int(getSliderValue()) ?? 0
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
    PredictClassflag = false
    
    let sessionStartDateTime = getCurrentDateTime(format: yearTimeFormat)
    SessionTime = sessionStartDateTime
    DispatchQueue.global().async {
      DispatchQueue.main.async {
        sessionListViewModel.getAllSessions()
        
        let sessionid = sessionData.map{$0.sessionId}
        print(sessionid.last)
        
        print("D : \(sessionid)")
        if let count = sessionid.last {
          // Use 'count' here
          print("Count: \(count)")
          SESSIONID = Int(count)+1
          sessionListViewModel.addSession(sessionId: Int(count)+1, userID: Int(getUserID()) ?? 0, start_date_time: sessionStartDateTime, end_date_time: "", total_puts: 10, isSync: false)
        } else {
          // Handle the case where 'optionalCount' is nil
          print("Count is nil")
          SESSIONID = 1
          sessionListViewModel.addSession(sessionId: 1, userID: Int(getUserID()) ?? 0, start_date_time: sessionStartDateTime, end_date_time: "", total_puts: 10, isSync: false)
        }
      }}
    puttSessionName = getSessionName()
    if(puttSessionName.count == 0)
    {
      puttSessionName = "sesssion" + getCurrentDateTime(format: yearTimeFormat)
    }
    
    print("This is run on a background queue")
    ReceiveSensorDataThread()
    
  }
  
  func BluetoothHandler()
  {
    //Bluetooth code
    
    bleManager().didUpdateValueForCharacteristic = { characteristic in
      //print("Updated value for characteristic: \(characteristic)")
      
      guard let data = characteristic.value else {
//        usleep((1000))
        return
      }
      
      // processReceivedData(responsedata: data)
      
      let OtherParameterValue = String(data: data, encoding: .utf8) ?? ""
      // print(String(data: data, encoding: .utf8) ?? "")
      let accelx = self.splitSensorReading(OtherParameterValue)
      
      accelX1 = accelx["ax"] ?? 0.0
      accelY1 = accelx["ay"] ?? 0.0
      accelZ1 = accelx["az"] ?? 0.0
      gyroX1 = accelx["gx"] ?? 0.0
      gyroY1 = accelx["gy"] ?? 0.0
      gyroZ1 = accelx["gz"] ?? 0.0
      batteryPercent = String(accelx["bat"] ?? 0.0);
    
   
      
      /*print("Device REsponse  \(accelX1)")
       print("\(accelY1)")
       print("\(accelZ1)")
       print("\(gyroX1)")
       print("\(gyroY1)")
       print("\(gyroZ1)")*/
      
      /* print("\(accelx["ax"])")
       print("\(accelx["ay"])")
       print("\(accelx["az"])")
       print("\(accelx["gx"])")
       print("\(accelx["gy"])")
       print("\(accelx["gz"])")
       print("\(accelx["bat"])")*/
      
      
      
    }
    
  }
  
  
  func ReceiveSensorDataThread()
  {
    
    var isRunning :Bool = false
    var macAddress = getMacAddress()
    var batPercentage = 0.0
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
    //var isPracticePause : Bool = false
    var dataArray: [[Double]] = []
    var output_arr = [Int](repeating: 2, count: 40)
    var shot_num = 0;
    puttingDistance = thresholdSliderValue
    var puttThreshold = thresholdSliderValue
    var count = 0
    var puttTime = 100
    var numPuttsCount = 1
    var numTime = puttTime * 60 * 1000;
    var frequencyCount = 0
    var lastBatteryCount = 0;
    
    var accelX2 : Double =  0.0;
    var accelY2 : Double =  0.0;
    var accelZ2 : Double = 0.0;
    var gyroX2 : Double =  0.0;
    var gyroY2 : Double =  0.0;
    var gyroZ2 : Double =  0.0;
    
    
    var frequencyStartTime = Date().timeIntervalSince1970
    var check_time = Date().timeIntervalSince1970
    var check_time1 = Date().timeIntervalSince1970
    var start_time = Date().timeIntervalSince1970
    var startTime = Date().timeIntervalSince1970
    
    
    batPercentage = Double(batteryPercent) ?? 0.0
    puttsIdIndex = 0
    
    var rootCreatedFolderURL : URL?
    var subCreatedFolderURL : URL?
    var timestampDate = getCurrentDateTime(format: "yyyy-MM-dd")
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
    
    
    let conQ = DispatchQueue(label:"abc", attributes: .concurrent)
    
    conQ.async{
      BluetoothHandler()
    }
    
    conQ.async{
      //    DispatchQueue.global(qos: .background).async {
      sleep(4)
      while (isSensorThreadRunning) {
        usleep((3000))
        if (!isStartTrue) {
          
          if (((Date().timeIntervalSince1970) - frequencyStartTime) < 1000) {
            frequencyCount+=1;
          } else {
            //double frequency = (double) frequencyCount / 1.0; // Divide by 1 second
            let finalFrequencyCount = frequencyCount;
            
            frequencyCount = 0;
            frequencyStartTime = Date().timeIntervalSince1970
          }
          
        }
        
        if (lastBatteryCount == 0) {
          lastBatteryCount = Int(batPercentage);
          if (lastBatteryCount != 0)
          {
            
            if (batPercentage > 100) {
              batteryPercent =  "100" ;
            } else {
              batteryPercent =  String(batPercentage)
            }
            if (batPercentage < 10) {
              showAlert = true
            }
            
            
          }
        }
        
        
        /*print("Original REsponse  \(accelX1)")
         print("\(accelY1)")
         print("\(accelZ1)")
         print("\(gyroX1)")
         print("\(gyroY1)")
         print("\(gyroZ1)")*/
        
        
        accelX2 = accelX1 ;
        accelY2  = accelY1 ;
        accelZ2  = accelZ1 ;
        gyroX2  = gyroX1 ;
        gyroY2  = gyroY1 ;
        gyroZ2  = gyroZ1 ;
        
        /* print("copying Response  \(accelX2)")
         print("\(accelY2)")
         print("\(accelZ2)")
         print("\(gyroX2)")
         print("\(gyroY2)")
         print("\(gyroZ2)")*/
        
        
        
        // print("DataArray: \(dataArray)")
        
        /*var accelX2 : Double = 0.2937012
         var accelY2 : Double = -0.09179688
         var accelZ2 : Double = 0.8896484
         var gyroX2 : Double = 0.5267176
         var gyroY2 : Double =  -1.923664
         var gyroZ2 : Double = -0.6335878*/
        
        let sensorArray: [[Double]] = [[accelX2, accelY2, accelZ2, gyroX2, gyroY2, gyroZ2]]
        let rotationData = getRotation(ax: sensorArray[0][0], ay: sensorArray[0][1], az: sensorArray[0][2], gx: sensorArray[0][3], gy: sensorArray[0][4], gz: sensorArray[0][5])
        
        let input: [Double] = [
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
        
        let result = vstackWithFifo(array: windowArray, input: newSensorData)
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
          
          print(" TensorFlowOutput :\(outputIndex)")
          var outputIdxArray = [Int](repeating: 0, count: 1)
          outputIdxArray[0] = outputIndex
          let outputIndexresult = vstackForOutputIndex(array: output_arr, input: outputIdxArray)
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
          
          let maxValueIndexArray = [count0, count1, count2]
          let max_value = output_arr.mode() ?? 0
          //   let max_value = maxValueIndexArray.firstIndex(of: max) ?? 0
          
          print("maxValueIndexArray: \(maxValueIndexArray)")
          print("maxV: \(max_value)")
          print("outputIndex: \(outputIndex)")
          //   print("maxvalue: \(max_value)")
          
          if max_value != 0 && !record {
            check_time = Date().timeIntervalSince1970  // Reset the start time if pred is not equal to 2
            // Assuming `screenColor` is a UIView
            screenColor = "RED"
            print("==WAITING====: \(count)  ===WAITING===")
            
            
          } else if (((Date().timeIntervalSince1970) - check_time) >= 0.5) { // 1 second in nanoseconds
            // Assuming `screenColor` is a UIView
            
            
            
            print("==SAVING====: \(count)  ===SAVING===")
            screenColor = "BLUE"
            
            isConditionMet = true
            if isConditionMet && !isSoundPlayed {
              // Assuming `soundPlayer` is an instance of a sound player class
              soundPlayer.playSound(soundName: "start")
              
              isSoundPlayed = true
              isConditionMet = false
            }
            
            //let current_time = Double(DispatchTime.now().uptimeNanoseconds) - start_time / Double(1000)
            
            let current_time = Double(Date().timeIntervalSince1970) - start_time
            
            let data_point: [Double] = [current_time, gyroX2, gyroY2, gyroZ2, accelX2, accelY2, accelZ2]
            
            print("DataPoint: \(data_point)")
            dataArray.append(data_point)
            record = true
            
            if max_value == 1 && record {
              // Assuming `screenColor` is a UIView
              screenColor = "GREEN"
              
              
              
              // Update the screen
            }
            
            else if max_value == 0 {
              // Do nothing
            }
            
            else if max_value == 2 {
              calculate = true
              
              print("==RESETTING====: \(count)  ===RESETTING===")
              check_time1 =  Date().timeIntervalSince1970
              
              isConditionMet1 = true;
              if (isConditionMet1 && !isSoundPlayed1) {
                
                soundPlayer.playSound(soundName: "stop");
                
                isSoundPlayed1 = true;
                isConditionMet1 = false;
                //  isSoundPlayed2 = false
              }
              if calculate {
                do {
                  print("Calculate: \(count)  Calculating")
                  
                  // create .csv files
                  let timestamp = getCurrentDateTime(format: "yyyy-MM-dd")
                  let f = URL(fileURLWithPath: subCreatedFolderURL!.path).appendingPathComponent("sensor_data_\(timestamp).csv")
                  try dataArray.map { "\($0[0]),\($0[1]),\($0[2]),\($0[3]),\($0[4]),\($0[5]),\($0[6])\n" }.joined().write(to: f, atomically: true, encoding: .utf8)
                  
                  print("DataArray :\(dataArray)")
                  let csv = CSVReaderMainMethod()
                  
                  let calculationMap = csv.calculation(file: dataArray, threshold: puttThreshold, scoreData: scoreData)
                  if(calculationMap.count != 0)
                  {
                    UpdateValues(CalculationArray: calculationMap,numPuttsCount: numPuttsCount, puttingDistance: puttingDistance)
                    isPauseConditionMet = false
                  }
                  else
                  {
                    isConditionMet2 = true;
                    if (isConditionMet2 && !isSoundPlayed2) {
                      soundPlayer.playSound(soundName: "invalidput");
                      isPauseConditionMet = true
                      isSoundPlayed2 = true;
                      isConditionMet2 = false;
                    }
                    dataArray = []
                    print("catch", "Null values in calculation");
                    record = false;
                    isSoundPlayed = false;
                    isSoundPlayed1 = false;
                    
                    continue
                  }
                  
                  
                  while true {
                    if ((Date().timeIntervalSince1970) - check_time1 <= 3 || isPracticePause) {
                      if (isPracticePause) {
                        print("PracticePausestarted")
                        isSoundPlayed = false;
                        isSoundPlayed1 = false;
                        isPauseConditionMet = false
                        check_time1 = Date().timeIntervalSince1970
                      } else if ((Date().timeIntervalSince1970) - check_time1 <= 5) {
                        isSoundPlayed = false;
                        isSoundPlayed1 = false;
                        print("sleep3sec")
                      }
                      
                    } else {
                      print("asdasd")
                      break;
                    }
                  }
                  
                  
                  // let csv = CSVReaderMainMethod()
                  //  let CalculationMap = csv.calculation(file: DummyTestingdata, threshold: 3, scoreData: scoreData)
                  
                  // UpdateValues(CalculationArray: CalculationMap,numPuttsCount: numPuttsCount, puttingDistance: puttingDistance)
                  
                  
                  
                  
                  start_time = Date().timeIntervalSince1970
                  print("End", "End Session ");
                  record = false;
                  
                  numPuttsCount += 1;
                  
                  screenColor = "BLACK"
                  isPauseConditionMet = true
                  puttNumber = numPuttsCount
                  
                  // isSoundPlayed2 = false;
                  dataArray = []
                  
                  
                } catch {
                  isConditionMet2 = true;
                  if (isConditionMet2 && !isSoundPlayed2) {
                    soundPlayer.playSound(soundName: "invalidput");
                    isSoundPlayed2 = true;
                    isConditionMet2 = false;
                    record = false;
                  }
                  dataArray = []
                  isSoundPlayed = false;
                  isSoundPlayed1 = false;
                  print(error.localizedDescription)
                }
              }
              
            }
          }
          count += 1
        }
        catch{
          
        }
        
        
      }
    }
    //}
    
    
  }
  
  

  func stopSensorThread() {
    // Set the flag to stop the SensorThread gracefully
    isSensorThreadRunning = false;
    isLoopRunning = false;
  }
  
  func setUpPutterProgressData(avgScore : Int ,numPuttsCount : Int  )
  {
    progress = Double(avgScore)
    puttNumber = numPuttsCount
  }
  
  func setUpValuesForPuttingTempo( puttingTempoValue : String, redArrowValue : String,  greenArrowValue : String)
  {
    DispatchQueue.main.async {
      PuttingTempoValue = puttingTempoValue
      PuttingTempoRedArrowValue =  redArrowValue
      PuttingTempoGreenArrowValue = greenArrowValue
    }
  }
  
  func setUpValuesForLoftAngle( loftAngleValue : String , loftAngleDecree : String)
  {
    //DispatchQueue.main.async {
      loftAngleValueTxt = "Open : " + loftAngleValue
      self.loftAngleValue = loftAngleValue
      loftAngleDecreeTxt = loftAngleDecree
   // }
  }
  
  func setUpValuesForLoftAnglePosition( newTopMargin : Int)
  {
    //DispatchQueue.main.async {
      loftAngleStick = newTopMargin
    //}
  }
  
  func setUpValuesForPutterPositionImgGolfStick( newTopMargin : Int)
  {
   // DispatchQueue.main.async {
      PutterPositionImgGolfStick = newTopMargin
   // }
  }
  
  func setUpValuesForPutterFaceAngleImgGolfStickRotation ( newRotation : Double)
  {
   // DispatchQueue.main.async {
      PutterFaceAngleImgGolfStickRotation = newRotation
   // }
  }
  
  func setUpValuesForPutterFaceAngleImgGolfStickXPoistion( XPoisition : Double)
  {
    //DispatchQueue.main.async {
      PutterFaceAngleImgGolfStickXPosition = XPoisition
    //}
  }
  
  func setUpValuesForPutterFaceAngleImgGolfStickYPoistion( YPoisition : Double)
  {
   // DispatchQueue.main.async {
      PutterFaceAngleImgGolfStickYPosition = YPoisition
    //}
  }
  
  
  
  func setUpValuesForPutterFaceAngle( putterFaceAngleValue : String,putterFaceAngleDegree : String)
  {
   // DispatchQueue.main.async {
      if(Int(putterFaceAngleDegree) ?? 0 > 0)
      {
        putterFaceAngleDegreeTxt =  "Open : " +  putterFaceAngleDegree
        putterFaceAngleValueTxt =  putterFaceAngleDegree
      }
      else{
        putterFaceAngleDegreeTxt =  "Close : " +  putterFaceAngleDegree
        putterFaceAngleValueTxt =   putterFaceAngleDegree
      }
  //  }
  }
  
  func setUpValuesForPutterAnglePosition( putterFacePositionAngleValue : String,putterFacePositionAngleDecree : String)
  {
//    DispatchQueue.main.async {
      putterFacePositionAngleValueTxt = putterFacePositionAngleValue
      putterFacePositionAngleDecreeTxt = "Putter Face Pos: " + putterFacePositionAngleDecree
  //  }
  }
  
  
  func setUpValuesForLieAngle( lieAnglestartValue : String,lieAngleimpactValue : String)
  {
 // DispatchQueue.main.async {
      lieAngleStart =  "Lie Angle Start : " + lieAnglestartValue
      lieAngleImpact = "Lie Angle Impact : " + lieAngleimpactValue
      lieAngleValueTxt = lieAngleimpactValue
   // }
  }
  
  
  func setUpValuesForPutterAccelarationImpact( accelerationImpactValue : String,accelerationImpactDegree : String)
  {
  //  DispatchQueue.main.async {
      accelerationImpactValueTxt = accelerationImpactValue
      accelerationImpactDegreeTxt = accelerationImpactValue + "m/s"
  //  }
    
  }
  
  
  func UpdateValues(CalculationArray : [String :Any], numPuttsCount : Int ,puttingDistance : Int)
  {
    
    do {
      print("Updating Values")
      // Decode JSON data into GolfData struct
      let data = try JSONSerialization.data(withJSONObject: CalculationArray)
      
      // Decode JSON data into GolfData struct
      
      let golfDataMap = try JSONDecoder().decode(GolfData.self, from: data)
     
      
      DispatchQueue.global().async {
        DispatchQueue.main.async {
          
        self.chartViewModel.dataArray =  CalculationArray
          
          setUpPutterProgressData(avgScore: golfDataMap.avgScore, numPuttsCount: numPuttsCount)
          
          setUpValuesForPuttingTempo(puttingTempoValue: golfDataMap.ratioBackFront, redArrowValue: String(format: "%0.2f", golfDataMap.backstrokeTime), greenArrowValue: String(format: "%0.2f", golfDataMap.frontImpactTime))
          
          setUpValuesForLoftAngle(loftAngleValue: String(format: "%0.2f", golfDataMap.loftAngle), loftAngleDecree: String(format: "%0.2f", golfDataMap.loftAngle))
          
          setUpValuesForLoftAnglePosition(newTopMargin: (Int(String(format: "%.2f", golfDataMap.elevationImpact)) ?? 0)  * 10)
          FtPuttingDistance = "(\(puttingDistance)) ft)"
          
          setUpValuesForPutterFaceAngle(putterFaceAngleValue:  String(format: "%0.2f", golfDataMap.diffYaw), putterFaceAngleDegree:  String(format: "%0.2f", golfDataMap.diffYaw))
          
          setUpValuesForLieAngle(lieAnglestartValue: String(format: "%0.2f", golfDataMap.rollStart), lieAngleimpactValue:String(format: "%0.2f", golfDataMap.rollImpact))
          
          setUpValuesForPutterAccelarationImpact(accelerationImpactValue: String(format: "%0.2f", golfDataMap.accelerationImpact), accelerationImpactDegree: String(format: "%0.2f", golfDataMap.accelerationImpact))
          setUpValuesForPutterAnglePosition(putterFacePositionAngleValue: String(format: "%0.2f", golfDataMap.posYImpact), putterFacePositionAngleDecree: String(format: "%0.2f", golfDataMap.posYImpact))
          
          setUpValuesForPutterPositionImgGolfStick(newTopMargin: (Int( String(format: "%0.2f", golfDataMap.posYImpact)) ?? 0)  * 10)
          
          setUpValuesForPutterFaceAngleImgGolfStickRotation(newRotation: Double(golfDataMap.diffYaw))
          setUpValuesForPutterFaceAngleImgGolfStickXPoistion(XPoisition: 2)
          setUpValuesForPutterFaceAngleImgGolfStickYPoistion(YPoisition: 2)
          
       }
      }
      
      
      
      var jsonFrontStrokeString : String?
      var jsonBackStrokeString : String?
      var jsonVelocityabsString : String?
      
      
      let ratioBackFront = (golfDataMap.ratioBackFront)
      let elevationImpact =  round((Double(golfDataMap.elevationImpact)) * 100.0) / 100.0
      let posYImpact = round((Double(golfDataMap.posYImpact)) * 100.0) / 100.0
      let loftAngle = round((Double(golfDataMap.loftAngle)) * 100.0) / 100.0
      let rollStart = round((Double(golfDataMap.rollStart)) * 100.0) / 100.0
      let rollImpact = round((Double(golfDataMap.rollImpact)) * 100.0) / 100.0
      let diffYaw = round((Double(golfDataMap.diffYaw)  * 100.0) / 100.0 )
      let accelerationImpact = round((Double(golfDataMap.accelerationImpact)) * 100.0) / 100.0
      let avgScore = (golfDataMap.avgScore)
      
      if let jsonData = JSONEncoder.jsonData(from: golfDataMap.frontStroke) {
        if let FrontStrokeString = String(data: jsonData, encoding: .utf8) {
          print(FrontStrokeString)
          jsonFrontStrokeString = FrontStrokeString
        }
      }
      
      if let jsonData1 = JSONEncoder.jsonData(from: golfDataMap.backstroke) {
        if let BackStrokeString = String(data: jsonData1, encoding: .utf8) {
          print(BackStrokeString)
          jsonBackStrokeString = BackStrokeString
        }
      }
      
      if let jsonData2 = JSONEncoder.jsonData(from: golfDataMap.velocityAbs) {
        if let VelocStrokeString = String(data: jsonData2, encoding: .utf8) {
          print(VelocStrokeString)
          jsonVelocityabsString = VelocStrokeString
        }
      }
      
      
      // let puttid = puttData.map{$0.id}
      if (puttsIdIndex != 0) {
        // Use 'count' here
        print("Count: \(puttsIdIndex)")
        // puttListViewModel.getAllPutts()
        puttsIdIndex += 1
        DispatchQueue.main.async {
          
          puttListViewModel.addGoal(idd:  Int(puttsIdIndex), userID: Int(getUserID()) ?? 0, sessionId:  SESSIONID ?? 0,  bbStrokeRatio:  ratioBackFront, elevationAtImp: elevationImpact, offCenterImp: 0.0, loftAngle: loftAngle, angLieStart: 0.0, angLieImp: 0.0, putterFaceAng: 0.0, frontStroke: jsonFrontStrokeString ?? "", backStroke: jsonBackStrokeString ?? "", velocityAbs: jsonVelocityabsString ?? "", accelerationImpact: String(accelerationImpact), score_putt: avgScore)
          
        }
        
      } else {
        // Handle the case where 'optionalCount' is nil]
        // puttListViewModel.getAllPutts()
        
          print("Count is nil")
          
          puttListViewModel.addGoal(idd: 0, userID:  Int(getUserID()) ?? 0, sessionId: SESSIONID ?? 0, bbStrokeRatio: ratioBackFront, elevationAtImp: elevationImpact, offCenterImp: 0.0, loftAngle: loftAngle, angLieStart: 0.0, angLieImp: 0.0, putterFaceAng: 0.0, frontStroke: jsonFrontStrokeString ?? "", backStroke: jsonBackStrokeString ?? "", velocityAbs: jsonVelocityabsString ?? "", accelerationImpact: String(accelerationImpact), score_putt: avgScore)
        
        
      }
      //  Log.d("puttData", (puttModel).getBbstrokeRatio());
      
      
    } catch {
      print("Error decoding JSON: \(error)")
    }
    
    
    //print("Calculation Starterd :   \(CalculationArray)")
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
    puttListViewModel.getAllPutts()
    
    let sessionEndDateTime = getCurrentDateTime(format: yearTimeFormat)
    sessionListViewModel.updateRecords(sessionId: SESSIONID ?? 0, endDateTime: sessionEndDateTime)
    
    //   let puttModel = puttData.map{$0}
    
    for puttModel in puttData {
      var singlePutt = SinglePuttData()
      singlePutt.bbstrokeRatio = puttModel.bbstrokeRatio ?? ""
      singlePutt.elevationAtImp = puttModel.elevationAtImp
      singlePutt.offCentreImp = puttModel.offCenterImp
      singlePutt.loftAngle = puttModel.loftAngle
      singlePutt.angLieStart = puttModel.angLieStart
      singlePutt.angLieImp = puttModel.angLieImp
      singlePutt.putterFaceAng = puttModel.putterFaceAng
      singlePutt.frontStroke = puttModel.frontStroke ?? ""
      singlePutt.backStroke = puttModel.backStroke ?? ""
      singlePutt.velocityAbs = puttModel.velocityAbs ?? ""
      singlePutt.accelerationImpact = Double(puttModel.accelerationImpact ?? "0.0") ?? 0.0
      singlePutt.scorePutt = Int(puttModel.score_putt)
      singlePutt.ftDistance = puttingDistance
      singlePutt.avgScore = 0
      
      PuttDataArray.append(singlePutt)
      TotalputtDataScore += Int(puttModel.score_putt)
    }
   

    let total_puts = PuttDataArray.count;
    var syncSession = SyncSessionDataModel()

    if total_puts == 0
    {
      
      // Handle the division by zero case (e.g., display an error message or set a default value).
      print("Error: Division by zero is not allowed.")
      DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
        withAnimation {
          BLEManager.destroy()
          puttListViewModel.deleteCompletsPutts()
          stopSensorThread()
          dismiss()
          
          let events = BridgeEvent()
          events.doMyAction("")
        }
      }
    }
    else
    {
      let avgScore = TotalputtDataScore / total_puts;
      
      syncSession.sessionid = Int(SESSIONID ?? 0)
      syncSession.sessionName = SessionName
      syncSession.coachId = 0;
      syncSession.userId = Int(UserID) ?? 0
      syncSession.startDatetime = SessionTime
      syncSession.endDatetime = sessionEndDateTime
    //  syncSession.putt  = PuttDataArray
      syncSession.totalPuts  = total_puts
      syncSession.timeRatio  = "2:1"
      syncSession.sessionScore  = avgScore
      syncSession.isSync = true
      
      let angLieImpValues = puttData.map { $0.angLieImp }
      
      // Calculate the average
      let angleOfImapct_average = angLieImpValues.reduce(0.0, +) / Double(angLieImpValues.count)
      // Define your API endpoint URL
      let apiUrl = URL(string: BASEURL + SYNCENDPOINTS)!
      
      
      let parameters1: [String: Any] = [
        "user_id": UserID,
        "coach_id": "10",
        "start_datetime": SessionTime,
        "end_datetime": sessionEndDateTime,
        "total_puts": total_puts,
        "time_ratio":"2:1",
        "angle_of_impact":angleOfImapct_average,
        "session_score":avgScore,
        "is_sync":true,
        
        "session_name":SessionName,
        "putt": PuttDataArray.map { puttData in
          return [
            "bbstroke_ratio": puttData.bbstrokeRatio,
            "elevation_at_imp": puttData.elevationAtImp,
            "off_centre_imp": puttData.offCentreImp,
            "loft_angle": puttData.loftAngle,
              "ang_lie_start": puttData.angLieStart,
              "ang_lie_imp": puttData.angLieImp,
              "putter_face_ang": puttData.putterFaceAng,
              "score_putt": puttData.scorePutt,
              "ftDistance": puttData.ftDistance,
              "avg_score": puttData.avgScore,
              "acceleration_impact": puttData.accelerationImpact,
            "front_stroke": puttData.frontStroke,
            "back_stroke": puttData.backStroke,
            "velocity_abs": puttData.velocityAbs
          ]
      }
      ]
      
      print("json Request : \(parameters1)")
      sleep(1)
      // Convert parameters to Data
      guard let jsonData = try? JSONSerialization.data(withJSONObject: parameters1) else {
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
          //  let jsonResponse = try JSONSerialization.jsonObject(with: data, options: [])
            let jsonResponse = try JSONDecoder().decode(MyResponse.self, from: data)
            print("Response: \(jsonResponse)")
            print("Response_SessionID: \(jsonResponse.sessionId)")
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
              withAnimation {
                puttListViewModel.deleteCompletsPutts()
                BLEManager.destroy()
                stopSensorThread()
                dismiss()
                let events = BridgeEvent()
                events.doMyAction(String(jsonResponse.sessionId ))
              }
            }
            
            
          } catch {
            print("Error parsing JSON: \(error.localizedDescription)")
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
              withAnimation {
                puttListViewModel.deleteCompletsPutts()
                BLEManager.destroy()
                stopSensorThread()
                dismiss()
                let events = BridgeEvent()
                events.doMyAction("")
              }
            }
          }
        }
      }
      
      // Resume the task to initiate the request
      task.resume()
    }
    
  }
  
  func splitSensorReading(_ sensorReading: String) -> [String: Double] {
    var sensorData = [String: Double]()
    
    let components = sensorReading.components(separatedBy: ",")
    
    for component in components {
      let keyValue = component.components(separatedBy: ":")
      if keyValue.count == 2, let key = keyValue.first, let value = Double(keyValue[1]) {
        sensorData[key] = value
      }
    }
    
    return sensorData
  }
  
  func showBatteryAlert() -> Alert {
    
    Alert(
      title: Text("Low Battery Alert"),
      message: Text("Your battery is below 10%. Please charge your device."),
      primaryButton: .default(Text("OK")) {
        // Handle OK button action
      },
      secondaryButton: .cancel(Text("Cancel")) {
        // Handle Cancel button action
      }
    )
  }
 
  
  
}

struct PracticeViewViewPreviews: PreviewProvider {
    static var previews: some View {
      PracticeView(dismiss: {}).environment(\.managedObjectContext, CoreDataManager.shared.viewContext)
    }
}



struct GolfData: Codable {
    let elevationImpact: Double
    let posYImpact: Double
    let backstroke: [[Double]]
    let rollImpact: Double
    let loftAngle: Double
    let accelerationImpact: Double
    let frontStroke: [[Double]]
    let pitchImpact: Double
    let avgScore: Int
    let backstrokeTime: Double
    let velocityAbs: [Double]
    let frontImpactTime: Double
    let ratioBackFront: String
    let rollStart: Double
    let splitIndex: Int
    let centreFront: [[Double]]
    let diffYaw: Double
  
    enum CodingKeys: String, CodingKey {
      case elevationImpact = "elevation_impact"
      case posYImpact = "pos_y_impact"
      case backstroke = "backstroke"
      case rollImpact = "roll_impact"
      case loftAngle = "loft_angle"
      case accelerationImpact = "accelerationImpact"
      case frontStroke = "front_stroke"
      case pitchImpact = "pitch_impact"
      case avgScore = "avgScore"
      case backstrokeTime = "backstroke_time"
      case velocityAbs = "velocity_abs"
      case frontImpactTime = "front_impact_time"
      case ratioBackFront = "ratio_back_front"
      case rollStart  = "roll_start"
      case splitIndex = "splitIndex"
      case centreFront = "centre_front"
      case diffYaw = "diff_yaw"
        
      }

    
}


extension JSONEncoder {
    static func jsonData<T: Encodable>(from value: T) -> Data? {
        do {
            return try JSONEncoder().encode(value)
        } catch {
            print("Error encoding object to JSON: \(error.localizedDescription)")
            return nil
        }
    }
}


struct SinglePuttData: Codable {
  var id: Int
  var userId: Int
  var sessionId: Int
  var bbstrokeRatio: String
  var elevationAtImp: Double
  var offCentreImp: Double
  var loftAngle: Double
  var angLieStart: Double
  var angLieImp: Double
  var putterFaceAng: Double
  var frontStroke: String
  var backStroke: String
  var velocityAbs: String
  var scorePutt: Int
  var ftDistance: Int
  var avgScore: Int
  var accelerationImpact: Double
  
  init() {
      self.id = 0
      self.userId = 0
      self.sessionId = 0
      self.bbstrokeRatio = ""
      self.elevationAtImp = 0.0
      self.offCentreImp = 0.0
      self.loftAngle = 0.0
      self.angLieStart = 0.0
      self.angLieImp = 0.0
      self.putterFaceAng = 0.0
      self.frontStroke = ""
      self.backStroke = ""
      self.velocityAbs = ""
      self.scorePutt = 0
      self.ftDistance = 0
      self.avgScore = 0
      self.accelerationImpact = 0.0
    }
  
  enum CodingKeys: String, CodingKey {
    case id
    case userId = "user_id"
    case sessionId = "session_id"
    case bbstrokeRatio = "bbstroke_ratio"
    case elevationAtImp = "elevation_at_imp"
    case offCentreImp = "off_centre_imp"
    case loftAngle
    case angLieStart = "ang_lie_start"
    case angLieImp = "ang_lie_imp"
    case putterFaceAng = "putter_face_ang"
    case frontStroke = "front_stroke"
    case backStroke = "back_stroke"
    case velocityAbs = "velocity_abs"
    case scorePutt = "score_putt"
    case ftDistance = "ftDistance"
    case avgScore = "avg_score"
    case accelerationImpact = "acceleration_impact"
  }
}

struct SyncSessionDataModel: Codable {
    var id: Int
    var isSync: Bool
    var sessionid: Int
    var sessionName: String
    var userId: Int
    var coachId: Int
    var startDatetime: String
    var endDatetime: String
    var totalPuts: Int
    var timeRatio: String
    var angleOfImpact: Double
    var sessionScore: Int

    var putt: [SinglePuttData]
  
  init() {
    id = 0
    isSync = false
    sessionid = 0
    sessionName = ""
    userId = 0
    coachId = 0
    startDatetime = ""
    endDatetime = ""
    totalPuts = 0
    timeRatio = ""
    angleOfImpact = 0.0
    sessionScore = 0
    putt = []
  }

    enum CodingKeys: String, CodingKey {
        case id
        case isSync = "is_sync"
        case sessionid = "session_id"
        case sessionName = "session_name"
        case userId = "user_id"
        case coachId = "coach_id"
        case startDatetime = "start_datetime"
        case endDatetime = "end_datetime"
        case totalPuts = "total_puts"
        case timeRatio = "time_ratio"
        case angleOfImpact = "angle_of_impact"
        case sessionScore = "session_score"
        case putt
    }
  
}

struct MyResponse: Decodable {
    let message: String
    let sessionId: Int
    let status: Int

    private enum CodingKeys: String, CodingKey {
        case message
        case sessionId = "session_id"
        case status
    }
}

