//
//  SettingView.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//

import SwiftUI

struct SettingView: View {
  @State var sliderFeet: Int = 3
  @State private var settingLieStartDeviation = "5"
  @State private var settingLieStartTarget = "70"
  @State private var settingLieImpactDeviation = "5"
  @State private var settingLieImpactTarget = "70"
  @State private var settingLoftangleDeviation = "5"
  @State private var settingLoftangleTarget = "70"
  @State private var settingAcelerationImpactDeviation = "2"
  @State private var settingAcelerationImpactTarget = "2"
  @State private var switch1 = false
  @State private var switch2 = false
  @State private var switch3 = false
  @State private var switch4 = false
  @Binding var isNavigationSettingLink : Bool
 
  
  var body: some View {
    VStack(){
      Text("Set Distance")
        .font(Font.system(size: 19))
        .foregroundColor(.black)
      if #available (iOS 15.0,*)
      {
        VStack
        {
          Text("\(sliderFeet)")
            .font(Font.system(size: 19))
            .foregroundColor(.appRed)
          Text("Putting Distance")
            .font(Font.system(size: 19))
            .foregroundColor(.black)
        }
        .padding(10)
        .background(Color.appTeal200)
      }
      
      Spacer()
      
      MySliderView(
        sliderDraggingClosure: {item in
          print("Slider dragging end value:", item)
        },
        sliderReleasedClosure:{item in
          print("Slider release value:", item)
          sliderFeet = Int(item)
        }
      )
      .frame(height : 100)
      Spacer()
      
      VStack {
        CardView {
          VStack(alignment: .center, spacing: 15) {
            HStack {
              Spacer()
              Text("Deviation")
                .font(.system(size: 16, weight: .bold))
                .frame(maxWidth: .infinity)
              Text("Target")
                .font(.system(size: 16, weight: .bold))
                .frame(maxWidth: .infinity)
              Spacer()
            }
            .padding(15)
            
            Divider()
            
            CardRow(title: "Angle of lie start", deviation: $settingLieStartDeviation, target: $settingLieStartTarget, switchValue: $switch1)
            Divider()
            
            CardRow(title: "Angle of lie impact", deviation: $settingLieImpactDeviation, target: $settingLieImpactTarget, switchValue: $switch2)
            Divider()
            
            CardRow(title: "Loft Angle", deviation: $settingLoftangleDeviation, target: $settingLoftangleTarget, switchValue: $switch3)
            Divider()
            
            CardRow(title: "Acceleration Impact", deviation: $settingAcelerationImpactDeviation, target: $settingAcelerationImpactTarget, switchValue: $switch4, unit: "m/s\u{00B2}")
          }
        }
      }
      .padding()
      
      HStack
      {
        
        Button("SAVE") {
          // Action to be performed when the button is tapped
          print("Button tapped!")
          let updatedScoreData = [settingLieStartDeviation,settingLieStartTarget,String(switch1),settingLieImpactDeviation,settingLieImpactTarget,String(switch2),settingLoftangleDeviation,settingLoftangleTarget,String(switch3),settingAcelerationImpactDeviation,settingAcelerationImpactTarget,String(switch4)]
          
          UserDefaults.standard.set(updatedScoreData, forKey: "SCOREDATA")
          UserDefaults.standard.set(String(sliderFeet), forKey: "SLIDERVALUE")
          
          self.isNavigationSettingLink.toggle()
          
        }
        .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/)
        .frame(height : 40)
        .foregroundColor( .white)
        .background(Color.appRed)
        .cornerRadius(5)
        
      }.padding(20)
      
    }.padding(.top,20)
      .onAppear{
        var scoredata = getScoredata()
        settingLieStartDeviation = scoredata[0]
        settingLieStartTarget = scoredata[1]
        switch1 = Bool(scoredata[2]) ?? false
        settingLieImpactDeviation = scoredata[3]
        settingLieImpactTarget = scoredata[4]
        switch2 = Bool(scoredata[5]) ?? false
        settingLoftangleDeviation = scoredata[6]
        settingLoftangleTarget = scoredata[7]
        switch3 = Bool(scoredata[8]) ?? false
        settingAcelerationImpactDeviation = scoredata[9]
        settingAcelerationImpactTarget = scoredata[10]
        switch4 = Bool(scoredata[11]) ?? false
        sliderFeet = Int(getSliderValue()) ?? 3
        
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
  
}

/*#Preview {
  SettingView(isNavigationSettingLink: false)
}*/



struct CardRow: View {
    var title: String
    @Binding var deviation: String
    @Binding var target: String
    @Binding var switchValue: Bool
    var unit: String = "\u{00B0}"
    
    var body: some View {
        HStack {
            Spacer()
            Text(title)
                .font(.system(size: 15))
                .frame(maxWidth: .infinity, alignment: .center)
            
            Text("±")
            
            TextField("", text: $deviation,onCommit:  {
              resignFirstResponder()
          })
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.numberPad)
            
            Text(unit)
            
            TextField("", text: $target,onCommit:  {
              resignFirstResponder()
          })
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.numberPad)
            
            Spacer()
            
          Toggle("", isOn: $switchValue)
        }
        .padding(10)
    }
  
  func resignFirstResponder() {
      UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
  }
}

struct CardView<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack {
            content
        }
        .background(RoundedRectangle(cornerRadius: 10).fill(Color.white))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(lineWidth: 1)
                .foregroundColor(Color.gray)
        )
        .padding()
        .shadow(radius: 5)
    }
}


