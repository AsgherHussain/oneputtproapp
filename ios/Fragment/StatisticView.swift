//
//  StatisticView.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 26/11/23.
//

import SwiftUI
import DGCharts

struct StatisticView: View {
  @State var isExpandingPutting: Bool = false
  @State var isExpandingLoft: Bool = false
  @State var isExpandingPutterFaceAngle: Bool = false
  @State var isExpandingPutterFacePoistion: Bool = false
  @State var isExpandinglieAngle: Bool = false
  @State var isExpandingAccelerationImpact: Bool = false
  @StateObject private var sessionListViewModel = SessionListViewModel()
  
  @State var puttingTempoList :  [CommonLineChartData] = [] //[CommonLineChartData(value: 0.03, id: 1, index: 1),CommonLineChartData(value: 0.12, id: 1, index: 2)]
  @State var loftAngleList :  [CommonLineChartData] = []
  @State var faceAngleImpactList :  [CommonLineChartData] = []
  @State var lieAngleChangeList :  [CommonLineChartData] = []
  @State var accelerationImpactList :  [CommonLineChartData] = []
  @State var impactPositionList :  [CommonLineChartData] = []
  
  @StateObject private var puttListViewModel = PuttsListViewModel()
  

  
  var body: some View {
    VStack{
      ScrollView{
        ///Putting Tempo
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              
              Text("Putting Tempo")
                .font(.title3)
              Spacer()
              
              HStack(spacing : 30){
                
                Image(isExpandingPutting ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
                
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack{
              // Line(datasets: [dataset1, dataset2]).background(Color.black)
              Text("Tempo").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: puttingTempoList), LabelString: "")
                .frame(height: 200)
            }
            
            
          },
          onTapped: {
            // print("Header tapped!")
            isExpandingPutting.toggle()
            // Add your custom action here
          }
          
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        //.dynamicCardHeight()
        //.listRowSeparator(.hidden)
        
        ///Loft Angle
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              Text("Loft Angle")
                .font(.title3)
              Spacer()
              HStack(spacing : 30){
                
                Image(isExpandingLoft ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack{
              Text("Loft Angle").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: loftAngleList),LabelString: "")
                .frame(height: 200)
            }
            
          },
          onTapped: {
            print("Header tapped!")
            isExpandingLoft.toggle()
            // Add your custom action here
          }
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        
        ///Putter Face Angle
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              Text("Face Angle Impact")
                .font(.title3)
              Spacer()
              HStack(spacing : 30){
                
                Image(isExpandingPutterFaceAngle ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack
            {
              Text("Face Angle").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: faceAngleImpactList),LabelString: "")
                .frame(height: 200)
            }
            
            
          },
          onTapped: {
            print("Header tapped!")
            isExpandingPutterFaceAngle.toggle()
            // Add your custom action here
          }
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        ///Putter Face Position
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              Text("Lie Angle Change")
                .font(.title3)
              Spacer()
              HStack(spacing : 30){
                Image(isExpandingPutterFacePoistion ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack
            {
              Text("Lie Angle").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: lieAngleChangeList),LabelString: "")
                .frame(height: 200)
            }
            
          },
          onTapped: {
            print("Header tapped!")
            isExpandingPutterFacePoistion.toggle()
            // Add your custom action here
          }
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        
        ///Lie Angle
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              Text("Acceleration Impact")
                .font(.title3)
              Spacer()
              HStack(spacing : 30){
                Image(isExpandinglieAngle ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack
            {
              Text("Acceleration Impact").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: accelerationImpactList),LabelString: "")
                .frame(height: 200)
            }
            
          },
          onTapped: {
            print("Header tapped!")
            isExpandinglieAngle.toggle()
            // Add your custom action here
          }
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        ///Acceleration Impact
        ExpandableView(
          headerSize: CGSize(width: 380.0, height: 50.0),
          cardSize: CGSize(width: 380.0, height: 200.0), header: {
            HStack {
              Text("Impact Position")
                .font(.title3)
              Spacer()
              HStack(spacing : 30){
                Image(isExpandingAccelerationImpact ? "ic_arrow_up" :"ic_arrow_down")
                  .resizable()
                  .frame(width: 15,height: 15 )
              }
              
            }
            .padding(10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(LinearGradient(colors: [.gray, .black], startPoint: .topTrailing, endPoint: .bottomLeading))
            
          }, content: {
            HStack{
              Text("Impact Position").rotationEffect(.degrees(-90))
                .fixedSize()
                .frame(width: 30, height: 180)
              LineStatisticChartView(entries: dataValues(dataList: impactPositionList),LabelString: "Impact Position")
                .frame(height: 200)
            }
            
          },
          onTapped: {
            print("Header tapped!")
            isExpandingAccelerationImpact.toggle()
            // Add your custom action here
          }
        )
        .cardBackgroundColor(.black)
        .shadow(shadowRadius: 0.0)
        .foregroundColor(.white)
        .padding(.bottom,15)
        .frame(maxWidth: .infinity)
        .listRowBackground(Color.clear)
        
        
      }.onAppear{
        // let fetchSessionID  =  puttListViewModel.fetchParticularSession(sessionId: 59) as [PuttEntity]
        loadAllGraphs()
      }
      .padding(.top,20)
    }
    
    
  }
  
  func loadAllGraphs() {
    DispatchQueue.global().async {
      DispatchQueue.main.async {
        sessionListViewModel.getAllSessions()
        
        let sessionid = sessionData.map{$0.sessionId}
        if let count = sessionid.last {
          // Use 'count' here
          print("statisticCount: \(count)")
          SESSIONID = Int(count)
         
        } else {
          // Handle the case where 'optionalCount' is nil
          print("Statistic Count is nil")
          SESSIONID = 1
         
        }
       
       
      }}
    
    let fetchSessionID  =  puttListViewModel.fetchParticularSession(sessionId: SESSIONID ?? 0) as [PuttEntity]
    //print("StatisticsSession : \(fetchSessionID)")
    var x = 1
    fetchSessionID.forEach { puttModel in
     
      
      let bbstrokeRatioStr = puttModel.bbstrokeRatio
      let loftAngleStr = String(puttModel.loftAngle)
      let faceAngleImpactStr = String(puttModel.putterFaceAng)
      let lieAngleChangeStr = String(puttModel.angLieStart)
      let accelerationImpactStr = puttModel.accelerationImpact
      let impactPositionStr = String(puttModel.elevationAtImp)
      
      
      
      let bbstrokeRatio = Double(bbstrokeRatioStr ?? "")
      let loftAngle = Double(loftAngleStr)
      let faceAngleImpact = Double(faceAngleImpactStr)
      let lieAngleChange = Double(lieAngleChangeStr)
      let accelerationImpact = Double(accelerationImpactStr ?? "")
      let impactPosition = Double(impactPositionStr)
      
      var dataObject = CommonLineChartData()
      dataObject.value = bbstrokeRatio ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      puttingTempoList.append(dataObject)
      
      dataObject = CommonLineChartData()
      
      dataObject.value = loftAngle ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      loftAngleList.append(dataObject)
      
      dataObject = CommonLineChartData()
      dataObject.value = faceAngleImpact ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      faceAngleImpactList.append(dataObject)
      
      dataObject = CommonLineChartData()
      
      dataObject.value = lieAngleChange ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      lieAngleChangeList.append(dataObject)
      
      dataObject = CommonLineChartData()
      
      dataObject.value = accelerationImpact  ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      accelerationImpactList.append(dataObject)
      
      dataObject = CommonLineChartData()
      dataObject.value = impactPosition ?? 0.0
      dataObject.id  = x + 50  // Adjust the id as needed
      dataObject.index = x
      impactPositionList.append(dataObject)
      
      
      x += 1
      print("X value \(x)")
      
    }
  }

  private func dataValues(dataList: [CommonLineChartData]) -> [ChartDataEntry] {
      var entries = [ChartDataEntry]()

      for i in 0..<dataList.count {
          let dataObject = dataList[i]
        let x = Double(dataObject.index)
        let y = Double(dataObject.value)
          entries.append(ChartDataEntry(x: x, y: y))
      }

      return entries
  }
  
}

#Preview {
    StatisticView()
}

class CommonLineChartData {

    var value: Double
    var id: Int
    var index: Int

    init() {
        self.value = 0.0
        self.id = 0
        self.index = 0
    }

    init(value: Double, id: Int, index: Int) {
        self.value = value
        self.id = id
        self.index = index
    }
}
