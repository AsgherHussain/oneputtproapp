//
//  Constants.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

import Foundation
import TensorFlowLite

var SessionName : String = ""
var SessionTime : String = ""
var MacAddress : String = ""
var SliderValue : String = ""
var ScoreData : [String]?
var UserID :String = ""
var sessionData: [SessionEntity] = []
var puttData: [PuttEntity] = []
let yearTimeFormat = "yyyy-MM-dd HH:mm:ss.SS"
var SESSIONID : Int?
var BASEURL : String = "http://185.146.166.147:21000/"
var SYNCENDPOINTS : String = "PuttManagement/SyncSessionData"
var PredictClassflag : Bool = false
var h0Data : Tensor?
var C0Data : Tensor?

func getUserID() -> String  {
  UserID = UserDefaults.standard.object(forKey: "USERID") as? String ?? "10"
  return UserID
}

func getSliderValue() -> String  {
  if((UserDefaults.standard.object(forKey: "SLIDERVALUE")as? String)?.count == nil)
  {
    SliderValue = UserDefaults.standard.object(forKey: "REACTSLIDERVALUE") as? String ?? "3"
    return SliderValue
  }
  SliderValue = UserDefaults.standard.object(forKey: "SLIDERVALUE") as? String ?? "3"
  return SliderValue
}

func getSessionName() -> String  {
  SessionName = UserDefaults.standard.object(forKey: "SESSIONNAME") as? String ?? "Demo"
  return SessionName
}

func getSessionTime() -> String  {
  SessionTime = UserDefaults.standard.object(forKey: "SESSIONTIME") as? String ??  "Demo"
  return SessionTime
}

func getMacAddress() -> String  {
  MacAddress = UserDefaults.standard.object(forKey: "MACADDRESS") as? String ??  "686228DD-DD89-DAB6-CB6F-BD7D981FCEE1"
  return MacAddress
}

func getScoredata() -> Array<String>
{
  
  ScoreData = UserDefaults.standard.object(forKey: "SCOREDATA") as? Array
  if(ScoreData?.count == nil)
  {
    ScoreData = UserDefaults.standard.object(forKey: "REACTSCOREDATA") as? Array
    return  ScoreData ?? []
  }
  return ScoreData ?? []
  /*if let jsonString = UserDefaults.standard.string(forKey: "SCOREDATA") {
    if let data = jsonString.data(using: .utf8),
       let jsonArray = try? JSONSerialization.jsonObject(with: data, options: []) as? [Int] {
      print("ScoreData : \(jsonArray)")
     

     for i in 0..<(jsonArray.count ) {
       ScoreData?.append(String(jsonArray[i]))
       
     }
      return ScoreData ?? []
    } else {
        print("Failed to convert string to array")
      return []
    }
   
  } else {
      print("No string for key")
    return []
  }*/

}



