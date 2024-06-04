//
//  LineChartView.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 15/12/23.
//

import Foundation
import DGCharts
import SwiftUI

struct LineStatisticChartView: UIViewRepresentable {
    var entries: [ChartDataEntry]
    var LabelString: String
    func makeUIView(context: Context) -> LineChartView {
        let chartView = LineChartView()
        return chartView
    }

    func updateUIView(_ uiView: LineChartView, context: Context) {
        let dataSet = LineChartDataSet(entries: entries,label: "Putt No.")
        dataSet.setColor(NSUIColor.red)
        dataSet.lineWidth = 2.0
        dataSet.circleColors = [NSUIColor.red]
        dataSet.circleRadius = 3.0
        dataSet.valueTextColor = NSUIColor.white
        dataSet.drawCircleHoleEnabled = false
        dataSet.drawFilledEnabled = true
        dataSet.fillColor = NSUIColor.red
       

        let dataSets = [dataSet]
        let lineData = LineChartData(dataSets: dataSets)

        let xAxis = uiView.xAxis
        xAxis.labelPosition = .bottom
        xAxis.labelTextColor = NSUIColor.white
        xAxis.labelCount = 1
        xAxis.valueFormatter = DefaultAxisValueFormatter(decimals: 0)
      

        let yAxisLeft = uiView.leftAxis
        yAxisLeft.labelTextColor = NSUIColor.white

        let yAxisRight = uiView.rightAxis
        yAxisRight.enabled = false

        uiView.xAxis.axisMinimum = 1
       // uiView.xAxis.axisMaximum = 10
        uiView.leftAxis.drawGridLinesEnabled = false
        uiView.rightAxis.drawGridLinesEnabled = false
        uiView.xAxis.drawGridLinesEnabled = false
        uiView.data = lineData
        uiView.chartDescription.enabled = false
        uiView.legend.textColor = NSUIColor.white
        uiView.legend.form = .none
        uiView.legend.verticalAlignment = .bottom
        uiView.legend.orientation = .horizontal
        uiView.legend.horizontalAlignment = .center
        uiView.legend.drawInside = false
        uiView.isUserInteractionEnabled = false
        
    }
}
