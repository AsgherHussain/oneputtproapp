//
//  LineChartView.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 23/11/23.
//


import DGCharts
import SwiftUI

class ChartViewModel: ObservableObject {
    @Published var dataArray: [String: Any] = [:]
}



struct LineDGChartView: UIViewRepresentable {
  //@Binding var dataArray: [String: Any]
  @ObservedObject var viewModel: ChartViewModel
  
  func makeUIView(context: Context) -> LineChartView {
      let chartView = LineChartView()
      updateChartView(chartView)
      return chartView
  }

  func updateUIView(_ uiView: LineChartView, context: Context) {
      updateChartView(uiView)
  }

  private func updateChartView(_ chartView: LineChartView) {
      guard let dataArray = viewModel.dataArray as? [String: Any] else { return }
      let frontStrokeEntries = parseValueFromFrontAndBackStroke(dataMap: dataArray, type: "front_stroke")
      let backStrokeEntries = parseValueFromFrontAndBackStroke(dataMap: dataArray, type: "backstroke")

      chartView.rightAxis.enabled = false
      chartView.xAxis.labelPosition = .bottom
      chartView.xAxis.axisMinimum = Double(Float(backStrokeEntries.last?.x ?? 0.0) - 0.4)
      chartView.xAxis.axisMaximum = Double(Float(frontStrokeEntries.last?.x ?? 0.0) + 0.4)
      chartView.leftAxis.axisMinimum = -0.4
      chartView.leftAxis.axisMaximum = 0.3
      chartView.isUserInteractionEnabled = false

      var lines = [LineChartDataSet]()
    let set1 = LineChartDataSet(entries: frontStrokeEntries)
        set1.drawFilledEnabled = true
        set1.fillColor = .white
        set1.lineWidth = 5.0
        
        set1.colors = [.green]
        set1.drawCirclesEnabled = false
        set1.drawFilledEnabled = true
        set1.fillAlpha = 80
        set1.drawValuesEnabled = false
        set1.cubicIntensity = 0.5
 
        let set2 = LineChartDataSet(entries: backStrokeEntries)
        set2.drawFilledEnabled = true
        set2.fillColor = .white
        set2.lineWidth = 5.0
        set2.colors = [.red]
        set2.drawCirclesEnabled = false
        set2.drawValuesEnabled = false
        set2.drawFilledEnabled = true
 
        var dataSets = [LineChartDataSet]()
        dataSets.append(set1)
        dataSets.append(set2)
  
    
  


    
    DispatchQueue.global().async {
      DispatchQueue.main.async {
        let lineData = LineChartData(dataSets: dataSets)
        chartView.data = lineData
        chartView.chartDescription.text = ""
        chartView.xAxis.drawGridLinesEnabled = false
        chartView.leftAxis.drawGridLinesEnabled = false
        chartView.rightAxis.drawGridLinesEnabled = false
      }}
  }

  private func createDataSet(entries: [ChartDataEntry], label: String, fillColor: UIColor, lineColor: UIColor) -> LineChartDataSet {
      let dataSet = LineChartDataSet(entries: entries, label: label)
      dataSet.drawFilledEnabled = true
      dataSet.fillColor = fillColor
      dataSet.lineWidth = 5.0
      dataSet.circleColors = [lineColor]
      dataSet.colors = [lineColor]
      dataSet.drawCirclesEnabled = false
      dataSet.drawValuesEnabled = false
      dataSet.cubicIntensity = 0.5
      return dataSet
  }

  private func parseValueFromFrontAndBackStroke(dataMap: [String: Any], type: String) -> [ChartDataEntry] {
     print("Chart Print Data : \(dataMap[type] as? [[Double]])")
      guard let data = dataMap[type] as? [[Double]] else {
          return []
      }

      var backStrokeX = [String]()
      var backStrokeY = [String]()

      for i in 0..<data.count {
          for j in 0..<data[i].count {
              if j == 1 {
                  backStrokeX.append(String(data[i][j]))
              } else if j == 2 {
                  backStrokeY.append(String(data[i][j]))
              }
          }
      }

      var entries = [ChartDataEntry]()

      for i in 0..<backStrokeY.count {
          if let xValue = Double(backStrokeX[i]), let yValue = Double(backStrokeY[i]) {
              entries.append(ChartDataEntry(x: xValue , y: yValue, data: String(i)))
          }
      }

      return entries
  }

  typealias UIViewType = LineChartView
}
/*struct Line_Previews: PreviewProvider {
  static var previews: some View {
   
    LineDGChartView(DataArray: bestPuttData)
                .frame(height: 300)
  }}*/



